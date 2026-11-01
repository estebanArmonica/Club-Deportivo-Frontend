import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, MenuItem } from '@mui/material';
import { z } from 'zod';
import { pagoSchema, PagoFormData } from '../../../schemas/dtos/pago/PagoSchema';
import { Pago } from '../../../schemas/dtos/pago/PagoDto';

const PagoForm: React.FC<{ initialData?: Pago | null; onSubmit: (d: PagoFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof pagoSchema>, any, z.output<typeof pagoSchema>>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      monto: initialData?.monto || 0,
      fecha: initialData?.fecha?.split('T')[0] || new Date().toISOString().split('T')[0],
      metodoPago: initialData?.metodoPago || 'EFECTIVO',
      estado: initialData?.estado || 'PENDIENTE',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={6}><Controller name="monto" control={control} render={({ field }) => <TextField {...field} type="number" label="Monto" fullWidth required error={!!errors.monto} helperText={errors.monto?.message} onChange={(e) => field.onChange(Number(e.target.value))} />} /></Grid>
        <Grid size={6}><Controller name="fecha" control={control} render={({ field }) => <TextField {...field} type="date" label="Fecha" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}>
          <Controller name="metodoPago" control={control} render={({ field }) => (
            <TextField {...field} select label="Método de Pago" fullWidth required>
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="TARJETA">Tarjeta</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
            </TextField>
          )} />
        </Grid>
        <Grid size={6}>
          <Controller name="estado" control={control} render={({ field }) => (
            <TextField {...field} select label="Estado" fullWidth required>
              <MenuItem value="PENDIENTE">Pendiente</MenuItem>
              <MenuItem value="PAGADO">Pagado</MenuItem>
              <MenuItem value="CANCELADO">Cancelado</MenuItem>
            </TextField>
          )} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Pago</Button>
      </Box>
    </Box>
  );
};
export default PagoForm;