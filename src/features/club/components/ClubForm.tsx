import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { z } from 'zod';
import { clubSchema, ClubFormData } from '../../../schemas/dtos/club/ClubSchema';
import { Club } from '../../../schemas/dtos/club/ClubDto';

const ClubForm: React.FC<{ initialData?: Club | null; onSubmit: (d: ClubFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof clubSchema>, any, z.output<typeof clubSchema>>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      cuit: initialData?.cuit || '',
      email: initialData?.email || '',
      direccion: initialData?.direccion || '',
      fechCreacion: initialData?.fechCreacion?.split('T')[0] || new Date().toISOString().split('T')[0],
      activo: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}><Controller name="nombre" control={control} render={({ field }) => <TextField {...field} label="Nombre del Club" fullWidth required error={!!errors.nombre} helperText={errors.nombre?.message} />} /></Grid>
        <Grid size={6}><Controller name="cuit" control={control} render={({ field }) => <TextField {...field} label="CUIT" fullWidth required error={!!errors.cuit} helperText={errors.cuit?.message} />} /></Grid>
        <Grid size={6}><Controller name="email" control={control} render={({ field }) => <TextField {...field} label="Email" fullWidth required error={!!errors.email} helperText={errors.email?.message} />} /></Grid>
        <Grid size={12}><Controller name="direccion" control={control} render={({ field }) => <TextField {...field} label="Dirección" fullWidth />} /></Grid>
        <Grid size={6}><Controller name="fechCreacion" control={control} render={({ field }) => <TextField {...field} type="date" label="Fecha Creación" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}><Controller name="activo" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Activo" />} /></Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Club</Button>
      </Box>
    </Box>
  );
};
export default ClubForm;