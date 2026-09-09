import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import { useAuth } from '../../context/auth/AuthContext';
import {
  Sports,
  People,
  Event,
  Payment,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const { user, getFullName } = useAuth();

  const stats = [
    { title: 'Deportes Activos', value: 8, icon: <Sports />, color: '#1976d2', change: '+12%' },
    { title: 'Alumnos Inscritos', value: 256, icon: <People />, color: '#2e7d32', change: '+8%' },
    { title: 'Eventos Hoy', value: 5, icon: <Event />, color: '#ed6c02', change: '-2%' },
    { title: 'Pagos Pendientes', value: 12, icon: <Payment />, color: '#d32f2f', change: '+15%' },
  ];

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          ¡Bienvenido, {getFullName()}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen general de tu club deportivo
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {stat.change.startsWith('+') ? (
                        <TrendingUp sx={{ color: 'success.main', fontSize: 14, mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main', fontSize: 14, mr: 0.5 }} />
                      )}
                      <Typography variant="caption" color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}>
                        {stat.change} vs mes anterior
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: `${stat.color}15`,
                      borderRadius: '50%',
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;