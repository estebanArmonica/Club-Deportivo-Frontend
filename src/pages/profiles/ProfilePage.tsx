import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Card, CardContent, Typography, TextField, Button, Avatar, 
  Tabs, Tab, CircularProgress, Divider , Chip
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/auth/AuthContext';
import { usuarioService } from '../../services/user/usuario.service';
import { profileInfoSchema, profilePasswordSchema, ProfileInfoFormData, ProfilePasswordFormData } from '../../schemas/dtos/user/ProfileSchema';
import { Usuario } from '../../schemas/dtos/user/UsuarioDto';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const { user, getUserInitials } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);
  const [dbUser, setDbUser] = useState<Usuario | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar los datos reales desde el backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.email) return;
      try {
        const data = await usuarioService.getByEmail(user.email);
        setDbUser(data);
        
        // Si quieres que el formulario se llene con los datos de la BD
        resetInfo({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          email: data.email || '',
          telefono: '',
          direccion: '',
          ciudad: '',
          pais: 'Chile',
        });
      } catch (error) {
        console.error('Error al cargar datos del perfil', error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchUserData();
  }, [user]);

  // Formulario de Datos
  const { control: controlInfo, handleSubmit: handleSubmitInfo, reset: resetInfo, formState: { errors: errorsInfo } } = useForm<ProfileInfoFormData>({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: '',
      email: user?.email || '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: 'Chile',
    },
  });

  // Formulario de Contraseña
  const { control: controlPass, handleSubmit: handleSubmitPass, reset: resetPass, formState: { errors: errorsPass } } = useForm<ProfilePasswordFormData>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmitInfo = async (data: ProfileInfoFormData) => {
    if (!dbUser?.id) return;
    setLoadingInfo(true);
    try {
      // ✅ Conectado al backend real
      await usuarioService.update(dbUser.id, data);
      toast.success('Datos actualizados correctamente. Vuelve a iniciar sesión para ver los cambios.');
    } catch (error) {
      toast.error('Error al actualizar los datos. Verifica el email.');
    } finally {
      setLoadingInfo(false);
    }
  };

  const onSubmitPassword = async (data: ProfilePasswordFormData) => {
    if (!dbUser?.id) return;
    setLoadingPass(true);
    try {
      // ✅ Conectado al backend real
      await usuarioService.changePassword(dbUser.id, data.newPassword);
      toast.success('Contraseña actualizada correctamente');
      resetPass();
    } catch (error) {
      toast.error('Error al cambiar la contraseña');
    } finally {
      setLoadingPass(false);
    }
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#f5f5f5',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: '1px solid #1976d2' },
    }
  };

  if (loadingData) return <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

  // Lógica para no mostrar el nombre dos veces si es igual al email
  const showName = dbUser?.nombre && dbUser.nombre !== dbUser.email;
  const displayName = showName ? `${dbUser.nombre} ${dbUser.apellido || ''}` : 'Usuario';

  return (
    <Box sx={{ maxWidth: 1100, margin: '0 auto', p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: '#2E7D32' }}>
          Configuración
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Administra tu información personal y seguridad de la cuenta.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        
        {/* COLUMNA IZQUIERDA */}
        <Grid size={{ xs: 12, md: 3.5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', textAlign: 'center', pt: 4, pb: 4, bgcolor: '#fafafa' }}>
            <CardContent>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar sx={{ width: 110, height: 110, mx: 'auto', bgcolor: '#e0e0e0', color: '#757575', fontSize: '3rem' }}>
                  {getUserInitials()}
                </Avatar>
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#2E7D32', borderRadius: '50%', p: 0.8, display: 'flex', cursor: 'pointer' }}>
                  <PhotoCamera sx={{ color: 'white', fontSize: 18 }} />
                </Box>
              </Box>
              

              <Typography variant="h6" sx={{ fontWeight: 600 }}>{displayName}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{dbUser?.email}</Typography>
              
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, px: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Rol Actual</Typography>
                    <Chip 
                      label={user?.roles[0]?.replace('ROLE_', '').replace('_', ' ').toLowerCase() || 'usuario'} 
                      size="small"
                      sx={{ 
                        textTransform: 'capitalize', // Pone la primera letra en mayúscula (Ej: "Encargado sucursal")
                        bgcolor: '#E8F5E9', 
                        color: '#2E7D32', 
                        fontWeight: 600,
                        alignSelf: 'flex-start', // Para que no ocupe todo el ancho
                        borderRadius: 1
                      }} 
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Estado</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip 
                      label={dbUser?.isActive ? 'Activo' : 'Inactivo'} 
                      size="small"
                      color={dbUser?.isActive ? 'success' : 'warning'}
                      sx={{ 
                        textTransform: 'capitalize',
                        bgcolor: dbUser?.isActive ? '#E8F5E9' : '#FFF3E0', // Verde suave / Naranja suave
                        color: dbUser?.isActive ? '#2E7D32' : '#E65100',   // Verde oscuro / Naranja oscuro
                        fontWeight: 600,
                        alignSelf: 'flex-start', // Para que no ocupe todo el ancho
                        borderRadius: 1
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* COLUMNA DERECHA */}
        <Grid size={{ xs: 12, md: 8.5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', bgcolor: 'white' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
              <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} textColor="inherit" indicatorColor="secondary"
                sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, fontSize: '1rem' } }}>
                <Tab label="Datos de la Cuenta" />
                <Tab label="Seguridad" />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <TabPanel value={tabValue} index={0}>
                <Box component="form" onSubmit={handleSubmitInfo(onSubmitInfo)}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Nombre</Typography>
                      <Controller name="nombre" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} error={!!errorsInfo.nombre} helperText={errorsInfo.nombre?.message} />
                      )} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Apellido</Typography>
                      <Controller name="apellido" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} />
                      )} />
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Teléfono</Typography>
                      <Controller name="telefono" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} />
                      )} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Correo Electrónico</Typography>
                      <Controller name="email" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} error={!!errorsInfo.email} helperText={errorsInfo.email?.message} />
                      )} />
                    </Grid>

                    <Grid size={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Dirección</Typography>
                      <Controller name="direccion" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} />
                      )} />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Ciudad</Typography>
                      <Controller name="ciudad" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} />
                      )} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>País</Typography>
                      <Controller name="pais" control={controlInfo} render={({ field }) => (
                        <TextField {...field} fullWidth size="small" sx={inputStyle} />
                      )} />
                    </Grid>

                    <Grid size={12} sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" disabled={loadingInfo}
                        sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#35ca3c' }, px: 4, borderRadius: 2, textTransform: 'none' }}>
                        {loadingInfo ? <CircularProgress size={24} color="inherit" /> : 'Actualizar datos'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Box component="form" onSubmit={handleSubmitPass(onSubmitPassword)}>
                  <Grid container spacing={3}>
                    <Grid size={12}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Contraseña Actual</Typography>
                      <Controller name="currentPassword" control={controlPass} render={({ field }) => (
                        <TextField {...field} type="password" fullWidth size="small" sx={inputStyle} error={!!errorsPass.currentPassword} helperText={errorsPass.currentPassword?.message} />
                      )} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Nueva Contraseña</Typography>
                      <Controller name="newPassword" control={controlPass} render={({ field }) => (
                        <TextField {...field} type="password" fullWidth size="small" sx={inputStyle} error={!!errorsPass.newPassword} helperText={errorsPass.newPassword?.message} />
                      )} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>Confirmar Contraseña</Typography>
                      <Controller name="confirmPassword" control={controlPass} render={({ field }) => (
                        <TextField {...field} type="password" fullWidth size="small" sx={inputStyle} error={!!errorsPass.confirmPassword} helperText={errorsPass.confirmPassword?.message} />
                      )} />
                    </Grid>
                    <Grid size={12} sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" disabled={loadingPass}
                        sx={{ bgcolor: '#2E7D32', '&:hover': { bgcolor: '#35ca3c' }, px: 4, borderRadius: 2, textTransform: 'none' }}>
                        {loadingPass ? <CircularProgress size={24} color="inherit" /> : 'Cambiar Contraseña'}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;