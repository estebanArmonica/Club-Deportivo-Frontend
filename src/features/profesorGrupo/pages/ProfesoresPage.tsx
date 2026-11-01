import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { profesorGrupoService } from '../../../services/profesorGrupo/profesorGrupo.service';
import ProfesorGrupoForm from '../components/ProfesorGrupoForm';

const ProfesoresPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await profesorGrupoService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, usuarioId: data.id_usuario, grupoId: data.id_grupo }; delete payload.id_usuario; delete payload.id_grupo;
      if (editing) { await profesorGrupoService.update(editing.id, payload); toast.success('Actualizado'); }
      else { await profesorGrupoService.create(payload); toast.success('Creado'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: number) => {
    if ((await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true })).isConfirmed) {
      await profesorGrupoService.delete(id); toast.success('Eliminado'); fetchData();
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'usuario', headerName: 'Profesor', flex: 1, valueGetter: (v, r: any) => r.usuario?.nombre || '-' },
    { field: 'grupo', headerName: 'Grupo', flex: 1, valueGetter: (v, r: any) => r.grupo?.nombre || '-' },
    { field: 'activo', headerName: 'Estado', width: 110, renderCell: (p: GridRenderCellParams) => <Chip label={p.value ? 'Activo' : 'Inactivo'} color={p.value ? 'success' : 'default'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 120, sortable: false, renderCell: (p) => (
      <Box><IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton><IconButton color="error" onClick={() => handleDelete(p.row.id)}><DeleteIcon /></IconButton></Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Profesores por Grupo</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Agregar Asignación</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Asignación</DialogTitle>
        <DialogContent dividers><ProfesorGrupoForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default ProfesoresPage;