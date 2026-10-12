import React from 'react';
import { Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { useAuth } from '../../context/auth/AuthContext';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Dashboard: React.FC = () => {
  const { getFullName } = useAuth();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Breadcrumb / Título sección */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 4,
              height: 20,
              bgcolor: 'primary.main',
              borderRadius: 1,
            }}
          />
          <Typography
            sx={{
              fontSize: '0.95rem',
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Panel principal
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', letterSpacing: 0.5 }}
        >
          INICIO / DASHBOARD
        </Typography>
      </Box>

      {/* GRID BENTO */}
      <Grid container spacing={2.5}>
        {/* CARD 1: Alumnos inscritos — ÁREA GRANDE con gráfico de área */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                '&:last-child': { pb: 4 },
              }}
            >
              {/* Número + unidad */}
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: '3.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
                  256
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'text.secondary',
                    letterSpacing: 0.5,
                  }}
                >
                  ALUMNOS
                </Typography>
              </Box>

              {/* Etiqueta */}
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  color: 'text.primary',
                  textTransform: 'uppercase',
                  mb: 1.5,
                }}
              >
                Inscripciones activas
              </Typography>

              {/* Descripción */}
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                Total de alumnos con membresía vigente en todas las disciplinas del club.
              </Typography>

              {/* Botón */}
              <Button
                variant="outlined"
                size="small"
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: '10px !important' }} />}
                sx={{
                  alignSelf: 'flex-start',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  fontSize: '0.7rem',
                  borderColor: 'text.primary',
                  color: 'text.primary',
                  borderRadius: 0.5,
                  px: 2,
                  py: 0.75,
                  '&:hover': {
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  },
                }}
              >
                Ver reporte
              </Button>

              {/* Gráfico de área (SVG inline) */}
              <Box sx={{ mt: 'auto', pt: 3, mx: -4, mb: -4 }}>
                <svg
                  viewBox="0 0 600 140"
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: 140, display: 'block' }}
                >
                  <defs>
                    <linearGradient id="areaBlue" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#4fc3f7" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#4fc3f7" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="areaPink" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ba68c8" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#ba68c8" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  {/* Área azul */}
                  <path
                    d="M0,110 C60,95 100,100 150,70 C200,45 250,55 300,50 C360,45 400,25 460,40 C510,52 560,35 600,45 L600,140 L0,140 Z"
                    fill="url(#areaBlue)"
                  />
                  <path
                    d="M0,110 C60,95 100,100 150,70 C200,45 250,55 300,50 C360,45 400,25 460,40 C510,52 560,35 600,45"
                    fill="none"
                    stroke="#29b6f6"
                    strokeWidth="2"
                  />
                  {/* Área rosa */}
                  <path
                    d="M0,125 C60,118 100,122 150,110 C200,98 250,108 300,115 C360,118 400,105 460,118 C510,125 560,120 600,125 L600,140 L0,140 Z"
                    fill="url(#areaPink)"
                  />
                  <path
                    d="M0,125 C60,118 100,122 150,110 C200,98 250,108 300,115 C360,118 400,105 460,118 C510,125 560,120 600,125"
                    fill="none"
                    stroke="#ab47bc"
                    strokeWidth="2"
                  />
                  {/* Puntos en la línea azul */}
                  {[
                    [0, 110], [150, 70], [300, 50], [460, 40], [600, 45],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="#29b6f6" stroke="#fff" strokeWidth="1.5" />
                  ))}
                  {/* Puntos en la línea rosa */}
                  {[
                    [0, 125], [150, 110], [300, 115], [460, 118], [600, 125],
                  ].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="3" fill="#ab47bc" stroke="#fff" strokeWidth="1.5" />
                  ))}
                </svg>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA DERECHA: 3 cards apiladas */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2.5}>
            {/* CARD 2: Balanza / métrica con gráfico de barras — ANCHA */}
            <Grid size={{ xs: 12 }}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Gráfico de barras a la izquierda */}
                    <Grid size={{ xs: 12, sm: 7 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          justifyContent: 'space-between',
                          height: 140,
                          gap: 0.75,
                        }}
                      >
                        {[
                          { b: 60, y: 30 }, { b: 45, y: 55 }, { b: 40, y: 70 },
                          { b: 70, y: 20 }, { b: 85, y: 15 }, { b: 55, y: 45 },
                          { b: 70, y: 30 }, { b: 45, y: 55 }, { b: 50, y: 40 },
                          { b: 35, y: 25 }, { b: 30, y: 20 }, { b: 25, y: 15 },
                        ].map((bar, i) => (
                          <Box
                            key={i}
                            sx={{
                              flex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'flex-end',
                              gap: 0.25,
                              height: '100%',
                            }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                height: `${bar.y}%`,
                                bgcolor: '#4fc3f7',
                                borderRadius: 0.5,
                              }}
                            />
                            <Box
                              sx={{
                                width: '100%',
                                height: `${bar.b}%`,
                                bgcolor: '#ffd54f',
                                borderRadius: 0.5,
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    </Grid>

                    {/* Número y datos a la derecha */}
                    <Grid size={{ xs: 12, sm: 5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '2.25rem',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            lineHeight: 1,
                          }}
                        >
                          0.0873
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: 'text.secondary',
                            letterSpacing: 0.5,
                          }}
                        >
                          ÍNDICE
                        </Typography>
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          letterSpacing: 1.2,
                          textTransform: 'uppercase',
                          mb: 1,
                        }}
                      >
                        Balance general
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.8rem',
                          color: 'text.secondary',
                          lineHeight: 1.5,
                          mb: 1.5,
                        }}
                      >
                        Ingresos vs. egresos del mes en curso, calculado sobre cuotas y pagos.
                      </Typography>
                      <Button
                        size="small"
                        endIcon={<ArrowForwardIosIcon sx={{ fontSize: '9px !important' }} />}
                        sx={{
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          letterSpacing: 0.8,
                          fontSize: '0.65rem',
                          p: 0,
                          minWidth: 0,
                          color: 'text.primary',
                          '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
                        }}
                      >
                        Ver reporte
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* CARD 3 y CARD 4: dos métricas medianas en paralelo con líneas */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <MetricCard
                value="29,931"
                unit=""
                label="Eventos del año"
                description="Eventos deportivos organizados en lo que va del ciclo."
                color="#4fc3f7"
                strokeColor="#29b6f6"
                linePath="M0,55 C40,50 60,45 90,35 C130,22 160,40 200,30 C240,20 270,32 300,25 L300,80 L0,80 Z"
                lineStroke="M0,55 C40,50 60,45 90,35 C130,22 160,40 200,30 C240,20 270,32 300,25"
                points={[[0, 55], [90, 35], [200, 30], [300, 25]]}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <MetricCard
                value="45,231"
                unit=""
                label="Asistencias"
                description="Registros de asistencia acumulados durante el año."
                color="#ba68c8"
                strokeColor="#ab47bc"
                linePath="M0,50 C40,60 80,40 120,45 C160,50 200,30 240,35 C270,38 290,30 300,35 L300,80 L0,80 Z"
                lineStroke="M0,50 C40,60 80,40 120,45 C160,50 200,30 240,35 C270,38 290,30 300,35"
                points={[[0, 50], [120, 45], [240, 35], [300, 35]]}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

// ============ COMPONENTE REUTILIZABLE: MetricCard ============
interface MetricCardProps {
  value: string;
  unit: string;
  label: string;
  description: string;
  color: string;
  strokeColor: string;
  linePath: string;
  lineStroke: string;
  points: [number, number][];
}

const MetricCard: React.FC<MetricCardProps> = ({
  value,
  unit,
  label,
  description,
  color,
  strokeColor,
  linePath,
  lineStroke,
  points,
}) => {
  const gradId = `grad-${strokeColor.replace('#', '')}`;
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent
        sx={{
          p: 3,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: 0 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: '1.85rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>
          {unit && (
            <Typography
              sx={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'text.secondary',
              }}
            >
              {unit}
            </Typography>
          )}
        </Box>
        <Typography
          sx={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: '0.8rem',
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </CardContent>
      <Box sx={{ mx: 0, mt: 1 }}>
        <svg
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
          style={{ width: '100%', height: 80, display: 'block' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={linePath} fill={`url(#${gradId})`} />
          <path d={lineStroke} fill="none" stroke={strokeColor} strokeWidth="2" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="3" fill={strokeColor} stroke="#fff" strokeWidth="1.5" />
          ))}
        </svg>
      </Box>
    </Card>
  );
};

export default Dashboard;