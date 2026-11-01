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

import { alumnoService } from '../../../services/alumno/alumno.service';
import { Alumno } from '../../../schemas/dtos/alumno/AlumnoDto';
import { AlumnoFormData } from '../../../schemas/dtos/alumno/AlumnoSchema';
import AlumnoForm from '../components/AlumnoForm';

const AlumnosPage: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAlumnos = async () => {
    try {
      setLoading(true);
      const data = await alumnoService.getAll();
      setAlumnos(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar los alumnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleOpenCreate = () => {
    setEditingAlumno(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (alumno: Alumno) => {
    setEditingAlumno(alumno);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setOpenModal(false);
      setEditingAlumno(null);
    }
  };

  const handleSubmit = async (data: AlumnoFormData) => {
    setIsSubmitting(true);
    try {
      if (editingAlumno) {
        await alumnoService.update(editingAlumno.id, data);
        toast.success('Alumno actualizado correctamente');
      } else {
        await alumnoService.create(data);
        toast.success('Alumno creado correctamente');
      }
      handleCloseModal();
      fetchAlumnos();
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar el alumno. Verifica que el RUT no esté duplicado.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, nombre: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `El alumno "${nombre}" será desactivado del sistema.`, // Es soft delete
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await alumnoService.delete(id);
        Swal.fire('¡Eliminado!', 'El alumno ha sido desactivado.', 'success');
        fetchAlumnos();
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'No se pudo eliminar el alumno.', 'error');
      }
    }
  };

  // Función para calcular la edad (opcional, se ve muy bien en las tablas)
  const calcularEdad = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return '-';
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  const columns: GridColDef[] = [
    { field: 'rut', headerName: 'RUT', width: 130 },
    { 
      field: 'nombreCompleto', 
      headerName: 'Nombre Completo', 
      flex: 1, 
      minWidth: 200,
      valueGetter: (value, row) => `${row.nombre} ${row.apellido}`
    },
    { 
      field: 'fechaNacimiento', 
      headerName: 'Edad', 
      width: 110,
      valueGetter: (value, row) => calcularEdad(row.fechaNacimiento)
    },
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
          <IconButton color="primary" onClick={() => handleOpenEdit(params.row as Alumno)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id, `${params.row.nombre} ${params.row.apellido}`)}>
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
          Gestión de Alumnos
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
          Agregar Alumno
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1, width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <DataGrid
          rows={alumnos}
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
          {editingAlumno ? 'Editar Alumno' : 'Nuevo Alumno'}
        </DialogTitle>
        <DialogContent dividers>
          <AlumnoForm
            initialData={editingAlumno}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AlumnosPage;