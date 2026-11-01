import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, PlayArrow, CheckCircle } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { claseService } from '../../../services/clase/clase.service';
import ClaseForm from '../components/ClaseForm';

const ClasesPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await claseService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, grupoId: data.id_grupo }; delete payload.id_grupo;
      if (editing) { await claseService.update(editing.id, payload); toast.success('Actualizada'); }
      else { await claseService.create(payload); toast.success('Creada'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleAction = async (id: number, action: 'iniciar' | 'completar') => {
    try {
      if (action === 'iniciar') await claseService.iniciar(id);
      if (action === 'completar') await claseService.completar(id);
      toast.success(`Clase ${action}da`); fetchData();
    } catch { toast.error('Error al cambiar estado'); }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fechClase', headerName: 'Fecha', width: 120 },
    { field: 'horaInicio', headerName: 'Inicio', width: 100 },
    { field: 'horaFin', headerName: 'Fin', width: 100 },
    { field: 'grupo', headerName: 'Grupo', flex: 1, valueGetter: (v, r: any) => r.grupo?.nombre || '-' },
    { field: 'estado', headerName: 'Estado', width: 130, renderCell: (p: GridRenderCellParams) => <Chip label={p.value} color={p.value === 'EN_CURSO' ? 'info' : p.value === 'COMPLETADA' ? 'success' : 'default'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 180, sortable: false, renderCell: (p) => (
      <Box>
        <Tooltip title="Iniciar"><IconButton color="info" onClick={() => handleAction(p.row.id, 'iniciar')}><PlayArrow /></IconButton></Tooltip>
        <Tooltip title="Completar"><IconButton color="success" onClick={() => handleAction(p.row.id, 'completar')}><CheckCircle /></IconButton></Tooltip>
        <IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton>
      </Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Clases</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Agregar Clase</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Clase</DialogTitle>
        <DialogContent dividers><ClaseForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default ClasesPage;