import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { encargadoSucursalService } from '../../../services/encargadoSucursal/encargadoSucursal.service';
import EncargadoForm from '../components/EncargadoForm';

const EncargadosPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await encargadoSucursalService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, usuarioId: data.id_usuario, sucursalId: data.id_sucursal }; delete payload.id_usuario; delete payload.id_sucursal;
      if (editing) { await encargadoSucursalService.update(editing.id, payload); toast.success('Actualizado'); }
      else { await encargadoSucursalService.create(payload); toast.success('Creado'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if ((await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true })).isConfirmed) {
      await encargadoSucursalService.delete(id); toast.success('Eliminado'); fetchData();
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'usuario', headerName: 'Encargado', flex: 1, valueGetter: (v, r: any) => r.usuario?.nombre || '-' },
    { field: 'sucursal', headerName: 'Sucursal', flex: 1, valueGetter: (v, r: any) => r.sucursal?.nombre || '-' },
    { field: 'turno', headerName: 'Turno', width: 130 },
    { field: 'acciones', headerName: 'Acciones', width: 120, sortable: false, renderCell: (p) => (
      <Box><IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton><IconButton color="error" onClick={() => handleDelete(p.row.id)}><DeleteIcon /></IconButton></Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Encargados de Sucursal</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Agregar Encargado</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Asignación</DialogTitle>
        <DialogContent dividers><EncargadoForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default EncargadosPage;