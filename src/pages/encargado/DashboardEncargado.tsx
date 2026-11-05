import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Chip } from '@mui/material';
import { AttachMoney, People, SportsTennis, EventAvailable } from '@mui/icons-material';

const DashboardEncargado = () => {
  // Datos de ejemplo (luego los conectas a tu backend)
  const stats = {
    ingresosHoy: 150000,
    alumnosActivos: 120,
    canchasDisponibles: 4,
    reservasHoy: 12
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Panel de Sucursal 🏢
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen operativo de tu sucursal para el día de hoy.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Ingresos Hoy', value: `$${stats.ingresosHoy.toLocaleString('es-CL')}`, icon: <AttachMoney />, color: '#E8F5E9', textColor: '#2E7D32' },
          { title: 'Alumnos Activos', value: stats.alumnosActivos, icon: <People />, color: '#E3F2FD', textColor: '#1565C0' },
          { title: 'Canchas Libres', value: stats.canchasDisponibles, icon: <SportsTennis />, color: '#FFF3E0', textColor: '#E65100' },
          { title: 'Reservas Hoy', value: stats.reservasHoy, icon: <EventAvailable />, color: '#F3E5F5', textColor: '#7B1FA2' },
        ].map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Avatar sx={{ bgcolor: stat.color, color: stat.textColor, width: 48, height: 48, mb: 2 }}>
                  {stat.icon}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sección de Alertas o Tareas Pendientes */}
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Tareas Pendientes</Typography>
      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, borderBottom: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label="Pago" size="small" color="warning" />
              <Typography variant="body2">Revisar comprobante de transferencia #402</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">Hace 10 min</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, pt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip label="Inscripción" size="small" color="info" />
              <Typography variant="body2">Nuevo alumno esperando asignación de grupo</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">Hace 1 hora</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardEncargado;