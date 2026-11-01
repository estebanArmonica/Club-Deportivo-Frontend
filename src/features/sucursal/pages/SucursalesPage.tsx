import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { sucursalService } from '../../../services/sucursal/sucursal.service';
import { Sucursal } from '../../../schemas/dtos/sucursal/SucursalDto';
import { SucursalFormData } from '../../../schemas/dtos/sucursal/SucursalSchema';
import SucursalForm from '../components/SucursalForm';

const SucursalesPage: React.FC = () => {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState<Sucursal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSucursales = async () => {
    try {
      setLoading(true);
      const data = await sucursalService.getAll();
      setSucursales(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar las sucursales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleOpenCreate = () => {
    setEditingSucursal(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (sucursal: Sucursal) => {
    setEditingSucursal(sucursal);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false);
      setEditingSucursal(null);
    }
  };

  const handleSubmit = async (data: SucursalFormData) => {
    setIsSubmitting(true);
    try {
      // Mapeo de id_club a clubId si el backend lo requiere así
      const payload = {
        ...data,
        clubId: data.id_club,
      };
      delete (payload as any).id_club;

      if (editingSucursal) {
        await sucursalService.update(editingSucursal.id, payload);
        toast.success('Sucursal actualizada correctamente');
      } else {
        await sucursalService.create(payload);
        toast.success('Sucursal creada correctamente');
      }
      handleCloseModal();
      fetchSucursales();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la sucursal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `La sucursal "${nombre}" será eliminada permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await sucursalService.delete(id);
        Swal.fire('¡Eliminada!', 'La sucursal ha sido eliminada.', 'success');
        fetchSucursales();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la sucursal.', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'direccion', headerName: 'Dirección', flex: 1, minWidth: 200 },
    { field: 'telefono', headerName: 'Teléfono', width: 150 },
    { 
      field: 'club', 
      headerName: 'Club', 
      width: 150,
      valueGetter: (value, row: any) => row.club?.nombre || row.clubId || '-'
    },
    {
      field: 'activa',
      headerName: 'Estado',
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Activa' : 'Inactiva'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row as Sucursal)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id, params.row.nombre)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Gestión de Sucursales
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: '#1B5E20',
            '&:hover': { backgroundColor: '#0D3B0F' },
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(27, 94, 32, 0.3)'
          }}
        >
          Agregar Sucursal
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataGrid
          rows={sucursales}
          columns={columns}
          loading={loading}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
          }
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc',
              fontWeight: 600,
            },
            '& .row-odd': {
              backgroundColor: '#f9fafb',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(27, 94, 32, 0.04)',
            },
          }}
        />
      </Box>

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>
          {editingSucursal ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </DialogTitle>
        <DialogContent dividers>
          <SucursalForm
            initialData={editingSucursal}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SucursalesPage;