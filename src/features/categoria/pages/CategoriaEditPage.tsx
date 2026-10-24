import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';
import CategoriaForm from '../components/CategoriaForm';
import { CategoriaFormData } from '../../../schemas/dtos/cate/CategoriaSchema';
import { categoriaService } from '../../../services/cate/categoria.service';
import { Categoria } from '../../../schemas/dtos/cate/CategoriaDto';

const CategoriaEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategoria = async () => {
      if (!id) return;
      try {
        const data = await categoriaService.getById(Number(id));
        setCategoria(data);
      } catch (error) {
        console.error(error);
        toast.error('Error al cargar la categoría');
        navigate('/categorias');
      } finally {
        setLoading(false);
      }
    };
    fetchCategoria();
  }, [id, navigate]);

  const handleSubmit = async (data: CategoriaFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await categoriaService.update(Number(id), data);
      toast.success('Categoría actualizada correctamente');
      navigate('/categorias');
    } catch (error) {
      console.error(error);
      toast.error('Error al actualizar la categoría');
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
          Editar Categoría
        </Typography>
        <Box sx={{ mt: 2 }}>
          <CategoriaForm
            initialData={categoria}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/categorias')}
            isSubmitting={isSubmitting}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default CategoriaEditPage;