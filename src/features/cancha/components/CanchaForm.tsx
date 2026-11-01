import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, CircularProgress, Autocomplete, FormControlLabel, Switch } from '@mui/material';
import { z } from 'zod';
import { canchaSchema, CanchaFormData } from '../../../schemas/dtos/cancha/CanchaSchema';
import { Cancha } from '../../../schemas/dtos/cancha/CanchaDto';
import { sucursalService } from '../../../services/sucursal/sucursal.service';
import { Sucursal } from '../../../schemas/dtos/sucursal/SucursalDto';

const CanchaForm: React.FC<{ initialData?: Cancha | null; onSubmit: (d: CanchaFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sucursalService.getAll().then(setSucursales).finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<z.input<typeof canchaSchema>, any, z.output<typeof canchaSchema>>({
    resolver: zodResolver(canchaSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      tipo: initialData?.tipo || '',
      capacidad: initialData?.capacidad || 10,
      id_sucursal: (initialData as any)?.sucursal?.id || (initialData as any)?.id_sucursal || 0,
      disponible: initialData?.disponible ?? true,
      activo: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="nombre" control={control} render={({ field }) => (
            <TextField {...field} label="Nombre de la Cancha" fullWidth required autoFocus error={!!errors.nombre} helperText={errors.nombre?.message} disabled={isSubmitting} />
          )} />
        </Grid>
        <Grid size={6}>
          <Controller name="tipo" control={control} render={({ field }) => (
            <TextField {...field} label="Tipo (Fútbol, Tenis...)" fullWidth required error={!!errors.tipo} helperText={errors.tipo?.message} disabled={isSubmitting} />
          )} />
        </Grid>
        <Grid size={6}>
          <Controller name="capacidad" control={control} render={({ field }) => (
            <TextField {...field} type="number" label="Capacidad" fullWidth required error={!!errors.capacidad} helperText={errors.capacidad?.message} disabled={isSubmitting} onChange={(e) => field.onChange(Number(e.target.value))} />
          )} />
        </Grid>
        <Grid size={12}>
          <Controller name="id_sucursal" control={control} render={({ field }) => (
            <Autocomplete options={sucursales} getOptionLabel={(opt) => opt.nombre} value={sucursales.find((s) => s.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => (
                <TextField {...params} label="Sucursal" required error={!!errors.id_sucursal} helperText={errors.id_sucursal?.message}
                  slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress color="inherit" size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }}
                />
              )} />
          )} />
        </Grid>
        <Grid size={6}>
          <Controller name="disponible" control={control} render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Disponible" />
          )} />
        </Grid>
        <Grid size={6}>
          <Controller name="activo" control={control} render={({ field }) => (
            <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Activa" />
          )} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={20} /> : null}>Guardar Cancha</Button>
      </Box>
    </Box>
  );
};
export default CanchaForm;