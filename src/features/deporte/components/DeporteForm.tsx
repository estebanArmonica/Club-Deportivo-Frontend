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
import { deporteSchema, DeporteFormData } from '../../../schemas/dtos/deporte/DeporteSchema';
import { Deporte } from '../../../schemas/dtos/deporte/DeporteDto';

interface DeporteFormProps {
  initialData?: Deporte | null;
  onSubmit: (data: DeporteFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const DeporteForm: React.FC<DeporteFormProps> = ({
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
  } = useForm<z.input<typeof deporteSchema>, any, z.output<typeof deporteSchema>>({
    resolver: zodResolver(deporteSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      descripcion: initialData?.descripcion || '',
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
                label="Nombre del Deporte"
                fullWidth
                required
                autoFocus // Para que el cursor empiece aquí al abrir el modal
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
                rows={3}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
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
                label="Activo"
              />
            )}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isEditing ? 'Actualizar' : 'Crear'} Deporte
        </Button>
      </Box>
    </Box>
  );
};

export default DeporteForm;