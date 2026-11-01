import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Cancel, CheckCircle } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { reservaService } from '../../../services/reserva/reserva.service';
import ReservaForm from '../components/ReservaForm';

const ReservasPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await reservaService.getAll()); }
    catch { toast.error('Error al cargar reservas'); } 
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Mapeo de IDs para el backend
      const payload = { ...data, equipoId: data.id_equipo, canchaId: data.id_cancha }; 
      delete payload.id_equipo; 
      delete payload.id_cancha;
      
      if (editing) { await reservaService.update(editing.id, payload); toast.success('Reserva actualizada'); }
      else { await reservaService.create(payload); toast.success('Reserva creada'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar. Verifica la disponibilidad'); } 
    finally { setIsSubmitting(false); }
  };

  // Acciones rápidas (Cancelar / Completar)
  const handleAction = async (id: number, action: 'cancelar' | 'completar') => {
    const res = await Swal.fire({ 
      title: `¿Estás seguro de ${action}?`, 
      icon: 'question', 
      showCancelButton: true,
      confirmButtonColor: action === 'cancelar' ? '#d33' : '#1B5E20',
      confirmButtonText: 'Sí, confirmar'
    });
    
    if (res.isConfirmed) {
      try {
        if (action === 'cancelar') await reservaService.cancelar(id);
        if (action === 'completar') await reservaService.completar(id);
        toast.success(`Reserva ${action}da con éxito`); 
        fetchData();
      } catch { toast.error('Error al cambiar estado'); }
    }
  };

  const handleDelete = async (id: number) => {
    if ((await Swal.fire({ title: '¿Eliminar reserva?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })).isConfirmed) {
      try { await reservaService.delete(id); toast.success('Reserva eliminada'); fetchData(); } 
      catch { toast.error('No se pudo eliminar'); }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fecha', headerName: 'Fecha', width: 120 },
    { field: 'horaInicio', headerName: 'Inicio', width: 100 },
    { field: 'horaFin', headerName: 'Fin', width: 100 },
    { field: 'equipo', headerName: 'Equipo', flex: 1, valueGetter: (v, r: any) => r.equipo?.nombre || '-' },
    { field: 'cancha', headerName: 'Cancha', flex: 1, valueGetter: (v, r: any) => r.cancha?.nombre || '-' },
    { field: 'estado', headerName: 'Estado', width: 130, renderCell: (p: GridRenderCellParams) => <Chip label={p.value} color={p.value === 'COMPLETADA' ? 'success' : p.value === 'CANCELADA' ? 'error' : 'warning'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 180, sortable: false, renderCell: (p) => (
      <Box>
        <Tooltip title="Cancelar Reserva"><IconButton color="error" onClick={() => handleAction(p.row.id, 'cancelar')}><Cancel /></IconButton></Tooltip>
        <Tooltip title="Marcar Completada"><IconButton color="success" onClick={() => handleAction(p.row.id, 'completar')}><CheckCircle /></IconButton></Tooltip>
        <IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton>
        <IconButton color="inherit" size="small" onClick={() => handleDelete(p.row.id)}><DeleteIcon fontSize="small" /></IconButton>
      </Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Reservas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20', '&:hover': { bgcolor: '#0D3B0F' } }}>Nueva Reserva</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          loading={loading} 
          pageSizeOptions={[10, 25]} 
          disableRowSelectionOnClick 
          getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'}
          sx={{ border: 'none', '& .row-odd': { backgroundColor: '#f9fafb' }, '& .MuiDataGrid-row:hover': { bgcolor: 'rgba(27, 94, 32, 0.04)' } }}
        />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>{editing ? 'Editar' : 'Nueva'} Reserva</DialogTitle>
        <DialogContent dividers>
          <ReservaForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default ReservasPage;