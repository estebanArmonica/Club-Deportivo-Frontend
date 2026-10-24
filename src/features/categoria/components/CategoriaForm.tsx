import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Grid,
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { z } from 'zod';
import { categoriaSchema, CategoriaFormData } from '../../../schemas/dtos/cate/CategoriaSchema';
import { Categoria } from '../../../schemas/dtos/cate/CategoriaDto';
import { deporteService } from '../../../services/deporte/deporte.service';
import { Deporte } from '../../../schemas/dtos/deporte/DeporteDto';

interface CategoriaFormProps {
  initialData?: Categoria | null;
  onSubmit: (data: CategoriaFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loadingDeportes, setLoadingDeportes] = useState(true);

  // Cargar los deportes para el select
  useEffect(() => {
    const fetchDeportes = async () => {
      try {
        const data = await deporteService.getAll();
        setDeportes(data);
      } catch (error) {
        console.error('Error al cargar deportes', error);
      } finally {
        setLoadingDeportes(false);
      }
    };
    fetchDeportes();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof categoriaSchema>, any, z.output<typeof categoriaSchema>>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
      edadMin: (initialData as any)?.edadMin || 0,
      edadMax: (initialData as any)?.edadMax || 0,
      id_deporte: initialData?.deporte?.id || (initialData as any)?.id_deporte || 0,
      activo: initialData?.activa ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de la Categoría"
                fullWidth
                required
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="descripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descripción"
                fullWidth
                multiline
                rows={2}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="edadMin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Edad Mínima"
                fullWidth
                error={!!errors.edadMin}
                helperText={errors.edadMin?.message}
                disabled={isSubmitting}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="edadMax"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Edad Máxima"
                fullWidth
                error={!!errors.edadMax}
                helperText={errors.edadMax?.message}
                disabled={isSubmitting}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="id_deporte"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={deportes}
                getOptionLabel={(option) => option.nombre}
                value={deportes.find((d) => d.id === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : 0)}
                loading={loadingDeportes}
                disabled={isSubmitting || loadingDeportes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Deporte Asociado"
                    required
                    error={!!errors.id_deporte}
                    helperText={errors.id_deporte?.message}
                    slotProps={{
                      input: {
                        ...params.slotProps.input,
                        endAdornment: (
                          <>
                            {loadingDeportes ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.slotProps.input?.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="activo"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    disabled={isSubmitting}
                  />
                }
                label="Activo"
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {isEditing ? 'Actualizar' : 'Crear'} Categoría
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoriaForm;