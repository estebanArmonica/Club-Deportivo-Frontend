import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { canchaService } from '../../../services/cancha/cancha.service';
import { Cancha } from '../../../schemas/dtos/cancha/CanchaDto';
import CanchaForm from '../components/CanchaForm';

const CanchasPage = () => {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<Cancha | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setCanchas(await canchaService.getAll()); }
    catch { toast.error('Error al cargar'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, sucursalId: data.id_sucursal }; delete payload.id_sucursal;
      if (editing) { await canchaService.update(editing.id, payload); toast.success('Actualizada'); }
      else { await canchaService.create(payload); toast.success('Creada'); }
      setOpenModal(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if ((await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })).isConfirmed) {
      await canchaService.delete(id); toast.success('Eliminada'); fetchData();
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    { field: 'capacidad', headerName: 'Capacidad', width: 100 },
    { field: 'disponible', headerName: 'Disponible', width: 120, renderCell: (p: GridRenderCellParams) => <Chip label={p.value ? 'Sí' : 'No'} color={p.value ? 'success' : 'error'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 120, sortable: false, renderCell: (p) => (
      <Box><IconButton color="primary" onClick={() => { setEditing(p.row as Cancha); setOpenModal(true); }}><EditIcon /></IconButton><IconButton color="error" onClick={() => handleDelete(p.row.id)}><DeleteIcon /></IconButton></Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Canchas</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpenModal(true); }} sx={{ bgcolor: '#1B5E20', '&:hover': { bgcolor: '#0D3B0F' } }}>Agregar Cancha</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={canchas} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Cancha</DialogTitle>
        <DialogContent dividers><CanchaForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpenModal(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default CanchasPage;