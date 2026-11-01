import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { clubService } from '../../../services/club/club.service';
import ClubForm from '../components/ClubForm';

const ClubesPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await clubService.getAll()); }
    catch { toast.error('Error al cargar clubes'); } 
    finally { setLoading(false); }
  };
  
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editing) { 
        await clubService.update(editing.id, data); 
        toast.success('Club actualizado'); 
      } else { 
        await clubService.create(data); 
        toast.success('Club creado'); 
      }
      setOpen(false); fetchData();
    } catch { 
      toast.error('Error al guardar. Verifica el CUIT/Email'); 
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if ((await Swal.fire({ title: '¿Eliminar club?', text: "Esta acción desactivará el club.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })).isConfirmed) {
      try {
        await clubService.delete(id); 
        toast.success('Club eliminado'); 
        fetchData();
      } catch { toast.error('No se pudo eliminar'); }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'cuit', headerName: 'CUIT', width: 150 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'activo', headerName: 'Estado', width: 110, renderCell: (p: GridRenderCellParams) => <Chip label={p.value ? 'Activo' : 'Inactivo'} color={p.value ? 'success' : 'default'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 120, sortable: false, renderCell: (p) => (
      <Box>
        <IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton>
        <IconButton color="error" onClick={() => handleDelete(p.row.id)}><DeleteIcon /></IconButton>
      </Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Clubes</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20', '&:hover': { bgcolor: '#0D3B0F' } }}>Agregar Club</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          loading={loading} 
          pageSizeOptions={[10, 25]} 
          disableRowSelectionOnClick 
          getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'}
          sx={{ border: 'none', '& .row-odd': { backgroundColor: '#f9fafb' } }}
        />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>{editing ? 'Editar' : 'Nuevo'} Club</DialogTitle>
        <DialogContent dividers>
          <ClubForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default ClubesPage;