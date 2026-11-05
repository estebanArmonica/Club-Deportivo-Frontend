import React from 'react';
import { Box, Grid, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material';
import { SportsSoccer, CalendarToday, CheckCircle } from '@mui/icons-material';

const DashboardAlumno = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Mi Panel 🎓
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenido a tu espacio personal. Aquí puedes revisar tus clases y tu asistencia.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Próxima Clase */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday color="primary" /> Mi Próxima Clase
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ bgcolor: '#E3F2FD', p: 2, borderRadius: 2 }}>
                  <SportsSoccer sx={{ color: '#1976d2', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Fútbol Infantil A</Typography>
                  <Typography variant="body2" color="text.secondary">Hoy, 16:00 - 17:30</Typography>
                  <Typography variant="body2" color="text.secondary">Cancha 1</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Asistencia */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle color="success" /> Mi Asistencia
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#2E7D32' }}>90%</Typography>
                <Typography variant="body2" color="text.secondary">Asistencia total</Typography>
              </Box>
              
              <LinearProgress 
                variant="determinate" 
                value={90} 
                sx={{ height: 10, borderRadius: 5, bgcolor: '#E8F5E9', '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50' } }} 
              />

              <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                <Chip label="18 Asistencias" size="small" color="success" variant="outlined" />
                <Chip label="2 Faltas" size="small" color="error" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAlumno;