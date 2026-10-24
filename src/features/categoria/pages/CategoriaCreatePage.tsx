import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box } from '@mui/material';
import { toast } from 'react-hot-toast';
import CategoriaForm from '../components/CategoriaForm';
import { CategoriaFormData } from '../../../schemas/dtos/cate/CategoriaSchema';
import { categoriaService } from '../../../services/cate/categoria.service'; // Ajusta tu ruta

const CategoriaCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CategoriaFormData) => {
    setIsSubmitting(true);
    try {
        // mapeamos los nombres del formulario
        const payload = {
            ...data,
            deporteId: data.id_deporte, // mapeamos el id del deporte -> id_deporte
        };

        // borramos la propiedad que espera DTO
        delete (payload as any).id_deporte;
        await categoriaService.create(payload);
        
        toast.success('Categoría creada correctamente');
        navigate('/categorias');
    } catch (error) {
        console.error(error);
        toast.error('Error al crear la categoría');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* OJO: Usamos sx para fontWeight */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Nueva Categoría
        </Typography>
        <Box sx={{ mt: 2 }}>
          <CategoriaForm
            onSubmit={handleSubmit}
            onCancel={() => navigate('/categorias')}
            isSubmitting={isSubmitting}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default CategoriaCreatePage;