import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, Autocomplete, CircularProgress, MenuItem } from '@mui/material';
import { reservaSchema, ReservaFormData } from '../../../schemas/dtos/reserva/ReservaSchema';
import { Reserva } from '../../../schemas/dtos/reserva/ReservaDto';
import { equipoService } from '../../../services/equipo/equipo.service';
import { canchaService } from '../../../services/cancha/cancha.service';
import { Equipo } from '../../../schemas/dtos/equipo/EquipoDto';
import { Cancha } from '../../../schemas/dtos/cancha/CanchaDto';

const ReservaForm: React.FC<{ initialData?: Reserva | null; onSubmit: (d: ReservaFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([equipoService.getAll(), canchaService.getAll()]).then(([eqs, cans]) => {
      setEquipos(eqs);
      setCanchas(cans);
    }).finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      id_equipo: (initialData as any)?.equipo?.id || (initialData as any)?.id_equipo || 0,
      id_cancha: (initialData as any)?.cancha?.id || (initialData as any)?.id_cancha || 0,
      fecha: initialData?.fecha?.split('T')[0] || new Date().toISOString().split('T')[0],
      horaInicio: initialData?.horaInicio || '10:00',
      horaFin: initialData?.horaFin || '12:00',
      estado: initialData?.estado || 'PENDIENTE',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="id_equipo" control={control} render={({ field }) => (
            <Autocomplete options={equipos} getOptionLabel={(opt) => opt.nombre} value={equipos.find((e) => e.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Equipo" required error={!!errors.id_equipo} helperText={errors.id_equipo?.message} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}>
          <Controller name="id_cancha" control={control} render={({ field }) => (
            <Autocomplete options={canchas} getOptionLabel={(opt) => opt.nombre} value={canchas.find((c) => c.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Cancha" required error={!!errors.id_cancha} helperText={errors.id_cancha?.message} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}><Controller name="fecha" control={control} render={({ field }) => <TextField {...field} type="date" label="Fecha de Reserva" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}><Controller name="horaInicio" control={control} render={({ field }) => <TextField {...field} type="time" label="Hora Inicio" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}><Controller name="horaFin" control={control} render={({ field }) => <TextField {...field} type="time" label="Hora Fin" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Reserva</Button>
      </Box>
    </Box>
  );
};
export default ReservaForm;