import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, FormControlLabel, Switch, MenuItem } from '@mui/material';
import { apoderadoSchema, ApoderadoFormData } from '../../../schemas/dtos/apoderado/ApoderadoSchema';
import { Apoderado } from '../../../schemas/dtos/apoderado/ApoderadoDto';

const ApoderadoForm: React.FC<{ initialData?: Apoderado | null; onSubmit: (d: ApoderadoFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<ApoderadoFormData>({
    resolver: zodResolver(apoderadoSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      contacto: initialData?.contacto || '',
      parentesco: initialData?.parentesco || 'PADRE',
      activo: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}><Controller name="nombre" control={control} render={({ field }) => <TextField {...field} label="Nombre Completo" fullWidth required error={!!errors.nombre} helperText={errors.nombre?.message} />} /></Grid>
        <Grid size={12}><Controller name="contacto" control={control} render={({ field }) => <TextField {...field} label="Contacto (Teléfono/Email)" fullWidth required error={!!errors.contacto} helperText={errors.contacto?.message} />} /></Grid>
        <Grid size={12}>
          <Controller name="parentesco" control={control} render={({ field }) => (
            <TextField {...field} select label="Parentesco" fullWidth required>
              <MenuItem value="PADRE">Padre</MenuItem>
              <MenuItem value="MADRE">Madre</MenuItem>
              <MenuItem value="TUTOR">Tutor Legal</MenuItem>
              <MenuItem value="OTRO">Otro</MenuItem>
            </TextField>
          )} />
        </Grid>
        <Grid size={12}><Controller name="activo" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Activo" />} /></Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Apoderado</Button>
      </Box>
    </Box>
  );
};
export default ApoderadoForm;