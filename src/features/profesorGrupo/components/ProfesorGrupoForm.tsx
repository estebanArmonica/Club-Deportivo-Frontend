import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, Autocomplete, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { profesorGrupoSchema, ProfesorGrupoFormData } from '../../../schemas/dtos/profesorGrupo/ProfesorGrupoSchema';
import { usuarioService } from '../../../services/user/usuario.service';
import { grupoService } from '../../../services/grupo/grupo.service';

const ProfesorGrupoForm: React.FC<{ initialData?: any; onSubmit: (d: ProfesorGrupoFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([usuarioService.getAll(), grupoService.getAll()]).then(([u, g]) => { setUsuarios(u.content || u); setGrupos(g); }).finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(profesorGrupoSchema),
    defaultValues: {
      id_usuario: initialData?.usuario?.id || 0,
      id_grupo: initialData?.grupo?.id || 0,
      activo: initialData?.activo ?? true,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Controller name="id_usuario" control={control} render={({ field }) => (
            <Autocomplete options={usuarios} getOptionLabel={(opt) => opt.nombre} value={usuarios.find((u) => u.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Profesor" required error={!!errors.id_usuario} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}>
          <Controller name="id_grupo" control={control} render={({ field }) => (
            <Autocomplete options={grupos} getOptionLabel={(opt) => opt.nombre} value={grupos.find((g) => g.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
              renderInput={(params) => <TextField {...params} label="Grupo" required error={!!errors.id_grupo} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
            />
          )} />
        </Grid>
        <Grid size={12}>
          <Controller name="activo" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />} label="Asignación Activa" />} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Asignación</Button>
      </Box>
    </Box>
  );
};
export default ProfesorGrupoForm;