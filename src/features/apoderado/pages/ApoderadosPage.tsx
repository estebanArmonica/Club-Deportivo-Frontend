import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { apoderadoService } from '../../../services/apoderado/apoderado.service';
import ApoderadoForm from '../components/ApoderadoForm';

const ApoderadosPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await apoderadoService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editing) { await apoderadoService.update(editing.id, data); toast.success('Actualizado'); }
      else { await apoderadoService.create(data); toast.success('Creado'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if ((await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })).isConfirmed) {
      await apoderadoService.delete(id); toast.success('Eliminado'); fetchData();
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'contacto', headerName: 'Contacto', flex: 1 },
    { field: 'parentesco', headerName: 'Parentesco', width: 130 },
    { field: 'activo', headerName: 'Estado', width: 110, renderCell: (p: GridRenderCellParams) => <Chip label={p.value ? 'Activo' : 'Inactivo'} color={p.value ? 'success' : 'default'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 120, sortable: false, renderCell: (p) => (
      <Box><IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton><IconButton color="error" onClick={() => handleDelete(p.row.id)}><DeleteIcon /></IconButton></Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Apoderados</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Agregar Apoderado</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nuevo'} Apoderado</DialogTitle>
        <DialogContent dividers><ApoderadoForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default ApoderadosPage;