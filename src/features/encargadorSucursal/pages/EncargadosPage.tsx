import React, { useEffect, useState } from 'react';
import { 
  Box, Typography, Button, Paper, Grid, Chip, CircularProgress, 
  Select, MenuItem, FormControl, InputLabel, IconButton, Tooltip 
} from '@mui/material';
import { Add as AddIcon, ChevronLeft, ChevronRight, EventNote } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { reservaService } from '../../../services/reserva/reserva.service';
import { canchaService } from '../../../services/cancha/cancha.service';

import ReservaForm from '../../reserva/components/ReservaForm';

// Definimos los horarios de 08:00 a 21:00
const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

const ReservasPage = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [canchas, setCanchas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fecha seleccionada (por defecto hoy)
  const [fechaActual, setFechaActual] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [res, can] = await Promise.all([reservaService.getAll(), canchaService.getAll()]);
      setReservas(res);
      setCanchas(can);
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

  const handleAction = async (id: number, action: 'cancelar' | 'completar') => {
    const res = await Swal.fire({ title: `¿Estás seguro de ${action}?`, icon: 'question', showCancelButton: true });
    if (res.isConfirmed) {
      try {
        if (action === 'cancelar') await reservaService.cancelar(id);
        if (action === 'completar') await reservaService.completar(id);
        toast.success(`Reserva ${action}da`); 
        fetchData();
      } catch { toast.error('Error'); }
    }
  };

  // Cambiar días
  const cambiarDia = (dias: number) => {
    const d = new Date(fechaActual);
    d.setDate(d.getDate() + dias);
    setFechaActual(d.toISOString().split('T')[0]);
  };

  // Buscar si hay una reserva en una celda específica
  const getReservaEnCelda = (canchaId: number, hora: string) => {
    return reservas.find(r => 
      r.fecha?.split('T')[0] === fechaActual && 
      r.cancha?.id === canchaId && 
      r.horaInicio?.substring(0, 5) === hora
    );
  };

  if (loading) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      
      {/* Barra Superior de Filtros y Navegación */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
            Calendario de Reservas
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f0f0f0', borderRadius: 2, px: 1 }}>
            <IconButton size="small" onClick={() => cambiarDia(-1)}><ChevronLeft /></IconButton>
            <Typography sx={{ mx: 2, fontWeight: 600 }}>
              {new Date(fechaActual).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Typography>
            <IconButton size="small" onClick={() => cambiarDia(1)}><ChevronRight /></IconButton>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenCreate()} sx={{ bgcolor: '#1B5E20' }}>
          Nueva Reserva
        </Button>
      </Paper>

      {/* Cuadrícula del Calendario */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Grid container>
          
          {/* Columna de Horas (Izquierda) */}
          <Grid size={1.5} sx={{ borderRight: '1px solid #eee', bgcolor: '#fafafa' }}>
            <Box sx={{ height: 60, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>HORA</Typography>
            </Box>
            {HORARIOS.map(hora => (
              <Box key={hora} sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #eee' }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>{hora}</Typography>
              </Box>
            ))}
          </Grid>

          {/* Columnas de Canchas */}
          {canchas.map(cancha => (
            <Grid size={2.1} key={cancha.id} sx={{ borderRight: '1px solid #eee' }}>
              {/* Cabecera de la cancha */}
              <Box sx={{ height: 60, borderBottom: '1px solid #eee', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#fff' }}>
                <Typography variant="subtitle2" fontWeight={700}>{cancha.nombre}</Typography>
                <Typography variant="caption" color="text.secondary">{cancha.tipo}</Typography>
              </Box>

              {/* Celdas de la cancha */}
              {HORARIOS.map(hora => {
                const reserva = getReservaEnCelda(cancha.id, hora);
                const isDisponible = !reserva;

                return (
                  <Box 
                    key={hora} 
                    sx={{ 
                      height: 80, borderBottom: '1px solid #eee', p: 0.5,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      bgcolor: isDisponible ? '#F4F9F4' : 'transparent',
                      cursor: isDisponible ? 'pointer' : 'default',
                      transition: 'all 0.2s',
                      '&:hover': isDisponible ? { bgcolor: '#E8F5E9' } : {}
                    }}
                    onClick={() => isDisponible && handleOpenCreate(hora, cancha.id)}
                  >
                    {isDisponible ? (
                      <Typography variant="caption" color="success.main" sx={{ opacity: 0.5 }}>
                        + Disponible
                      </Typography>
                    ) : (
                      <Tooltip title="Clic para gestionar">
                        <Box 
                          sx={{ 
                            width: '100%', height: '100%', p: 1, borderRadius: 1, 
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            bgcolor: reserva.estado === 'CANCELADA' ? '#FFEBEE' : reserva.estado === 'COMPLETADA' ? '#E0F2F1' : '#E3F2FD',
                            borderLeft: `4px solid ${reserva.estado === 'CANCELADA' ? '#d32f2f' : reserva.estado === 'COMPLETADA' ? '#00897b' : '#1976d2'}`,
                            cursor: 'pointer'
                          }}
                          onClick={() => { setEditing(reserva); setOpen(true); }}
                        >
                          <Typography variant="caption" fontWeight={700} noWrap>{reserva.equipo?.nombre || 'Equipo'}</Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>{reserva.horaInicio.substring(0,5)} - {reserva.horaFin.substring(0,5)}</Typography>
                          <Chip 
                            label={reserva.estado} 
                            size="small" 
                            sx={{ height: 16, fontSize: '0.6rem', mt: 0.5, bgcolor: 'rgba(255,255,255,0.5)' }} 
                          />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Modal de Reserva */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1B5E20' }}>
          {editing?.id ? 'Editar Reserva' : 'Nueva Reserva'}
        </DialogTitle>
        <DialogContent dividers>
          {/* Aquí iría el formulario. Si pasamos la hora y cancha inicial, se auto-completa */}
          <ReservaForm initialData={editing} onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReservasPage;