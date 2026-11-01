import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { ErrorOutlined as ErrorIcon, Home as HomeIcon } from '@mui/icons-material';

interface ErrorPageProps {
  code: string;
  title: string;
  message: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ code, title, message }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f7fa',
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            borderRadius: 4,
            border: '1px solid #e0e0e0',
            bgcolor: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          }}
        >
          <ErrorIcon sx={{ fontSize: 80, color: '#d32f2f', mb: 2 }} />
          
          <Typography variant="h1" sx={{ fontWeight: 800, color: '#1B5E20', mb: 1 }}>
            {code}
          </Typography>
          
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 2 }}>
            {title}
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {message}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Volver atrás
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                bgcolor: '#1B5E20',
                '&:hover': { bgcolor: '#0D3B0F' },
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Ir al Inicio
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ErrorPage;