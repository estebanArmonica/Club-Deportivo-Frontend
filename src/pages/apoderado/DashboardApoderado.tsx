import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, Chip, Divider } from '@mui/material';
import { Payment, Event, Warning } from '@mui/icons-material';

const DashboardApoderado = () => {
  // Datos de ejemplo
  const hijos = [
    { id: 1, nombre: 'Juanito Pérez', grupo: 'Fútbol Infantil', cuota: 'PENDIENTE', monto: 25000, vencimiento: '15 Nov 2026' },
    { id: 2, nombre: 'Maria Pérez', grupo: 'Básquet Juvenil', cuota: 'PAGADA', monto: 25000, vencimiento: '15 Nov 2026' }
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
          Portal de Apoderados 👨‍👩‍👦
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Revisa el estado de tus hijos y tus pagos pendientes.
        </Typography>
      </Box>

      {/* Alerta de pago pendiente */}
      {hijos.some(h => h.cuota === 'PENDIENTE') && (
        <Card sx={{ mb: 4, borderRadius: 3, bgcolor: '#FFF3E0', border: '1px solid #FFE0B2', boxShadow: 'none' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning sx={{ color: '#E65100', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ color: '#E65100', fontWeight: 600 }}>Tienes pagos pendientes</Typography>
              <Typography variant="body2" sx={{ color: '#E65100' }}>Por favor, regulariza la situación de tu hijo/a antes del vencimiento.</Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {hijos.map((hijo) => (
          <Grid size={{ xs: 12, md: 6 }} key={hijo.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{hijo.nombre}</Typography>
                    <Typography variant="body2" color="text.secondary">{hijo.grupo}</Typography>
                  </Box>
                  <Chip 
                    label={hijo.cuota} 
                    color={hijo.cuota === 'PAGADA' ? 'success' : 'error'} 
                    size="small" 
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Monto Cuota</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>${hijo.monto.toLocaleString('es-CL')}</Typography>
                  </Box>
                  {hijo.cuota === 'PENDIENTE' ? (
                    <Button variant="contained" color="warning" startIcon={<Payment />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Pagar Ahora
                    </Button>
                  ) : (
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary">Vence el</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{hijo.vencimiento}</Typography>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardApoderado;