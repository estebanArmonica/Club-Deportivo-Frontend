import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/auth/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';
import Layout from './components/layouts/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/admin/Dashboard';
import Unauthorized from './pages/errors/Unathorized';

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
import UsuariosPage from './features/usuario/pages/UsuariosPage';
import PagosPage from './features/pago/pages/PagosPage';

// clases, reservasm inscripciones, asistencias y encargados
import ClasesPage from './features/clase/pages/ClasesPage';
import ReservasPage from './features/reserva/pages/ReservasPage';
import InscripcionesPage from './features/inscripcion/pages/InscripcionesPage';
import AsistenciasPage from './features/asistencia/pages/AsistenciasPage';
import EncargadosPage from './features/encargadoSucursal/pages/EncargadosPage';
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            {/* rutas de errores personalizados */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/400" element={<Error400 />} />
            <Route path="/403" element={<Error403 />} />
            <Route path="/404" element={<Error404 />} />
            <Route path="/500" element={<Error500 />} />
            <Route path="/mantenimiento" element={<MaintenancePage />} />
            
            {/* Rutas protegidas dentro del Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              {/* Redirección por defecto */}
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Dashboard */}
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* 🏟️ Deportes y Categorías */}
              <Route path="deportes" element={<DeportesPage />} />
              <Route path="categorias" element={<CategoriasPage />} />
              
              {/* 👥 Alumnos, Grupos, Apoderados */}
              <Route path="alumnos" element={<AlumnosPage />} />
              <Route path="grupos" element={<GruposPage />} />
              <Route path="apoderados" element={<ApoderadosPage />} />
              
              {/* 🏢 Sucursales, Clubes, Canchas */}
              <Route path="sucursales" element={<SucursalesPage />} />
              <Route path="clubes" element={<ClubesPage />} />
              <Route path="canchas" element={<CanchasPage />} />
              
              {/* 💼 Usuarios y Pagos */}
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="pagos" element={<PagosPage />} />
              
              {/* 📅 Clases y Reservas */}
              <Route path="clases" element={<ClasesPage />} />
              <Route path="reservas" element={<ReservasPage />} />
              
              {/* 📝 Inscripciones, Asistencias y Asignaciones */}
              <Route path="inscripciones" element={<InscripcionesPage />} />
              <Route path="asistencias" element={<AsistenciasPage />} />
              <Route path="encargados" element={<EncargadosPage />} />
              <Route path="profesores" element={<ProfesoresPage />} />
            </Route>

            {/* Cualquier ruta no encontrada, vuelve al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />

            {/* por defecto si no encuentra la ruta */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;