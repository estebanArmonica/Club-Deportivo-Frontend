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
import Swal from 'sweetalert2'; // 👈 Importamos SweetAlert2
import { toast } from 'react-hot-toast';

import { deporteService } from '../../../services/deporte/deporte.service';
import { Deporte } from '../../../schemas/dtos/deporte/DeporteDto';
import DeporteForm from '../components/DeporteForm';
import { DeporteFormData } from '../../../schemas/dtos/deporte/DeporteSchema';

const DeportesPage: React.FC = () => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados del Modal
  const [openModal, setOpenModal] = useState(false);
  const [editingDeporte, setEditingDeporte] = useState<Deporte | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDeportes = async () => {
    try {
      setLoading(true);
      const data = await deporteService.getAll();
      setDeportes(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los deportes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeportes();
  }, []);

  // --- MANEJO DEL MODAL ---
  const handleOpenCreate = () => {
    setEditingDeporte(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (deporte: Deporte) => {
    setEditingDeporte(deporte);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false);
      setEditingDeporte(null);
    }
  };

  const handleSubmit = async (data: DeporteFormData) => {
    setIsSubmitting(true);
    try {
      if (editingDeporte) {
        await deporteService.update(editingDeporte.id, data);
        toast.success('Deporte actualizado correctamente');
      } else {
        await deporteService.create(data);
        toast.success('Deporte creado correctamente');
      }
      handleCloseModal();
      fetchDeportes();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el deporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ELIMINAR CON SWEETALERT2 ---
  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `El deporte "${nombre}" será eliminado permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deporteService.delete(id);
        Swal.fire('¡Eliminado!', 'El deporte ha sido eliminado.', 'success');
        fetchDeportes();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el deporte.', 'error');
      }
    }
  };

  // --- COLUMNAS DE LA TABLA DATAGRID ---
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'descripcion', headerName: 'Descripción', flex: 2, minWidth: 200 },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value ? 'Activo' : 'Inactivo'}
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
          <IconButton
            color="primary"
            onClick={() => handleOpenEdit(params.row as Deporte)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id, params.row.nombre)}
          >
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
          Gestión de Deportes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: '#1B5E20', // 👈 El verde corporativo
            '&:hover': { backgroundColor: '#0D3B0F' },
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 10px rgba(27, 94, 32, 0.3)'
          }}
        >
          Agregar Deporte
        </Button>
      </Box>

      {/* DATAGRID EN LUGAR DE TABLE MANUAL */}
      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataGrid
          rows={deportes}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick

          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'row-even' : 'row-odd'
          }

          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f8fafc', // gris muy claro para los encabezados
              fontWeight: 600,
            },

            // pintamos las filas que tengan la clase row-odd
            '& .row-odd': {
              backgroundColor: '#f9fafb', // Un gris sutil (como el de Bootstrap)
            },

            // efecto hover
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(27, 94, 32, 0.04)', // Un toque verde muy suave
            },
          }}
        />
      </Box>

      {/* MODAL */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>
          {editingDeporte ? 'Editar Deporte' : 'Nuevo Deporte'}
        </DialogTitle>
        <DialogContent dividers>
          <DeporteForm
            initialData={editingDeporte}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DeportesPage;