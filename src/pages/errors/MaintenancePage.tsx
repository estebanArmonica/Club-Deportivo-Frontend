import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import { BuildCircle as BuildIcon } from '@mui/icons-material';

const MaintenancePage = () => {
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
          <BuildIcon sx={{ fontSize: 80, color: '#1B5E20', mb: 2 }} />
          
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#333', mb: 2 }}>
            Sitio en Mantenimiento
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Estamos realizando mejoras en la plataforma para brindarte un mejor servicio. 
            Volveremos a estar en línea muy pronto.
          </Typography>

          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{
              bgcolor: '#1B5E20',
              '&:hover': { bgcolor: '#0D3B0F' },
              textTransform: 'none',
              fontWeight: 600,
              px: 4
            }}
          >
            Reintentar conexión
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default MaintenancePage;