import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Chip, IconButton, Dialog, DialogTitle, DialogContent,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams, GridPaginationModel } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

import { usuarioService } from '../../../services/user/usuario.service';
import { Usuario } from '../../../schemas/dtos/user/UsuarioDto';
import UsuarioForm from '../components/UsuarioForm';

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para la paginación del servidor
  const [totalRows, setTotalRows] = useState(0);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  // Estados del Modal
  const [openModal, setOpenModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      // Llamamos al servicio pasando la página y el tamaño
      const data = await usuarioService.getAll({
        page: paginationModel.page,
        size: paginationModel.pageSize,
      });
      setUsuarios(data.content); // 'content' es donde vienen los registros en Spring
      setTotalRows(data.totalElements); // Total de registros para la tabla
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  // Cada vez que cambie la página o el tamaño, volvemos a pedir los datos
  useEffect(() => {
    fetchUsuarios();
  }, [paginationModel]);

  const handleOpenCreate = () => {
    setEditingUsuario(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false);
      setEditingUsuario(null);
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingUsuario) {
        // Si está vacía la contraseña al editar, la eliminamos para no sobreescribirla
        if (!data.password) delete data.password;
        await usuarioService.update(editingUsuario.id, data);
        toast.success('Usuario actualizado correctamente');
      } else {
        await usuarioService.create(data);
        toast.success('Usuario creado correctamente');
      }
      handleCloseModal();
      fetchUsuarios(); // Recargamos la página actual
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el usuario. Verifica el email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `El usuario "${nombre}" será desactivado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await usuarioService.delete(id);
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
        fetchUsuarios();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 200 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
    {
      field: 'activo',
      headerName: 'Estado',
      width: 120,
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
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row as Usuario)}>
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
          Gestión de Usuarios
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
          Agregar Usuario
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataGrid
          rows={usuarios}
          columns={columns}
          loading={loading}
          
          // 👇 CONFIGURACIÓN DE PAGINACIÓN DE SERVIDOR
          paginationMode="server"
          rowCount={totalRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
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
          {editingUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
        </DialogTitle>
        <DialogContent dividers>
          <UsuarioForm
            initialData={editingUsuario}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage;