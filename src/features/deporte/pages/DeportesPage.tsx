import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { deporteService } from '../../../services/deporte/deporte.service';
import { Deporte } from '../../../schemas/dtos/deporte/DeporteDto';

const DeportesPage: React.FC = () => {
  const navigate = useNavigate();
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este deporte?')) return;
    try {
      await deporteService.delete(id);
      toast.success('Deporte eliminado');
      fetchDeportes(); // Recargar
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Gestión de Deportes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/deportes/crear')}
        >
          Nuevo Deporte
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Descripción</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress sx={{ my: 3 }} />
                </TableCell>
              </TableRow>
            ) : deportes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay deportes registrados
                </TableCell>
              </TableRow>
            ) : (
              deportes.map((deporte) => (
                <TableRow key={deporte.id}>
                  <TableCell>{deporte.id}</TableCell>
                  <TableCell>{deporte.nombre}</TableCell>
                  <TableCell>{deporte.descripcion || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={deporte.activo ? 'Activo' : 'Inactivo'}
                      color={deporte.activo ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/deportes/editar/${deporte.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(deporte.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeportesPage;