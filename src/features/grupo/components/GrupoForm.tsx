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
import { grupoSchema, GrupoFormData } from '../../../schemas/dtos/grupo/GrupoSchema';
import { Grupo } from '../../../schemas/dtos/grupo/GrupoDto';
import { categoriaService } from '../../../services/cate/categoria.service';
import { sucursalService } from '../../../services/sucursal/sucursal.service';
import { Categoria } from '../../../schemas/dtos/cate/CategoriaDto';
import { Sucursal } from '../../../schemas/dtos/sucursal/SucursalDto';

interface GrupoFormProps {
  initialData?: Grupo | null;
  onSubmit: (data: GrupoFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const GrupoForm: React.FC<GrupoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;
  
  // Estados para las listas de los selects
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loadingSelects, setLoadingSelects] = useState(true);

  // Cargar Categorías y Sucursales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, sucs] = await Promise.all([
          categoriaService.getAll(),
          sucursalService.getAll(),
        ]);
        setCategorias(cats);
        setSucursales(sucs);
      } catch (error) {
        console.error('Error al cargar categorias/sucursales', error);
      } finally {
        setLoadingSelects(false);
      }
    };
    fetchData();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof grupoSchema>, any, z.output<typeof grupoSchema>>({
    resolver: zodResolver(grupoSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      precio: initialData?.precio || 0,
      capacidad: initialData?.capacidad || 10,
      horaInicio: initialData?.horaInicio || '',
      horaFin: initialData?.horaFin || '',
      // Usamos casteo por si el DTO viene con la relación como objeto
      id_categoria: (initialData as any)?.categoria?.id || (initialData as any)?.id_categoria || 0,
      id_sucursal: (initialData as any)?.sucursal?.id || (initialData as any)?.id_sucursal || 0,
      activo: initialData?.activo ?? true,
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
                label="Nombre del Grupo"
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

        <Grid size={6}>
          <Controller
            name="precio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Precio Mensual"
                fullWidth
                error={!!errors.precio}
                helperText={errors.precio?.message}
                disabled={isSubmitting}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="capacidad"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Capacidad (Alumnos)"
                fullWidth
                error={!!errors.capacidad}
                helperText={errors.capacidad?.message}
                disabled={isSubmitting}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="horaInicio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                label="Hora Inicio"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.horaInicio}
                helperText={errors.horaInicio?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="horaFin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="time"
                label="Hora Fin"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.horaFin}
                helperText={errors.horaFin?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        {/* SELECT CATEGORIA */}
        <Grid size={6}>
          <Controller
            name="id_categoria"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={categorias}
                getOptionLabel={(option) => option.nombre}
                value={categorias.find((c) => c.id === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : 0)}
                loading={loadingSelects}
                disabled={isSubmitting || loadingSelects}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Categoría"
                    required
                    error={!!errors.id_categoria}
                    helperText={errors.id_categoria?.message}
                    slotProps={{
                      input: {
                        ...params.slotProps.input,
                        endAdornment: (
                          <>
                            {loadingSelects ? <CircularProgress color="inherit" size={20} /> : null}
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

        {/* SELECT SUCURSAL */}
        <Grid size={6}>
          <Controller
            name="id_sucursal"
            control={control}
            render={({ field }) => (
              <Autocomplete
                options={sucursales}
                getOptionLabel={(option) => option.nombre}
                value={sucursales.find((s) => s.id === field.value) || null}
                onChange={(_, newValue) => field.onChange(newValue ? newValue.id : 0)}
                loading={loadingSelects}
                disabled={isSubmitting || loadingSelects}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Sucursal"
                    required
                    error={!!errors.id_sucursal}
                    helperText={errors.id_sucursal?.message}
                    slotProps={{
                      input: {
                        ...params.slotProps.input,
                        endAdornment: (
                          <>
                            {loadingSelects ? <CircularProgress color="inherit" size={20} /> : null}
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
          {isEditing ? 'Actualizar' : 'Crear'} Grupo
        </Button>
      </Box>
    </Box>
  );
};

export default GrupoForm;