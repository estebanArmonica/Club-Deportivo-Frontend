import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
import { toast } from 'react-hot-toast'; // o sweetalert2
import DeporteForm from '../components/DeporteForm';
import { DeporteFormData } from '../../../schemas/dtos/deporte/DeporteSchema';
import { deporteService } from '../../../services/deporte/deporte.service';

const DeporteCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: DeporteFormData) => {
    setIsSubmitting(true);
    try {
      await deporteService.create(data);
      toast.success('Deporte creado correctamente');
      navigate('/deportes'); // Redirige al listado
    } catch (error) {
      console.error(error);
      toast.error('Error al crear el deporte');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Nuevo Deporte
        </Typography>
        <Box sx={{ mt: 2 }}>
          <DeporteForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/deportes')}
            isSubmitting={isSubmitting}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default DeporteCreatePage;