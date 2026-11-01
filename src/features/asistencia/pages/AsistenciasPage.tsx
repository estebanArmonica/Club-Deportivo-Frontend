import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Check, Close } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { asistenciaService } from '../../../services/asistencia/asistencia.service';
import AsistenciaForm from '../components/AsistenciaForm';

const AsistenciasPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try { setLoading(true); setRows(await asistenciaService.getAll()); }
    catch { toast.error('Error al cargar'); } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, claseId: data.id_clase, pagoId: data.id_pago }; delete payload.id_clase; delete payload.id_pago;
      if (editing) { await asistenciaService.update(editing.id, payload); toast.success('Actualizada'); }
      else { await asistenciaService.create(payload); toast.success('Creada'); }
      setOpen(false); fetchData();
    } catch { toast.error('Error al guardar'); } finally { setIsSubmitting(false); }
  };

  const handleAction = async (id: number, action: 'presente' | 'ausente') => {
    try {
      if (action === 'presente') await asistenciaService.marcarPresente(id);
      if (action === 'ausente') await asistenciaService.marcarAusente(id);
      toast.success(`Marcado como ${action}`); fetchData();
    } catch { toast.error('Error'); }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'fecha', headerName: 'Fecha', width: 120 },
    { field: 'clase', headerName: 'Clase', flex: 1, valueGetter: (v, r: any) => `ID: ${r.clase?.id || '-'}` },
    { field: 'pago', headerName: 'Pago', flex: 1, valueGetter: (v, r: any) => `$${r.pago?.monto || '-'}` },
    { field: 'asistio', headerName: 'Asistió', width: 120, renderCell: (p: GridRenderCellParams) => <Chip label={p.value ? 'Presente' : 'Ausente'} color={p.value ? 'success' : 'error'} size="small" /> },
    { field: 'acciones', headerName: 'Acciones', width: 180, sortable: false, renderCell: (p) => (
      <Box>
        <Tooltip title="Marcar Presente"><IconButton color="success" onClick={() => handleAction(p.row.id, 'presente')}><Check /></IconButton></Tooltip>
        <Tooltip title="Marcar Ausente"><IconButton color="error" onClick={() => handleAction(p.row.id, 'ausente')}><Close /></IconButton></Tooltip>
        <IconButton color="primary" onClick={() => { setEditing(p.row); setOpen(true); }}><EditIcon /></IconButton>
      </Box>
    )},
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Gestión de Asistencias</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setEditing(null); setOpen(true); }} sx={{ bgcolor: '#1B5E20' }}>Registrar Asistencia</Button>
      </Box>
      <Box sx={{ flexGrow: 1, bgcolor: 'white', borderRadius: 2 }}>
        <DataGrid rows={rows} columns={columns} loading={loading} pageSizeOptions={[10, 25]} disableRowSelectionOnClick />
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Editar' : 'Nueva'} Asistencia</DialogTitle>
        <DialogContent dividers><AsistenciaForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} /></DialogContent>
      </Dialog>
    </Box>
  );
};
export default AsistenciasPage;