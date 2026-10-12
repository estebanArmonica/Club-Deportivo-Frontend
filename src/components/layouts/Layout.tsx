import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  Badge,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  Person,
  Settings,
  Notifications,
  SportsSoccer,
  Home,
  Assessment,
  AddCircle,
  ListAlt,
  KeyboardArrowDown,
  ExpandLess,
  ExpandMore,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/auth/AuthContext';

// Paleta de colores refinada
const THEME = {
  green: '#1B5E20',
  greenLight: '#2E7D32',
  greenDark: '#0D3B0F',
  greenAccent: '#4CAF50',
  text: '#1a202c',
  textSecondary: '#64748b',
  bg: '#f5f7fa',
  white: '#ffffff',
};

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { logout, getFullName, getUserInitials } = useAuth();

  // Estados para menús
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElCategories, setAnchorElCategories] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  // Manejadores
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  
  const handleOpenCategories = (event: React.MouseEvent<HTMLElement>) => setAnchorElCategories(event.currentTarget);
  const handleCloseCategories = () => setAnchorElCategories(null);
  
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate('/profile');
  };

  const goTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setMobileCategoriesOpen(false);
    handleCloseCategories();
  };

  const isActive = (path: string) => location.pathname === path;
  const isCategoryActive = () => 
    isActive('/categorias/cate-crear');

  // Navegación principal (sin categorías)
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <Home fontSize="small" /> },
    { label: 'Reportes', path: '/reportes', icon: <Assessment fontSize="small" /> },
    { label: 'Configuración', path: '/configuracion', icon: <Settings fontSize="small" /> },
  ];

  // Submenú de Categorías
  const categoryItems = [
    { label: 'Crear Categorías', path: '/categorias/cate-crear',   icon: <AddCircle fontSize="small" /> },
    { label: 'Crear Equipo',     path: '/categorias/equipo-crear', icon: <AddCircle fontSize="small" /> },
    { label: 'Crear Deporte',    path: '/categorias/deporte-crear',icon: <AddCircle fontSize="small" /> },
    { label: 'Crear Grupo',      path: '/categorias/grupo-crear',  icon: <AddCircle fontSize="small" /> },
    { label: 'Listar Categorías', path: '/categorias/listar', icon: <ListAlt fontSize="small" /> },
  ];

  // ============ MENÚ MÓVIL ============
  const mobileMenuContent = (
    <Box sx={{ width: 280, pt: 2, height: '100%', bgcolor: THEME.green }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, mb: 3, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Avatar sx={{ bgcolor: 'white', color: THEME.green, mr: 1.5, width: 40, height: 40 }}>
          <SportsSoccer />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'white', lineHeight: 1.2 }}>
            Club Deportivo
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            Sistema de Gestión
          </Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5 }}>
        {/* Items principales */}
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton 
              onClick={() => goTo(item.path)}
              selected={isActive(item.path)}
              sx={{
                borderRadius: 2,
                color: 'white',
                '&.Mui-selected': { 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: isActive(item.path) ? 700 : 500, 
                  fontSize: '0.95rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}

        {/* Dropdown de Categorías (Mobile) */}
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton 
            onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
            sx={{
              borderRadius: 2,
              color: 'white',
              bgcolor: isCategoryActive() ? 'rgba(255,255,255,0.15)' : 'transparent',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <CategoryIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Categorías" 
              primaryTypographyProps={{ 
                fontWeight: isCategoryActive() ? 700 : 500, 
                fontSize: '0.95rem'
              }} 
            />
            {mobileCategoriesOpen ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={mobileCategoriesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 2 }}>
            {categoryItems.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton 
                  onClick={() => goTo(item.path)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    color: 'white',
                    pl: 3,
                    '&.Mui-selected': { 
                      bgcolor: 'rgba(255,255,255,0.15)',
                    },
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontWeight: isActive(item.path) ? 700 : 500, 
                      fontSize: '0.875rem'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      width: '100%', 
      bgcolor: THEME.bg,
    }}>
      
      {/* ================= 1. BARRA SUPERIOR (BLANCA) ================= */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          color: THEME.text, 
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ 
          justifyContent: 'space-between', 
          minHeight: '68px !important', 
          px: { xs: 2, md: 4 },
        }}>
          
          {/* Logo y Nombre */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5, 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }} 
            onClick={() => navigate('/dashboard')}
          >
            <Avatar sx={{ 
              background: `linear-gradient(135deg, ${THEME.green} 0%, ${THEME.greenAccent} 100%)`,
              color: 'white', 
              width: 42, 
              height: 42,
              boxShadow: `0 4px 12px ${alpha(THEME.green, 0.3)}`,
            }}>
              <SportsSoccer />
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  letterSpacing: -0.5, 
                  color: THEME.green,
                  lineHeight: 1.1,
                  fontSize: '1.15rem',
                }}
              >
                Club Deportivo
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: THEME.textSecondary,
                  fontSize: '0.7rem',
                  letterSpacing: 0.5,
                  fontWeight: 500,
                }}
              >
                Sistema de Gestión
              </Typography>
            </Box>
          </Box>

          {/* Acciones de la derecha */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            
            {/* Notificaciones con animación */}
            <Tooltip title="Notificaciones">
              <IconButton 
                sx={{ 
                  color: THEME.textSecondary,
                  transition: 'all 0.2s',
                  '&:hover': { 
                    color: THEME.green,
                    bgcolor: alpha(THEME.green, 0.08),
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                <Badge 
                  badgeContent={3} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.15)' },
                      },
                    }
                  }}
                >
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: 'center', mx: 0.5 }} />

            {/* Perfil de Usuario */}
            <Box 
              onClick={handleOpenUserMenu} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                cursor: 'pointer',
                padding: '6px 12px',
                borderRadius: 3,
                transition: 'all 0.2s',
                '&:hover': { 
                  bgcolor: alpha(THEME.green, 0.06),
                }
              }}
            >
              <Avatar sx={{ 
                width: 38, 
                height: 38, 
                bgcolor: THEME.green, 
                color: 'white', 
                fontWeight: 700, 
                fontSize: '0.9rem',
                border: `2px solid ${alpha(THEME.green, 0.2)}`,
                transition: 'all 0.2s',
              }}>
                {getUserInitials()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: THEME.text }}>
                  {getFullName()}
                </Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: THEME.textSecondary, fontWeight: 500 }}>
                  Administrador
                </Typography>
              </Box>
              <KeyboardArrowDown 
                fontSize="small" 
                sx={{ 
                  color: THEME.textSecondary,
                  display: { xs: 'none', md: 'block' },
                  transition: 'transform 0.2s',
                }} 
              />
            </Box>

            {/* Menú de Usuario */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{ 
                sx: { 
                  mt: 1.5, 
                  minWidth: 220, 
                  borderRadius: 3, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                  }
                } 
              }}
            >
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {getFullName()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  admin@clubdeportivo.cl
                </Typography>
              </Box>
              <MenuItem onClick={handleProfile} sx={{ py: 1.2 }}>
                <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                <ListItemText primary="Mi Perfil" primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </MenuItem>
              <MenuItem onClick={handleProfile} sx={{ py: 1.2 }}>
                <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                <ListItemText primary="Configuración" primaryTypographyProps={{ fontSize: '0.9rem' }} />
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleLogout} 
                sx={{ 
                  color: 'error.main', 
                  py: 1.2,
                  '&:hover': { bgcolor: alpha('#f44336', 0.08) }
                }}
              >
                <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
                <ListItemText primary="Cerrar sesión" primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ================= 2. BARRA DE NAVEGACIÓN (VERDE) ================= */}
      <Box 
        sx={{ 
          background: `linear-gradient(135deg, ${THEME.greenDark} 0%, ${THEME.green} 50%, ${THEME.greenLight} 100%)`,
          color: 'white', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          position: 'sticky', 
          top: 68, 
          zIndex: 1200, 
          width: '100%',
        }}
      >
        {isMobile ? (
          <Toolbar sx={{ minHeight: '52px !important', justifyContent: 'center' }}>
            <Button 
              color="inherit" 
              startIcon={<MenuIcon />} 
              onClick={handleDrawerToggle}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 600, 
                width: '100%',
                py: 1,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Ver Secciones
            </Button>
          </Toolbar>
        ) : (
          <Toolbar sx={{ 
            minHeight: '52px !important', 
            justifyContent: 'center', 
            gap: 0.5,
            px: 4,
          }}>
            {/* Items principales */}
            {navItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <React.Fragment key={item.label}>
                  {index > 0 && (
                    <Divider 
                      orientation="vertical" 
                      flexItem 
                      sx={{ 
                        height: 20, 
                        alignSelf: 'center', 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        mx: 0.5,
                      }} 
                    />
                  )}
                  <Button
                    onClick={() => goTo(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      position: 'relative',
                      bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                      transition: 'all 0.25s ease',
                      '& .MuiButton-startIcon': {
                        transition: 'transform 0.25s ease',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                        width: '60%',
                        height: '3px',
                        bgcolor: 'white',
                        borderRadius: '3px 3px 0 0',
                        transition: 'transform 0.3s ease',
                      },
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.12)',
                        transform: 'translateY(-1px)',
                        '& .MuiButton-startIcon': {
                          transform: 'scale(1.15)',
                        },
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </React.Fragment>
              );
            })}

            {/* Separador antes del dropdown de categorías */}
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                height: 20, 
                alignSelf: 'center', 
                bgcolor: 'rgba(255,255,255,0.2)',
                mx: 0.5,
              }} 
            />

            {/* Dropdown de Categorías */}
            <Button
              onClick={handleOpenCategories}
              startIcon={<CategoryIcon fontSize="small" />}
              endIcon={<KeyboardArrowDown 
                fontSize="small" 
                sx={{ 
                  transition: 'transform 0.25s ease',
                  transform: Boolean(anchorElCategories) ? 'rotate(180deg)' : 'rotate(0deg)',
                }} 
              />}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontWeight: isCategoryActive() ? 700 : 500,
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                borderRadius: 2,
                position: 'relative',
                bgcolor: isCategoryActive() ? 'rgba(255,255,255,0.15)' : 'transparent',
                transition: 'all 0.25s ease',
                '& .MuiButton-startIcon': {
                  transition: 'transform 0.25s ease',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: isCategoryActive() ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                  width: '60%',
                  height: '3px',
                  bgcolor: 'white',
                  borderRadius: '3px 3px 0 0',
                  transition: 'transform 0.3s ease',
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.12)',
                  transform: 'translateY(-1px)',
                  '& .MuiButton-startIcon': {
                    transform: 'scale(1.15)',
                  },
                },
              }}
            >
              Categorías
            </Button>

            {/* Menú desplegable de Categorías */}
            <Menu
              anchorEl={anchorElCategories}
              open={Boolean(anchorElCategories)}
              onClose={handleCloseCategories}
              transformOrigin={{ horizontal: 'center', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
              PaperProps={{ 
                sx: { 
                  mt: 1.5, 
                  minWidth: 220, 
                  borderRadius: 3, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  border: '1px solid',
                  borderColor: 'divider',
                  overflow: 'visible',
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    zIndex: 0,
                    borderTop: '1px solid',
                    borderLeft: '1px solid',
                    borderColor: 'divider',
                  }
                } 
              }}
            >
              {categoryItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <MenuItem 
                    key={item.label}
                    onClick={() => goTo(item.path)}
                    sx={{ 
                      py: 1.3,
                      bgcolor: active ? alpha(THEME.green, 0.08) : 'transparent',
                      '&:hover': { bgcolor: alpha(THEME.green, 0.12) }
                    }}
                  >
                    <ListItemIcon sx={{ color: active ? THEME.green : 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        fontSize: '0.9rem',
                        fontWeight: active ? 700 : 500,
                        color: active ? THEME.green : 'inherit',
                      }} 
                    />
                  </MenuItem>
                );
              })}
            </Menu>
          </Toolbar>
        )}
      </Box>

      {/* ================= MENÚ MÓVIL (DRAWER) ================= */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ 
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: THEME.green,
            borderRight: 'none',
          } 
        }}
      >
        {mobileMenuContent}
      </Drawer>

      {/* ================= CONTENIDO PRINCIPAL ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;