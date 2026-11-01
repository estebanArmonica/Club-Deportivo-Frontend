import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, PlayArrow, Pause, Stop } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { inscripcionService } from '../../../services/inscripcion/inscripcion.service';
import InscripcionForm from '../components/InscripcionForm';

const InscripcionesPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await inscripcionService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, alumnoId: data.id_alumno, grupoId: data.id_grupo, apoderadoId: data.id_apoderado };
      delete payload.id_alumno; delete payload.id_grupo; delete payload.id_apoderado;
      
      if (editing) { await inscripcionService.update(editing.id, payload); toast.success('Actualizada'); }
      else { await inscripcionService.create(payload); toast.success('Creada'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleAction = async (id: number, action: 'suspender' | 'finalizar') => {
    const res = await Swal.fire({ title: `¿${action.toUpperCase()}?`, text: 'Cambiará el estado de la inscripción', icon: 'question', showCancelButton: true });
    if (res.isConfirmed) {
      try {
        if (action === 'suspender') await inscripcionService.suspender(id);
        if (action === 'finalizar') await inscripcionService.finalizar(id);
        toast.success(`Inscripción ${action}da`); fetchData();
      } catch { toast.error('Error'); }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'alumno', headerName: 'Alumno', flex: 1, valueGetter: (v, r: any) => r.alumno?.nombre + ' ' + (r.alumno?.apellido || '') },
    { field: 'grupo', headerName: 'Grupo', flex: 1, valueGetter: (v, r: any) => r.grupo?.nombre || '-' },
    { field: 'estado', headerName: 'Estado', width: 130, renderCell: (p: GridRenderCellParams) => <Chip label={p.value} color={p.value === 'ACTIVA' ? 'success' : p.value === 'SUSPENDIDA' ? 'warning' : 'default'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 180, sortable: false, renderCell: (p) => (
      <Box>
        <Tooltip title="Suspender"><IconButton color="warning" onClick={() => handleAction(p.row.id, 'suspender')}><Pause /></IconButton></Tooltip>
        <Tooltip title="Finalizar"><IconButton color="success" onClick={() => handleAction(p.row.id, 'finalizar')}><Stop /></IconButton></Tooltip>
        <IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton>
      </Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Inscripciones</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Agregar Inscripción</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Inscripción</DialogTitle>
        <DialogContent dividers><InscripcionForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default InscripcionesPage;