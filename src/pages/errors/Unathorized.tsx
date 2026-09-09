import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: 'error.light',
              borderRadius: '50%',
              p: 2,
              display: 'inline-flex',
              mb: 2,
            }}
          >
            <LockOutlined sx={{ fontSize: 48, color: 'error.main' }} />
          </Box>
          
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Acceso No Autorizado
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No tienes los permisos necesarios para acceder a esta página.
            Por favor, contacta al administrador si crees que esto es un error.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            Ir al Dashboard
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
          >
            Cerrar sesión
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;