import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Cancel, CheckCircle } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { reservaService } from '../../../services/reserva/reserva.service';
import ReservaForm from '../../reserva/components/ReservaForm';

const ReservasPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await reservaService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, equipoId: data.id_equipo, canchaId: data.id_cancha }; delete payload.id_equipo; delete payload.id_cancha;
      if (editing) { await reservaService.update(editing.id, payload); toast.success('Actualizada'); }
      else { await reservaService.create(payload); toast.success('Creada'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleAction = async (id: number, action: 'cancelar' | 'completar') => {
    const res = await Swal.fire({ title: `¿${action.toUpperCase()}?`, icon: 'question', showCancelButton: true });
    if (res.isConfirmed) {
      try {
        if (action === 'cancelar') await reservaService.cancelar(id);
        if (action === 'completar') await reservaService.completar(id);
        toast.success(`Reserva ${action}da`); fetchData();
      } catch { toast.error('Error'); }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fecha', headerName: 'Fecha', width: 120 },
    { field: 'horaInicio', headerName: 'Inicio', width: 100 },
    { field: 'horaFin', headerName: 'Fin', width: 100 },
    { field: 'equipo', headerName: 'Equipo', flex: 1, valueGetter: (v, r: any) => r.equipo?.nombre || '-' },
    { field: 'cancha', headerName: 'Cancha', flex: 1, valueGetter: (v, r: any) => r.cancha?.nombre || '-' },
    { field: 'estado', headerName: 'Estado', width: 130, renderCell: (p: GridRenderCellParams) => <Chip label={p.value} color={p.value === 'COMPLETADA' ? 'success' : p.value === 'CANCELADA' ? 'error' : 'default'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 180, sortable: false, renderCell: (p) => (
      <Box>
        <Tooltip title="Cancelar"><IconButton color="error" onClick={() => handleAction(p.row.id, 'cancelar')}><Cancel /></IconButton></Tooltip>
        <Tooltip title="Completar"><IconButton color="success" onClick={() => handleAction(p.row.id, 'completar')}><CheckCircle /></IconButton></Tooltip>
        <IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton>
      </Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Reservas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Agregar Reserva</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Reserva</DialogTitle>
        <DialogContent dividers><ReservaForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default ReservasPage;