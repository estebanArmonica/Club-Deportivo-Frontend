import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Chip, LinearProgress } from '@mui/material';
import { Event, People, SportsSoccer, AccessTime } from '@mui/icons-material';

const DashboardProfesor = () => {
  // Datos de ejemplo (luego los conectas a tu backend)
  const misGrupos = [
    { id: 1, nombre: 'Fútbol Infantil A', alumnos: 18, hora: '16:00 - 17:30', asistencia: 85 },
    { id: 2, nombre: 'Básquet Juvenil', alumnos: 12, hora: '18:00 - 19:30', asistencia: 92 },
  ];

  return (
    <Box>
      {/* Bienvenida */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            Hola, Profesor 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí tienes el resumen de tus clases para hoy.
          </Typography>
        </Box>
      </Box>

      {/* Tarjetas de Resumen */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Clases Hoy', value: '2', icon: <Event />, color: '#E3F2FD' },
          { title: 'Total Alumnos', value: '30', icon: <People />, color: '#E8F5E9' },
          { title: 'Asistencia Promedio', value: '88%', icon: <SportsSoccer />, color: '#FFF3E0' },
        ].map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 4 }} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: stat.color, color: '#1a1a1a', width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lista de Clases */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Mis Grupos Asignados</Typography>
      <Grid container spacing={3}>
        {misGrupos.map((grupo) => (
          <Grid size={{ xs: 12, md: 6 }} key={grupo.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{grupo.nombre}</Typography>
                  <Chip label={`${grupo.alumnos} Alumnos`} size="small" color="primary" variant="outlined" />
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
                  <AccessTime fontSize="small" />
                  <Typography variant="body2">{grupo.hora}</Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">Asistencia Promedio</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={grupo.asistencia} 
                    sx={{ flexGrow: 1, height: 8, borderRadius: 4, bgcolor: '#E0E0E0', '& .MuiLinearProgress-bar': { bgcolor: '#4CAF50' } }} 
                  />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{grupo.asistencia}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardProfesor;