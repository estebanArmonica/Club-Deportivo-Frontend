import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // Roles permitidos
  redirectTo?: string; // Ruta de redirección si no tiene permisos
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  roles = [], 
  redirectTo = '/unauthorized' 
}) => {
  const { isAuthenticated, loading, hasAnyRole, user } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica autenticación
  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary">
          Verificando autenticación...
        </Typography>
      </Box>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no hay roles especificados, permitir acceso
  if (roles.length === 0) {
    return <>{children}</>;
  }

  // Verificar si el usuario tiene los roles requeridos
  if (!hasAnyRole(roles)) {
    console.warn(`Usuario ${user?.email} no tiene permisos para acceder. Roles requeridos:`, roles);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;