import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem,
  useMediaQuery, useTheme, Collapse, InputBase, Badge
} from '@mui/material';
import {
  Menu as MenuIcon, Home, CalendarToday, Assessment, Logout,
  ExpandLess, ExpandMore, Notifications, Settings, Search,
  SportsSoccer, People, AttachMoney, EventNote, School,
  Person
} from '@mui/icons-material';
import { useAuth } from '../../context/auth/AuthContext';

const drawerWidth = 260;

// Paleta de colores oscura basada en tu imagen
const DARK = {
  bg: '#121212',
  paper: '#1E1E1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent: '#B2FF59', // El verde lima del logo
  hover: 'rgba(255, 255, 255, 0.08)',
  active: 'rgba(178, 255, 89, 0.15)'
};

const UserLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout, getFullName, getUserInitials, getUserRoles } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleLogout = async () => {
    handleCloseUserMenu();
    await logout();
    navigate('/login');
  };

  const roles = getUserRoles();
  const isEncargado = roles.includes('encargado_sucursal');
  const isProfesor = roles.includes('profesor_grupo');
  const isApoderado = roles.includes('apoderado');

  // Menú dinámico según el rol
  const menuSections = [
    {
      title: 'PRINCIPAL',
      items: [
        { text: 'Inicio', icon: <Home />, path: '/dashboard', show: true },
        { 
          text: 'Mi Perfil', 
          icon: <Person />, 
          path: '/profile', 
          show: true 
        },
      ]
    },
    {
      title: 'AGENDA',
      items: [
        { 
          text: 'Clases', 
          icon: <EventNote />, 
          path: '/clases', 
          show: isProfesor || isEncargado 
        },
        { 
          text: 'Reservas', 
          icon: <CalendarToday />, 
          path: '/reservas', 
          show: isEncargado 
        },
      ]
    },
    {
      title: 'GESTIÓN',
      items: [
        { 
          text: 'Inscripciones', 
          icon: <Assessment />, 
          path: '/inscripciones', 
          show: isEncargado 
        },
        { 
          text: 'Pagos', 
          icon: <AttachMoney />, 
          path: '/pagos', 
          show: isEncargado 
        },
        { 
          text: 'Asistencias', 
          icon: <People />, 
          path: '/asistencias', 
          show: isEncargado || isProfesor 
        },
      ]
    }
  ];

  const handleSubmenuClick = (id: string) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const drawerContent = (
    <Box sx={{ bgcolor: DARK.bg, color: DARK.textPrimary, height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* Logo Superior */}
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start', px: 3, py: 2, mt: 1 }}>
        <SportsSoccer sx={{ color: DARK.accent, fontSize: 32, mr: 1 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: DARK.textPrimary, lineHeight: 1 }}>
            Sporttia
          </Typography>
          <Typography variant="caption" sx={{ color: DARK.textSecondary }}>
            Manager de centro
          </Typography>
        </Box>
      </Toolbar>

      {/* Buscador */}
      <Box sx={{ px: 2, py: 1 }}>
        <Box sx={{ 
          display: 'flex', alignItems: 'center', bgcolor: DARK.paper, 
          borderRadius: 2, px: 2, py: 0.5 
        }}>
          <Search sx={{ color: DARK.textSecondary, mr: 1, fontSize: 20 }} />
          <InputBase 
            placeholder="Buscar..." 
            sx={{ color: DARK.textPrimary, fontSize: '0.875rem', flex: 1 }} 
          />
          <Typography variant="caption" sx={{ color: DARK.textSecondary, bgcolor: '#333', px: 1, borderRadius: 1 }}>
            ⌘K
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', my: 2 }} />
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 2 }}>
          {menuItems.filter(item => item.show).map((item) => (
            <React.Fragment key={item.text}>
              {item.subItems ? (
                <>
                  <ListItemButton 
                    onClick={() => handleSubmenuClick(item.id!)}
                    sx={{ 
                      borderRadius: 2, mb: 0.5,
                      color: openSubmenu === item.id || item.subItems.some(s => s.path === location.pathname) ? DARK.textPrimary : DARK.textSecondary,
                      '&:hover': { bgcolor: DARK.hover } 
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} slotProps={{ primary: { sx: { fontSize: '0.9rem', fontWeight: 500 } } }} />
                    {openSubmenu === item.id ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                  </ListItemButton>
                  
                  <Collapse in={openSubmenu === item.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {item.subItems.filter(sub => sub.show).map((sub) => {
                        const isActive = location.pathname === sub.path;
                        return (
                          <ListItemButton 
                            key={sub.text} 
                            onClick={() => navigate(sub.path)}
                            sx={{ 
                              borderRadius: 2, mb: 0.5, pl: 4,
                              color: isActive ? DARK.accent : DARK.textSecondary,
                              bgcolor: isActive ? DARK.active : 'transparent',
                              '&:hover': { bgcolor: DARK.hover, color: DARK.textPrimary } 
                            }}
                          >
                            <ListItemText primary={sub.text} slotProps={{ primary: { sx: { fontSize: '0.85rem', fontWeight: isActive ? 600 : 400 } } }} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItemButton 
                  onClick={() => navigate(item.path!)}
                  sx={{ 
                    borderRadius: 2, mb: 0.5,
                    color: location.pathname === item.path ? DARK.accent : DARK.textSecondary,
                    bgcolor: location.pathname === item.path ? DARK.active : 'transparent',
                    '&:hover': { bgcolor: DARK.hover, color: DARK.textPrimary } 
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} slotProps={{ primary: { sx: { fontSize: '0.9rem', fontWeight: location.pathname === item.path ? 600 : 500 } } }} />
                </ListItemButton>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F4F6F8' }}>
      
      {/* Header Superior Limpio */}
      <AppBar position="fixed" sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { md: `${drawerWidth}px` }, bgcolor: '#FFFFFF', color: '#333', boxShadow: '0px 1px 4px rgba(0,0,0,0.05)' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px !important' }}>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={2} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          
          <Box onClick={handleOpenUserMenu} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: DARK.bg, color: DARK.accent, width: 36, height: 36, fontWeight: 700 }}>{getUserInitials()}</Avatar>
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, fontWeight: 600, color: '#333' }}>{getFullName()}</Typography>
          </Box>
          
          <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu} 
            slotProps={{ paper: { sx: { mt: 1.5, minWidth: 200, borderRadius: 2 } }}}>
            <MenuItem onClick={() => { handleCloseUserMenu(); navigate('/profile') }}>
              Mi Perfil
            </MenuItem>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
              <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Oscuro */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none' } }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Área de Contenido */}
      <Box component="main" sx={{ flexGrow: 1, p: 4, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;