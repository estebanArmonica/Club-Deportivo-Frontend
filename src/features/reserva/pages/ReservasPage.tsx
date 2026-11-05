import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Chip, CircularProgress, 
  IconButton, Tooltip, Dialog, DialogTitle, DialogContent 
} from '@mui/material';
import { Add as AddIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { reservaService } from '../../../services/reserva/reserva.service';
import { canchaService } from '../../../services/cancha/cancha.service';
import ReservaForm from '../components/ReservaForm';

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const ReservasPage = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [canchas, setCanchas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [fechaActual, setFechaActual] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [res, can] = await Promise.all([reservaService.getAll(), canchaService.getAll()]);
      setReservas(res || []);
      setCanchas(can || []);
    } catch {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenCreate = (hora?: string, canchaId?: number) => {
    setEditing(hora ? { fecha: fechaActual, horaInicio: hora, id_cancha: canchaId } : null);
    setOpen(true);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = { ...data, equipoId: data.id_equipo, canchaId: data.id_cancha }; 
      delete payload.id_equipo; delete payload.id_cancha;
      
      if (editing?.id) { 
        await reservaService.update(editing.id, payload); 
        toast.success('Reserva actualizada'); 
      } else { 
        await reservaService.create(payload); 
        toast.success('Reserva creada'); 
      }
      setOpen(false); 
      fetchData();
    } catch { 
      toast.error('Error al guardar. Verifica disponibilidad.'); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  // Generar los próximos 5 días para la barra superior
  const getDiasSemana = () => {
    const dias = [];
    const baseDate = new Date(fechaActual);
    for (let i = -2; i <= 2; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      dias.push(d);
    }
    return dias;
  };

  const getReservaEnCelda = (canchaId: number, hora: string) => {
    return reservas.find(r => 
      r.fecha?.split('T')[0] === fechaActual && 
      r.cancha?.id === canchaId && 
      r.horaInicio?.substring(0, 5) === hora
    );
  };

  // Estilos dinámicos según el estado
  const getEstadoEstilos = (estado: string) => {
    switch (estado) {
      case 'CANCELADA': return { bg: '#FFEBEE', border: '#EF5350', text: '#C62828' };
      case 'COMPLETADA': return { bg: '#E8F5E9', border: '#66BB6A', text: '#2E7D32' };
      case 'PENDIENTE': return { bg: '#E3F2FD', border: '#42A5F5', text: '#1565C0' };
      default: return { bg: '#F5F5F5', border: '#BDBDBD', text: '#616161' };
    }
  };

  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Título y Botón */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>Disponibilidad</Typography>
          <Typography variant="body2" color="text.secondary">Consulta la disponibilidad de las instalaciones</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreate()} sx={{ bgcolor: '#1B5E20', borderRadius: 2, textTransform: 'none' }}>
          Nueva Reserva
        </Button>
      </Box>

      {/* Barra de Días (Estilo Sporttia) */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Button variant="outlined" size="small" sx={{ borderRadius: 2, color: 'text.secondary', borderColor: '#eee' }}>
          Todas las instalaciones
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {getDiasSemana().map((dia, index) => {
            const isSelected = dia.toISOString().split('T')[0] === fechaActual;
            return (
              <Box 
                key={index}
                onClick={() => setFechaActual(dia.toISOString().split('T')[0])}
                sx={{
                  cursor: 'pointer', textAlign: 'center', px: 2, py: 0.5, borderRadius: 2,
                  bgcolor: isSelected ? '#E8F5E9' : 'transparent',
                  border: isSelected ? '1px solid #A5D6A7' : '1px solid transparent',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#f0f0f0' }
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                  {dia.toLocaleDateString('es-CL', { weekday: 'short' }).substring(0,3)}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: isSelected ? 800 : 500, color: isSelected ? '#2E7D32' : '#333', lineHeight: 1 }}>
                  {dia.getDate()}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* Cuadrícula del Calendario */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex' }}>
          
          {/* Columna de Horas */}
          <Box sx={{ width: 80, borderRight: '1px solid #f0f0f0', bgcolor: '#fafafa' }}>
            <Box sx={{ height: 60, borderBottom: '1px solid #f0f0f0' }} />
            {HORARIOS.map(hora => (
              <Box key={hora} sx={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>{hora}</Typography>
              </Box>
            ))}
          </Box>

          {/* Columnas de Canchas */}
          <Box sx={{ display: 'flex', flexGrow: 1, overflowX: 'auto' }}>
            {canchas.length === 0 ? (
              <Box sx={{ p: 4, width: '100%', textAlign: 'center' }}>
                <Typography color="text.secondary">No hay canchas registradas en el sistema.</Typography>
              </Box>
            ) : (
              canchas.map(cancha => (
                <Box key={cancha.id} sx={{ flex: 1, minWidth: 180, borderRight: '1px solid #f0f0f0' }}>
                  
                  {/* Cabecera de la Cancha */}
                  <Box sx={{ height: 60, borderBottom: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
                    <Typography variant="subtitle2" fontWeight={700}>{cancha.nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">{cancha.tipo}</Typography>
                  </Box>

                  {/* Celdas */}
                  {HORARIOS.map(hora => {
                    const reserva = getReservaEnCelda(cancha.id, hora);
                    const isDisponible = !reserva;
                    const styles = reserva ? getEstadoEstilos(reserva.estado) : null;

                    return (
                      <Box 
                        key={hora} 
                        sx={{ 
                          height: 90, borderBottom: '1px solid #f0f0f0', p: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          bgcolor: isDisponible ? '#fff' : 'transparent',
                        }}
                      >
                        {isDisponible ? (
                          <Box 
                            onClick={() => handleOpenCreate(hora, cancha.id)}
                            sx={{ 
                              width: '100%', height: '100%', borderRadius: 2, 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              border: '1px dashed #A5D6A7', bgcolor: '#F1F8E9', cursor: 'pointer',
                              transition: 'all 0.2s', '&:hover': { bgcolor: '#E8F5E9', border: '1px solid #4CAF50' }
                            }}
                          >
                            <Typography variant="caption" color="success.main" fontWeight={600}>{hora}</Typography>
                            <Typography variant="caption" color="success.main" sx={{ fontSize: '0.65rem' }}>Disponible</Typography>
                          </Box>
                        ) : (
                          <Tooltip title={`${reserva.equipo?.nombre || 'Reservado'} - ${reserva.horaInicio?.substring(0,5)} a ${reserva.horaFin?.substring(0,5)}`}>
                            <Box 
                              onClick={() => { setEditing(reserva); setOpen(true); }}
                              sx={{ 
                                width: '100%', height: '100%', borderRadius: 2, p: 1,
                                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                                bgcolor: styles?.bg, borderLeft: `4px solid ${styles?.border}`,
                                cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                              }}
                            >
                              <Typography variant="caption" fontWeight={700} sx={{ color: styles?.text }} noWrap>
                                {reserva.equipo?.nombre || 'Ocupado'}
                              </Typography>
                              <Typography variant="caption" sx={{ color: styles?.text, opacity: 0.8, fontSize: '0.65rem' }} noWrap>
                                {reserva.horaInicio?.substring(0,5)} - {reserva.horaFin?.substring(0,5)}
                              </Typography>
                              <Chip 
                                label={reserva.estado} 
                                size="small" 
                                sx={{ height: 18, fontSize: '0.6rem', mt: 0.5, bgcolor: 'rgba(255,255,255,0.6)', color: styles?.text, fontWeight: 600 }} 
                              />
                            </Box>
                          </Tooltip>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Paper>

      {/* Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>
          {editing?.id ? 'Editar Reserva' : 'Nueva Reserva'}
        </DialogTitle>
        <DialogContent dividers>
          <ReservaForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReservasPage;