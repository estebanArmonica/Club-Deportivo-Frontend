import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, Autocomplete, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { asistenciaSchema, AsistenciaFormData } from '../../../schemas/dtos/asistencia/AsistenciaSchema';
import { claseService } from '../../../services/clase/clase.service';
import { pagoService } from '../../../services/pago/pago.service';

const AsistenciaForm: React.FC<{ initialData?: any; onSubmit: (d: AsistenciaFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [clases, setClases] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([claseService.getAll(), pagoService.getAll()]).then(([c, p]) => { setClases(c); setPagos(p); }).finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(asistenciaSchema),
    defaultValues: {
      id_clase: (initialData as any)?.clase?.id || 0,
      id_pago: (initialData as any)?.pago?.id || 0,
      fecha: initialData?.fecha?.split('T')[0] || new Date().toISOString().split('T')[0],
      asistio: initialData?.asistio ?? true,
    },
  });

  const renderAutocomplete = (name: string, label: string, options: any[], getLabel: (o:any)=>string) => (
    <Controller name={name} control={control} render={({ field }) => (
      <Autocomplete options={options} getOptionLabel={getLabel} value={options.find((o) => o.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
        renderInput={(params) => <TextField {...params} label={label} required error={!!errors[name]} helperText={errors[name]?.message as string} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
      />
    )} />
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>{renderAutocomplete('id_clase', 'Clase', clases, (o) => `ID: ${o.id} - Fecha: ${o.fechClase}`)}</Grid>
        <Grid size={12}>{renderAutocomplete('id_pago', 'Pago (Mensualidad)', pagos, (o) => `ID: ${o.id} - $${o.monto}`)}</Grid>
        <Grid size={12}><Controller name="fecha" control={control} render={({ field }) => <TextField {...field} type="date" label="Fecha" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={12}><Controller name="asistio" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="¿Asistió?" />} /></Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Asistencia</Button>
      </Box>
    </Box>
  );
};
export default AsistenciaForm;