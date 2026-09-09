import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Toolbar,
  ListSubheader,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Sports as SportsIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  PersonAdd as PersonAddIcon,
  Event as EventIcon,
  Group as GroupIcon,
  LocationCity as LocationCityIcon,
  School as SchoolIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/auth/AuthContext';

interface SidebarProps {
  onClose?: () => void;
}

interface MenuItemType {
  text: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

interface MenuSection {
  section: string;
  items: MenuItemType[];
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { getUserRoles } = useAuth();
  const roles = getUserRoles();

  const menuItems: MenuSection[] = [
    { 
      section: 'General',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['admin', 'encargado_sucursal', 'profesor_grupo', 'alumno', 'apoderado'] },
      ]
    },
    {
      section: 'Gestión',
      items: [
        { text: 'Deportes', icon: <SportsIcon />, path: '/deportes', roles: ['admin', 'encargado_sucursal', 'profesor_grupo'] },
        { text: 'Alumnos', icon: <PeopleIcon />, path: '/alumnos', roles: ['admin', 'encargado_sucursal', 'profesor_grupo', 'apoderado'] },
        { text: 'Grupos', icon: <GroupIcon />, path: '/grupos', roles: ['admin', 'encargado_sucursal', 'profesor_grupo'] },
        { text: 'Horarios', icon: <ScheduleIcon />, path: '/horarios', roles: ['admin', 'encargado_sucursal', 'profesor_grupo', 'alumno', 'apoderado'] },
        { text: 'Clases', icon: <EventIcon />, path: '/clases', roles: ['admin', 'encargado_sucursal', 'profesor_grupo', 'alumno'] },
      ]
    },
    {
      section: 'Finanzas',
      items: [
        { text: 'Pagos', icon: <PaymentIcon />, path: '/pagos', roles: ['admin', 'encargado_sucursal', 'apoderado'] },
      ]
    },
    {
      section: 'Administración',
      items: [
        { text: 'Inscripciones', icon: <PersonAddIcon />, path: '/inscripciones', roles: ['admin', 'encargado_sucursal'] },
        { text: 'Sucursales', icon: <LocationCityIcon />, path: '/sucursales', roles: ['admin'] },
        { text: 'Usuarios', icon: <SchoolIcon />, path: '/usuarios', roles: ['admin'] },
        { text: 'Configuración', icon: <SettingsIcon />, path: '/configuracion', roles: ['admin'] },
      ]
    },
  ];

  const filterItemsByRole = (items: MenuItemType[]) => {
    return items.filter(item => 
      item.roles.some(role => roles.includes(role))
    );
  };

  const filteredSections = menuItems
    .map(section => ({
      ...section,
      items: filterItemsByRole(section.items)
    }))
    .filter(section => section.items.length > 0);

  const handleItemClick = () => {
    if (onClose) onClose();
  };

  return (
    <Box>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Club Deportivo
        </Typography>
      </Toolbar>
      <Divider />
      
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {roles.length > 0 ? 'Usuario autenticado' : 'Cargando...'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
          {roles.map((role) => (
            <Chip
              key={role}
              label={role.replace('_', ' ')}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ fontSize: '0.6rem', height: 20 }}
            />
          ))}
        </Box>
      </Box>
      <Divider />

      {filteredSections.map((section) => (
        <List
          key={section.section}
          subheader={
            <ListSubheader component="div" sx={{ textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 600 }}>
              {section.section}
            </ListSubheader>
          }
        >
          {section.items.map((item) => (
            <ListItem 
              key={item.text}
              disablePadding
              sx={{ 
                display: 'block',
                '& .active': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRight: '3px solid #1976d2',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                  '& .MuiListItemText-root .MuiTypography-root': {
                    color: 'primary.main',
                    fontWeight: 600,
                  },
                },
              }}
            >
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={handleItemClick}
                sx={{
                  borderRadius: '0 8px 8px 0',
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontSize: '0.875rem',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      ))}
    </Box>
  );
};

export default Sidebar;