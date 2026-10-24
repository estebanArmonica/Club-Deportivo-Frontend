import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';
import DeporteForm from '../components/DeporteForm';
import { DeporteFormData } from '../../../schemas/dtos/deporte/DeporteSchema';
import { deporteService } from '../../../services/deporte/deporte.service';
import { Deporte } from '../../../schemas/dtos/deporte/DeporteDto';

const DeporteEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deporte, setDeporte] = useState<Deporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDeporte = async () => {
      if (!id) return;
      try {
        const data = await deporteService.getById(Number(id));
        setDeporte(data);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar el deporte');
        navigate('/deportes');
      } finally {
        setLoading(false);
      }
    };
    fetchDeporte();
  }, [id, navigate]);

  const handleSubmit = async (data: DeporteFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await deporteService.update(Number(id), data);
      toast.success('Deporte actualizado correctamente');
      navigate('/deportes');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar el deporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Editar Deporte
        </Typography>
        <Box sx={{ mt: 2 }}>
          <DeporteForm
            initialData={deporte}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/deportes')}
            isSubmitting={isSubmitting}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default DeporteEditPage;