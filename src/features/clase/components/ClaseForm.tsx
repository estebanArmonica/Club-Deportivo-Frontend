import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, Autocomplete, CircularProgress, MenuItem } from '@mui/material';
import { claseSchema, ClaseFormData } from '../../../schemas/dtos/clase/ClaseSchema';
import { Clase } from '../../../schemas/dtos/clase/ClaseDto';
import { grupoService } from '../../../services/grupo/grupo.service';
import { Grupo } from '../../../schemas/dtos/grupo/GrupoDto';

const ClaseForm: React.FC<{ initialData?: Clase | null; onSubmit: (d: ClaseFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grupoService.getAll().then(setGrupos).finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(claseSchema),
    defaultValues: {
      id_grupo: (initialData as any)?.grupo?.id || (initialData as any)?.id_grupo || 0,
      fechClase: initialData?.fechClase?.split('T')[0] || new Date().toISOString().split('T')[0],
      horaInicio: initialData?.horaInicio || '08:00',
      horaFin: initialData?.horaFin || '10:00',
      estado: initialData?.estado || 'PROGRAMADA',
      activo: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="id_grupo" control={control} render={({ field }) => (
            <Autocomplete options={grupos} getOptionLabel={(opt) => opt.nombre} value={grupos.find((g) => g.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Grupo" required error={!!errors.id_grupo} helperText={errors.id_grupo?.message} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}><Controller name="fechClase" control={control} render={({ field }) => <TextField {...field} type="date" label="Fecha de la Clase" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}><Controller name="horaInicio" control={control} render={({ field }) => <TextField {...field} type="time" label="Hora Inicio" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}><Controller name="horaFin" control={control} render={({ field }) => <TextField {...field} type="time" label="Hora Fin" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={12}>
          <Controller name="estado" control={control} render={({ field }) => (
            <TextField {...field} select label="Estado" fullWidth>
              <MenuItem value="PROGRAMADA">Programada</MenuItem>
              <MenuItem value="EN_CURSO">En Curso</MenuItem>
              <MenuItem value="COMPLETADA">Completada</MenuItem>
              <MenuItem value="CANCELADA">Cancelada</MenuItem>
            </TextField>
          )} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Clase</Button>
      </Box>
    </Box>
  );
};
export default ClaseForm;