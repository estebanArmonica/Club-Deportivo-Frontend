import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, Autocomplete, CircularProgress, MenuItem } from '@mui/material';
import { encargadoSchema, EncargadoFormData } from '../../../schemas/dtos/encargadoSucursal/EncargadoSucursalSchema';
import { usuarioService } from '../../../services/user/usuario.service';
import { sucursalService } from '../../../services/sucursal/sucursal.service';

const EncargadoForm: React.FC<{ initialData?: any; onSubmit: (d: EncargadoFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usuarioService.getAll(), sucursalService.getAll()]).then(([u, s]) => { setUsuarios(u.content || u); setSucursales(s); }).finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(encargadoSchema),
    defaultValues: {
      id_usuario: initialData?.usuario?.id || 0,
      id_sucursal: initialData?.sucursal?.id || 0,
      turno: initialData?.turno || 'MAÑANA',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="id_usuario" control={control} render={({ field }) => (
            <Autocomplete options={usuarios} getOptionLabel={(opt) => opt.nombre} value={usuarios.find((u) => u.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Usuario Encargado" required error={!!errors.id_usuario} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}>
          <Controller name="id_sucursal" control={control} render={({ field }) => (
            <Autocomplete options={sucursales} getOptionLabel={(opt) => opt.nombre} value={sucursales.find((s) => s.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Sucursal" required error={!!errors.id_sucursal} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}>
          <Controller name="turno" control={control} render={({ field }) => (
            <TextField {...field} select label="Turno" fullWidth required>
              <MenuItem value="MAÑANA">Mañana</MenuItem>
              <MenuItem value="TARDE">Tarde</MenuItem>
              <MenuItem value="NOCHE">Noche</MenuItem>
            </TextField>
          )} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Asignación</Button>
      </Box>
    </Box>
  );
};
export default EncargadoForm;