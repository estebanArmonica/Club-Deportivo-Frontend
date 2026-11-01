import React from 'react';
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
} from '@mui/material';
import { z } from 'zod';
import { alumnoSchema, AlumnoFormData } from '../../../schemas/dtos/alumno/AlumnoSchema';
import { Alumno } from '../../../schemas/dtos/alumno/AlumnoDto';

interface AlumnoFormProps {
  initialData?: Alumno | null;
  onSubmit: (data: AlumnoFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AlumnoForm: React.FC<AlumnoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof alumnoSchema>, any, z.output<typeof alumnoSchema>>({
    resolver: zodResolver(alumnoSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      apellido: initialData?.apellido || '',
      rut: initialData?.rut || '',
      // Si initialData tiene fechas, las extraemos en formato YYYY-MM-DD
      fechaNacimiento: (initialData as any)?.fechaNacimiento?.split('T')[0] || '',
      fechInscripcion: (initialData as any)?.fechInscripcion?.split('T')[0] || new Date().toISOString().split('T')[0],
      activo: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={6}>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre"
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
            name="apellido"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Apellido"
                fullWidth
                required
                error={!!errors.apellido}
                helperText={errors.apellido?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="rut"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="RUT (Ej: 12345678-9)"
                fullWidth
                required
                error={!!errors.rut}
                helperText={errors.rut?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="fechaNacimiento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Fecha de Nacimiento"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.fechaNacimiento}
                helperText={errors.fechaNacimiento?.message}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={6}>
          <Controller
            name="fechInscripcion"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Fecha de Inscripción"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                error={!!errors.fechInscripcion}
                helperText={errors.fechInscripcion?.message}
                disabled={isSubmitting}
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
                label="Alumno Activo"
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
          {isEditing ? 'Actualizar' : 'Crear'} Alumno
        </Button>
      </Box>
    </Box>
  );
};

export default AlumnoForm;