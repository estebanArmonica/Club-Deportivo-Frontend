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
import { sucursalSchema, SucursalFormData } from '../../../schemas/dtos/sucursal/SucursalSchema';
import { Sucursal } from '../../../schemas/dtos/sucursal/SucursalDto';
import { clubService } from '../../../services/club/club.service';
import { Club } from '../../../schemas/dtos/club/ClubDto';

interface SucursalFormProps {
  initialData?: Sucursal | null;
  onSubmit: (data: SucursalFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SucursalForm: React.FC<SucursalFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;
  
  const [clubes, setClubes] = useState<Club[]>([]);
  const [loadingClubes, setLoadingClubes] = useState(true);

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const data = await clubService.getAll();
        setClubes(data);
      } catch (error) {
        console.error('Error al cargar clubes', error);
      } finally {
        setLoadingClubes(false);
      }
    };
    fetchClubes();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof sucursalSchema>, any, z.output<typeof sucursalSchema>>({
    resolver: zodResolver(sucursalSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      direccion: initialData?.direccion || '',
      telefono: initialData?.telefono || '',
      // Extraemos el ID del club si viene como objeto o como ID directo
      id_club: (initialData as any)?.club?.id || (initialData as any)?.id_club || 0,
      activa: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de la Sucursal"
                fullWidth
                required
                autoFocus
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="id_club"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={clubes}
                getOptionLabel={(option) => option.nombre}
                value={clubes.find((c) => c.id === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : 0)}
                loading={loadingClubes}
                disabled={isSubmitting || loadingClubes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Club Perteneciente"
                    required
                    error={!!errors.id_club}
                    helperText={errors.id_club?.message}
                    slotProps={{
                      input: {
                        ...params.slotProps.input,
                        endAdornment: (
                          <>
                            {loadingClubes ? <CircularProgress color="inherit" size={20} /> : null}
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
            name="direccion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Dirección"
                fullWidth
                error={!!errors.direccion}
                helperText={errors.direccion?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="telefono"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Teléfono de Contacto"
                fullWidth
                error={!!errors.telefono}
                helperText={errors.telefono?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="activa"
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
                label="Sucursal Activa"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
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
          {isEditing ? 'Actualizar' : 'Crear'} Sucursal
        </Button>
      </Box>
    </Box>
  );
};

export default SucursalForm;