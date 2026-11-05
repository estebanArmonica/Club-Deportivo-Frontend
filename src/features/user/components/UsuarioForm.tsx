import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box, TextField, Button, FormControlLabel, Switch, Grid, CircularProgress,
} from '@mui/material';
import { z } from 'zod';
import { 
  usuarioCreateSchema, 
  usuarioUpdateSchema, 
  UsuarioCreateFormData, 
  UsuarioUpdateFormData 
} from '../../../schemas/dtos/user/UsuarioSchema';
import { Usuario } from '../../../schemas/dtos/user/UsuarioDto';

interface UsuarioFormProps {
  initialData?: Usuario | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const isEditing = !!initialData;
  
  // Usamos el esquema correspondiente
  const schema = isEditing ? usuarioUpdateSchema : usuarioCreateSchema;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      email: initialData?.email || '',
      password: '', // Siempre vacío al abrir
      activo: initialData?.isActive ?? true,
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
                label="Nombre Completo"
                fullWidth
                required
                autoFocus
                error={!!errors.nombre}
                helperText={errors.nombre?.message as string}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="email"
                label="Correo Electrónico"
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email?.message as string}
                disabled={isSubmitting}
              />
            )}
          />
        </Grid>

        <Grid size={12}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="password"
                label={isEditing ? "Nueva Contraseña (opcional)" : "Contraseña"}
                fullWidth
                required={!isEditing}
                error={!!errors.password}
                helperText={errors.password?.message as string}
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
                label="Usuario Activo"
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
          {isEditing ? 'Actualizar' : 'Crear'} Usuario
        </Button>
      </Box>
    </Box>
  );
};

export default UsuarioForm;