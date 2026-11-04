import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Avatar, Menu, MenuItem, Divider,
  ListItemIcon, Tooltip, Badge, Button, Drawer, List, ListItem, ListItemButton,
  ListItemText, useMediaQuery, useTheme, alpha, Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon, Logout, Person, Settings, Notifications, SportsSoccer,
  Home, Assessment, KeyboardArrowDown, ExpandLess, ExpandMore, Category as CategoryIcon,
  
  // Nuevos iconos para los menús
  Group as GroupIcon, 
  LocationCity as LocationCityIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/auth/AuthContext';

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

  // Estados para menús (Agregamos más estados para los nuevos dropdowns)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElCategory, setAnchorElCategory] = useState<null | HTMLElement>(null);
  const [anchorElAdmin, setAnchorElAdmin] = useState<null | HTMLElement>(null);
  const [anchorElOperations, setAnchorElOperations] = useState<null | HTMLElement>(null);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  // Manejadores
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => setter(event.currentTarget);
  const handleCloseAllMenus = () => {
    setAnchorElCategory(null);
    setAnchorElAdmin(null);
    setAnchorElOperations(null);
  };
  
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
    setMobileMenuOpen(null);
    handleCloseAllMenus();
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (paths: string[]) => paths.includes(location.pathname);

  // ==========================================
  // Rutas y menús
  // ==========================================

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: <Home fontSize="small" /> },
  ];

  // 1. Menú de Gestión Base
  const categoryItems = [
    { label: 'Deportes', path: '/deportes', icon: <SportsSoccer fontSize="small" /> },
    { label: 'Categorías', path: '/categorias', icon: <CategoryIcon fontSize="small" /> },
    { label: 'Grupos', path: '/grupos', icon: <GroupIcon fontSize="small" /> },
    { label: 'Alumnos', path: '/alumnos', icon: <Person fontSize="small" /> },
    { label: 'Apoderados', path: '/apoderados', icon: <Person fontSize="small" /> },
  ];

  // 2. Menú de Operaciones (Clases, Reservas, Asistencias)
  const operationItems = [
    { label: 'Clases', path: '/clases', icon: <EventIcon fontSize="small" /> },
    { label: 'Reservas', path: '/reservas', icon: <Assessment fontSize="small" /> },
    { label: 'Asistencias', path: '/asistencias', icon: <Person fontSize="small" /> },
    { label: 'Inscripciones', path: '/inscripciones', icon: <Person fontSize="small" /> },
  ];

  // 3. Menú de Administración (Lugares, Usuarios, Pagos)
  const adminItems = [
    { label: 'Clubes', path: '/clubes', icon: <LocationCityIcon fontSize="small" /> },
    { label: 'Sucursales', path: '/sucursales', icon: <LocationCityIcon fontSize="small" /> },
    { label: 'Canchas', path: '/canchas', icon: <LocationCityIcon fontSize="small" /> },
    { label: 'Usuarios', path: '/usuarios', icon: <Person fontSize="small" /> },
    { label: 'Profesores', path: '/profesores', icon: <Person fontSize="small" /> },
    { label: 'Encargados', path: '/encargados', icon: <Person fontSize="small" /> },
    { label: 'Pagos', path: '/pagos', icon: <MoneyIcon fontSize="small" /> },
  ];

  // ==========================================
  // 📱 MENÚ MÓVIL
  // ==========================================
  const renderMobileMenuItem = (title: string, items: any[], id: string) => (
    <>
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton 
          onClick={() => setMobileMenuOpen(mobileMenuOpen === id ? null : id)}
          sx={{ borderRadius: 2, color: 'white', bgcolor: isGroupActive(items.map(i => i.path)) ? 'rgba(255,255,255,0.15)' : 'transparent', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}><CategoryIcon fontSize="small" /></ListItemIcon>
          <ListItemText primary={title} slotProps={{ primary: { sx: { fontWeight: 500, fontSize: '0.95rem' } } }} />
          {mobileMenuOpen === id ? <ExpandLess sx={{ color: 'white' }} /> : <ExpandMore sx={{ color: 'white' }} />}
        </ListItemButton>
      </ListItem>
      <Collapse in={mobileMenuOpen === id} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 2 }}>
          {items.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => goTo(item.path)}
                selected={isActive(item.path)}
                sx={{ borderRadius: 2, color: 'white', pl: 3, '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.15)' } }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 500, fontSize: '0.95rem' } } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  );

  const mobileMenuContent = (
    <Box sx={{ width: 280, pt: 2, height: '100%', bgcolor: THEME.green }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 3, mb: 3, pb: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Avatar sx={{ bgcolor: 'white', color: THEME.green, mr: 1.5, width: 40, height: 40 }}><SportsSoccer /></Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}>Club Deportivo</Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Sistema de Gestión</Typography>
        </Box>
      </Box>

      <List sx={{ px: 1.5 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton onClick={() => goTo(item.path)} selected={isActive(item.path)} sx={{ borderRadius: 2, color: 'white' }}>
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}

        {renderMobileMenuItem('Gestión Base', categoryItems, 'gestion')}
        {renderMobileMenuItem('Operaciones', operationItems, 'operaciones')}
        {renderMobileMenuItem('Administración', adminItems, 'admin')}
      </List>
    </Box>
  );

  // ==========================================
  // Nuestro Render principal
  // ==========================================
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', bgcolor: THEME.bg }}>
      
      {/* 1. BARRA SUPERIOR (BLANCA) */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', color: THEME.text, borderBottom: '1px solid', borderColor: 'divider', zIndex: 1300 }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '68px !important', px: { xs: 2, md: 4 } }}>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
            <Avatar sx={{ background: `linear-gradient(135deg, ${THEME.green} 0%, ${THEME.greenAccent} 100%)`, color: 'white', width: 42, height: 42 }}>
              <SportsSoccer />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5, color: THEME.green, lineHeight: 1.1, fontSize: '1.15rem' }}>Club Deportivo</Typography>
              <Typography variant="caption" sx={{ color: THEME.textSecondary, fontSize: '0.7rem', fontWeight: 500 }}>Sistema de Gestión</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
            <Tooltip title="Notificaciones">
              <IconButton sx={{ color: THEME.textSecondary }}>
                <Badge badgeContent={3} color="error"><Notifications /></Badge>
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ height: 28, alignSelf: 'center', mx: 0.5 }} />

            <Box onClick={handleOpenUserMenu} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', padding: '6px 12px', borderRadius: 3, '&:hover': { bgcolor: alpha(THEME.green, 0.06) } }}>
              <Avatar sx={{ width: 38, height: 38, bgcolor: THEME.green, color: 'white', fontWeight: 700, fontSize: '0.9rem' }}>{getUserInitials()}</Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: THEME.text }}>{getFullName()}</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem', color: THEME.textSecondary, fontWeight: 500 }}>Administrador</Typography>
              </Box>
              <KeyboardArrowDown fontSize="small" sx={{ color: THEME.textSecondary }} />
            </Box>

            <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
              <MenuItem onClick={handleProfile}><ListItemIcon><Person fontSize="small" /></ListItemIcon>Mi Perfil</MenuItem>
              <MenuItem onClick={handleProfile}><ListItemIcon><Settings fontSize="small" /></ListItemIcon>Configuración</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}><ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. BARRA DE NAVEGACIÓN (VERDE) */}
      <Box sx={{ background: `linear-gradient(135deg, ${THEME.greenDark} 0%, ${THEME.green} 50%, ${THEME.greenLight} 100%)`, color: 'white', position: 'sticky', top: 68, zIndex: 1200, width: '100%' }}>
        {isMobile ? (
          <Toolbar sx={{ minHeight: '52px !important', justifyContent: 'center' }}>
            <Button color="inherit" startIcon={<MenuIcon />} onClick={handleDrawerToggle} sx={{ textTransform: 'none', fontWeight: 600, width: '100%' }}>Ver Secciones</Button>
          </Toolbar>
        ) : (
          <Toolbar sx={{ minHeight: '52px !important', justifyContent: 'center', gap: 0.5, px: 4 }}>
            
            <Button onClick={() => goTo('/dashboard')} startIcon={<Home fontSize="small" />} sx={{ color: 'white', textTransform: 'none', fontWeight: isActive('/dashboard') ? 700 : 500 }}>Home</Button>
            <Divider orientation="vertical" flexItem sx={{ height: 20, alignSelf: 'center', bgcolor: 'rgba(255,255,255,0.2)', mx: 1 }} />

            {/* Dropdown: Gestión Base */}
            <Button onClick={(e) => handleOpenMenu(e, setAnchorElCategory)} startIcon={<CategoryIcon fontSize="small" />} endIcon={<KeyboardArrowDown fontSize="small" />} sx={{ color: 'white', textTransform: 'none', fontWeight: isGroupActive(categoryItems.map(i => i.path)) ? 700 : 500 }}>
              Gestión Base
            </Button>
            <Menu anchorEl={anchorElCategory} open={Boolean(anchorElCategory)} onClose={handleCloseAllMenus} sx={{ mt: 1 }}>
              {categoryItems.map((item) => (
                <MenuItem key={item.label} onClick={() => goTo(item.path)}><ListItemIcon>{item.icon}</ListItemIcon><ListItemText>{item.label}</ListItemText></MenuItem>
              ))}
            </Menu>

            {/* Dropdown: Operaciones */}
            <Button onClick={(e) => handleOpenMenu(e, setAnchorElOperations)} startIcon={<EventIcon fontSize="small" />} endIcon={<KeyboardArrowDown fontSize="small" />} sx={{ color: 'white', textTransform: 'none', fontWeight: isGroupActive(operationItems.map(i => i.path)) ? 700 : 500 }}>
              Operaciones
            </Button>
            <Menu anchorEl={anchorElOperations} open={Boolean(anchorElOperations)} onClose={handleCloseAllMenus} sx={{ mt: 1 }}>
              {operationItems.map((item) => (
                <MenuItem key={item.label} onClick={() => goTo(item.path)}><ListItemIcon>{item.icon}</ListItemIcon><ListItemText>{item.label}</ListItemText></MenuItem>
              ))}
            </Menu>

            {/* Dropdown: Administración */}
            <Button onClick={(e) => handleOpenMenu(e, setAnchorElAdmin)} startIcon={<Settings fontSize="small" />} endIcon={<KeyboardArrowDown fontSize="small" />} sx={{ color: 'white', textTransform: 'none', fontWeight: isGroupActive(adminItems.map(i => i.path)) ? 700 : 500 }}>
              Administración
            </Button>
            <Menu anchorEl={anchorElAdmin} open={Boolean(anchorElAdmin)} onClose={handleCloseAllMenus} sx={{ mt: 1 }}>
              {adminItems.map((item) => (
                <MenuItem key={item.label} onClick={() => goTo(item.path)}><ListItemIcon>{item.icon}</ListItemIcon><ListItemText>{item.label}</ListItemText></MenuItem>
              ))}
            </Menu>

          </Toolbar>
        )}
      </Box>

      {/* 3. MENÚ MÓVIL (DRAWER) */}
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: 280, bgcolor: THEME.green, borderRight: 'none' } }}>
        {mobileMenuContent}
      </Drawer>

      {/* 4. CONTENIDO PRINCIPAL */}
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%', maxWidth: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;