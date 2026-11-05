import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './context/auth/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import Layout from './components/layouts/Layout';
import UserLayout from './components/layouts/UserLayout';

import Login from './pages/auth/Login';
import ProfilePage from './pages/profiles/ProfilePage';
import DashboardResolver from './pages/DashboardResolver';

// categorias y deportes
import DeportesPage from './features/deporte/pages/DeportesPage';
import CategoriasPage from './features/categoria/pages/CategoriasPage';

// gestión de alumnos, grupos, sucursales, canchas, clubes deportivos y padres
import AlumnosPage from './features/alumno/pages/AlumnosPage';
import GruposPage from './features/grupo/pages/GruposPage';
import SucursalesPage from './features/sucursal/pages/SucursalesPage';
import ClubesPage from './features/club/pages/ClubesPage';
import CanchasPage from './features/cancha/pages/CanchasPage';
import ApoderadosPage from './features/apoderado/pages/ApoderadosPage';

// administración de usuarios y pagos de inscripciones
import UsuariosPage from './features/user/pages/UsuariosPage';
import PagosPage from './features/pago/pages/PagosPage';

// clases, reservasm inscripciones, asistencias y encargados
import ClasesPage from './features/clase/pages/ClasesPage';
import ReservasPage from './features/reserva/pages/ReservasPage';
import InscripcionesPage from './features/inscripcion/pages/InscripcionesPage';
import AsistenciasPage from './features/asistencia/pages/AsistenciasPage';
import EncargadosPage from './features/encargadorSucursal/pages/EncargadosPage';
import ProfesoresPage from './features/profesorGrupo/pages/ProfesoresPage';

// errores personalizados 
import Error400 from './pages/errors/Error400';
import Error403 from './pages/errors/Error403';
import Error404 from './pages/errors/Error404';
import Error500 from './pages/errors/Error500';
import MaintenancePage from './pages/errors/MaintenancePage';
import Unauthorized from './pages/errors/Unathorized'; 

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f7fa' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none' } } },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } } },
  },
});

// Creamos un componente interno para poder usar useAuth()
function AppRoutes() {
  const { hasAnyRole } = useAuth(); // Asumiendo que tu AuthContext tiene esta función

  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        {/* Rutas de errores personalizados (Públicas) */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/400" element={<Error400 />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/500" element={<Error500 />} />
        <Route path="/mantenimiento" element={<MaintenancePage />} />
        
        {/* Rutas protegidas (decide qué Layout se utiliza según el rol) */}
        <Route path="/" element={
          <ProtectedRoute>
            {hasAnyRole(['admin']) ? <Layout /> : <UserLayout />}
          </ProtectedRoute>
        }>
          {/* Redirección por defecto */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Dashboard (El Resolver decide qué mostrar) */}
          <Route path="dashboard" element={<DashboardResolver />} />
          
          {/* Deportes y Categorías */}
          <Route path="deportes" element={<DeportesPage />} />
          <Route path="categorias" element={<CategoriasPage />} />
          
          {/* Alumnos, Grupos, Apoderados */}
          <Route path="alumnos" element={<AlumnosPage />} />
          <Route path="grupos" element={<GruposPage />} />
          <Route path="apoderados" element={<ApoderadosPage />} />
          
          {/* Sucursales, Clubes, Canchas */}
          <Route path="sucursales" element={<SucursalesPage />} />
          <Route path="clubes" element={<ClubesPage />} />
          <Route path="canchas" element={<CanchasPage />} />
          
          {/* Usuarios (Solo admin) y Pagos */}
          <Route path="usuarios" element={
            <ProtectedRoute roles={['admin']}>
              <UsuariosPage />
            </ProtectedRoute>
          } />
          <Route path="pagos" element={<PagosPage />} />
          
          {/* Clases y Reservas */}
          <Route path="clases" element={<ClasesPage />} />
          <Route path="reservas" element={<ReservasPage />} />
          
          {/* Inscripciones (Admin y Encargado) y Asistencias (Admin y Profesor) */}
          <Route path="inscripciones" element={
            <ProtectedRoute roles={['admin', 'encargado_sucursal']}>
              <InscripcionesPage />
            </ProtectedRoute>
          } />
          <Route path="asistencias" element={
            <ProtectedRoute roles={['admin', 'profesor_grupo']}>
              <AsistenciasPage />
            </ProtectedRoute>
          } />
          
          <Route path="encargados" element={<EncargadosPage />} />
          <Route path="profesores" element={<ProfesoresPage />} />

          {/* pefil */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Comodín único para rutas no encontradas */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;