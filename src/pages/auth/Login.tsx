import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container, Box, Typography, TextField, Button, Paper, Alert, 
  CircularProgress, InputAdornment, IconButton, FormControlLabel, 
  Checkbox, Link, Divider, Avatar
} from '@mui/material';
import { Visibility, VisibilityOff, Shield } from '@mui/icons-material';
import { useAuth } from '../../context/auth/AuthContext';

// Asegúrate de que esta ruta sea la correcta
import fondoDeportes from '../../assets/images/fondo-login.png'; 

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isSubmitting) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, isSubmitting]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'rememberMe' ? checked : value }));
    if (localError) setLocalError(null);
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      setLocalError('Por favor, completa todos los campos');
      setIsSubmitting(false);
      return;
    }
    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setLocalError('Por favor, ingresa un email válido');
      setIsSubmitting(false);
      return;
    }
    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setLocalError(result.error || 'Error al iniciar sesión');
        setIsSubmitting(false);
      }
    } catch (err) {
      setLocalError('Error inesperado al iniciar sesión');
      setIsSubmitting(false);
    }
  };

  const displayError = localError || error;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        backgroundImage: `url(${fondoDeportes})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Capa sutil para que la imagen se vea pero el texto sea legible (sin taparla) */}
      <Box
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.2) 100%)',
          zIndex: 1,
        }}
      />

      {/* Contenedor pequeño y centrado */}
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '350px' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3, // Padding bien compacto
            width: '100%',
            borderRadius: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)', // Casi blanco sólido
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          }}
        >
          {/* Cabecera minimalista y alineada a la izquierda para un look moderno */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40, // Logo pequeño y elegante
                height: 40,
                mr: 2,
              }}
            >
              <Shield sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography component="h1" variant="h6" sx={{ fontWeight: 700, color: '#1a202c', lineHeight: 1.2 }}>
                Club Deportivo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sistema de Gestión
              </Typography>
            </Box>
          </Box>

          {/* Errores */}
          {displayError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2, fontSize: '0.8rem', py: 0.5 }} onClose={() => { setLocalError(null); clearError(); }}>
              {displayError}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Correo"
              type="email"
              autoComplete="email"
              autoFocus
              size="small" // Campos pequeños
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 1.5 }} // Espaciado reducido
              error={!!displayError}
              variant="outlined"
            />

            <TextField
              fullWidth
              id="password"
              name="password"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              size="small"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 1.5 }}
              error={!!displayError}
              variant="outlined"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={<Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleChange} color="success" disabled={loading} size="small" sx={{ '& .MuiSvgIcon-root': { fontSize: 18 } }} />}
                label={<Typography variant="caption">Recordarme</Typography>}
              />
              <Link href="#" variant="caption" underline="hover" sx={{ fontSize: '0.8rem' }} onClick={(e) => { e.preventDefault(); console.log('Recuperar contraseña'); }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || isSubmitting}
              sx={{
                mb: 2,
                height: 40, // Botón compacto
                fontSize: '0.85rem',
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: 'none',
                '&:hover': { boxShadow: '0 2px 8px rgba(34, 210, 25, 0.2)' }
              }}
            >
              {(loading || isSubmitting) ? <CircularProgress size={18} color="inherit" /> : 'Ingresar'}
            </Button>

            <Divider sx={{ mb: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                Acceso restringido
              </Typography>
            </Divider>

            <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block', textAlign: 'center' }}>
              ¿Necesitas ayuda? Contacta al{' '}
              <Link href="#" underline="hover" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                administrador
              </Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;