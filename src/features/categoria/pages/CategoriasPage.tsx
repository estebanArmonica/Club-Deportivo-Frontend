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

import { categoriaService } from '../../../services/cate/categoria.service';
import { Categoria } from '../../../schemas/dtos/cate/CategoriaDto';
import { CategoriaFormData } from '../../../schemas/dtos/cate/CategoriaSchema';
import CategoriaForm from '../components/CategoriaForm';

const CategoriasPage: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados del Modal
  const [openModal, setOpenModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // --- MANEJO DEL MODAL ---
  const handleOpenCreate = () => {
    setEditingCategoria(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (categoria: Categoria) => {
    setEditingCategoria(categoria);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false);
      setEditingCategoria(null);
    }
  };

  const handleSubmit = async (data: CategoriaFormData) => {
    setIsSubmitting(true);
    try {
      // adaptamos el ID del deporte del deporteId que se espera en el DTO
      const payload = {
        ...data,
        deporteId: data.id_deporte,
      };
      delete (payload as any).id_deporte;

      if (editingCategoria) {
        await categoriaService.update(editingCategoria.id, payload);
        toast.success('Categoría actualizada correctamente');
      } else {
        await categoriaService.create(payload);
        toast.success('Categoría creada correctamente');
      }
      handleCloseModal();
      fetchCategorias();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ELIMINAR CON SWEETALERT2 ---
  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `La categoría "${nombre}" será eliminada permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await categoriaService.delete(id);
        Swal.fire('¡Eliminada!', 'La categoría ha sido eliminada.', 'success');
        fetchCategorias();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
      }
    }
  };

  // --- COLUMNAS DE LA TABLA DATAGRID ---
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { 
      field: 'edadMin', 
      headerName: 'Edad Mín.', 
      width: 110,
      // Usamos 'any' por si TypeScript se queja de que no están en el DTO aún
      valueGetter: (value, row: any) => row.edadMin ? `${row.edadMin} años` : '-'
    },
    { 
      field: 'edadMax', 
      headerName: 'Edad Máx.', 
      width: 110,
      valueGetter: (value, row: any) => row.edadMax ? `${row.edadMax} años` : '-'
    },
    { 
      field: 'deporte', 
      headerName: 'Deporte', 
      flex: 1, 
      minWidth: 150,
      // Si tu backend devuelve el objeto deporte completo, mostramos el nombre
      valueGetter: (value, row: any) => row.deporte?.nombre || row.deporteId || '-'
    },
    {
      field: 'activa',
      headerName: 'Estado',
      width: 130,
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
          <IconButton
            color="primary"
            onClick={() => handleOpenEdit(params.row as Categoria)}
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
          Gestión de Categorías
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
          Agregar Categoría
        </Button>
      </Box>

      {/* DATAGRID */}
      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataGrid
          rows={categorias}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          
          // 🦓 EFECTO CEBRA (Zebra Stripes)
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

      {/* MODAL */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>
          {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent dividers>
          <CategoriaForm
            initialData={editingCategoria}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CategoriasPage;