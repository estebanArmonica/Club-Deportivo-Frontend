import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField, Button, Grid, Autocomplete, CircularProgress, MenuItem } from '@mui/material';
import { inscripcionSchema, InscripcionFormData } from '../../../schemas/dtos/inscripcion/InscripcionSchema';
import { Inscripcion } from '../../../schemas/dtos/inscripcion/InscripcionDto';
import { alumnoService } from '../../../services/alumno/alumno.service';
import { grupoService } from '../../../services/grupo/grupo.service';
import { apoderadoService } from '../../../services/apoderado/apoderado.service';

const InscripcionForm: React.FC<{ initialData?: Inscripcion | null; onSubmit: (d: InscripcionFormData) => Promise<void>; onCancel: () => void; isSubmitting?: boolean; }> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [apoderados, setApoderados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([alumnoService.getAll(), grupoService.getAll(), apoderadoService.getAll()])
      .then(([a, g, ap]) => { setAlumnos(a); setGrupos(g); setApoderados(ap); })
      .finally(() => setLoading(false));
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(inscripcionSchema),
    defaultValues: {
      id_alumno: (initialData as any)?.alumno?.id || 0,
      id_grupo: (initialData as any)?.grupo?.id || 0,
      id_apoderado: (initialData as any)?.apoderado?.id || 0,
      fechaInscripcion: initialData?.fechaInscripcion?.split('T')[0] || new Date().toISOString().split('T')[0],
      estado: initialData?.estado || 'ACTIVA',
    },
  });

  const renderAutocomplete = (name: string, label: string, options: any[]) => (
    <Controller name={name} control={control} render={({ field }) => (
      <Autocomplete options={options} getOptionLabel={(opt) => opt.nombre || opt.rut || ''} value={options.find((o) => o.id === field.value) || null} onChange={(_, val) => field.onChange(val ? val.id : 0)} loading={loading} disabled={isSubmitting || loading}
        renderInput={(params) => <TextField {...params} label={label} required error={!!errors[name]} helperText={errors[name]?.message as string} slotProps={{ input: { ...params.slotProps.input, endAdornment: (<>{loading ? <CircularProgress size={20} /> : null}{params.slotProps.input?.endAdornment}</>) } }} />}
      />
    )} />
  );

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid size={12}>{renderAutocomplete('id_alumno', 'Alumno', alumnos)}</Grid>
        <Grid size={12}>{renderAutocomplete('id_grupo', 'Grupo', grupos)}</Grid>
        <Grid size={12}>{renderAutocomplete('id_apoderado', 'Apoderado', apoderados)}</Grid>
        <Grid size={6}><Controller name="fechaInscripcion" control={control} render={({ field }) => <TextField {...field} type="date" label="Fecha Inscripción" fullWidth required InputLabelProps={{ shrink: true }} />} /></Grid>
        <Grid size={6}>
          <Controller name="estado" control={control} render={({ field }) => (
            <TextField {...field} select label="Estado" fullWidth>
              <MenuItem value="ACTIVA">Activa</MenuItem>
              <MenuItem value="SUSPENDIDA">Suspendida</MenuItem>
              <MenuItem value="FINALIZADA">Finalizada</MenuItem>
            </TextField>
          )} />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>Guardar Inscripción</Button>
      </Box>
    </Box>
  );
};
export default InscripcionForm;