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

import { grupoService } from '../../../services/grupo/grupo.service';
import { Grupo } from '../../../schemas/dtos/grupo/GrupoDto';
import { GrupoFormData } from '../../../schemas/dtos/grupo/GrupoSchema';
import GrupoForm from '../components/GrupoForm';

const GruposPage: React.FC = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchGrupos = async () => {
    try {
      setLoading(true);
      const data = await grupoService.getAll();
      setGrupos(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los grupos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupos();
  }, []);

  const handleOpenCreate = () => {
    setEditingGrupo(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (grupo: Grupo) => {
    setEditingGrupo(grupo);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false);
      setEditingGrupo(null);
    }
  };

  const handleSubmit = async (data: GrupoFormData) => {
    setIsSubmitting(true);
    try {
      // Mapeo por si el backend espera otro nombre en el DTO
      const payload = {
        ...data,
        categoriaId: data.id_categoria,
        sucursalId: data.id_sucursal,
      };
      delete (payload as any).id_categoria;
      delete (payload as any).id_sucursal;

      if (editingGrupo) {
        await grupoService.update(editingGrupo.id, payload);
        toast.success('Grupo actualizado correctamente');
      } else {
        await grupoService.create(payload);
        toast.success('Grupo creado correctamente');
      }
      handleCloseModal();
      fetchGrupos();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el grupo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `El grupo "${nombre}" será eliminado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await grupoService.delete(id);
        Swal.fire('¡Eliminado!', 'El grupo ha sido eliminado.', 'success');
        fetchGrupos();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el grupo.', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { 
      field: 'precio', 
      headerName: 'Precio', 
      width: 120,
      valueGetter: (value, row) => `$${row.precio?.toLocaleString('es-CL') || 0}`
    },
    { 
      field: 'capacidad', 
      headerName: 'Capacidad', 
      width: 120,
      valueGetter: (value, row) => `${row.capacidad} pers.`
    },
    { 
      field: 'horario', 
      headerName: 'Horario', 
      width: 160,
      valueGetter: (value, row) => `${row.horaInicio} - ${row.horaFin}`
    },
    { 
      field: 'categoria', 
      headerName: 'Categoría', 
      flex: 1, 
      minWidth: 130,
      valueGetter: (value, row: any) => row.categoria?.nombre || row.categoriaId || '-'
    },
    { 
      field: 'sucursal', 
      headerName: 'Sucursal', 
      flex: 1, 
      minWidth: 130,
      valueGetter: (value, row: any) => row.sucursal?.nombre || row.sucursalId || '-'
    },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 110,
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
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row as Grupo)}>
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
          Gestión de Grupos
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
          Agregar Grupo
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataGrid
          rows={grupos}
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

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>
          {editingGrupo ? 'Editar Grupo' : 'Nuevo Grupo'}
        </DialogTitle>
        <DialogContent dividers>
          <GrupoForm
            initialData={editingGrupo}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default GruposPage;