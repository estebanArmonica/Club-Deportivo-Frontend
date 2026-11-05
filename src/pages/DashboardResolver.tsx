import React from 'react';
import { useAuth } from '../context/auth/AuthContext';
import DashboardAdmin from './admin/Dashboard';
import DashboardProfesor from './profesor/DashboardProfesor';
import DashboardEncargado from './encargado/DashboardEncargado';
import DashboardApoderado from './apoderado/DashboardApoderado';
import DashboardAlumno from './alumno/DashboardAlumno';

const DashboardResolver = () => {
    const{ hasAnyRole } = useAuth();

    /** 
     * al autenticar y saber el rol del usuario utilizamos este resolver para que este método
     * redireccione al dashboard correspondiente
    */ 
    if (hasAnyRole(['admin'])) return <DashboardAdmin />;
    if (hasAnyRole(['encargado_sucursal'])) return <DashboardEncargado />;
    if (hasAnyRole(['profesor_grupo'])) return <DashboardProfesor />;
    if (hasAnyRole(['apoderado'])) return <DashboardApoderado />;
    if (hasAnyRole(['alumno'])) return <DashboardAlumno />;

    return <div>No tienes un rol asignado.</div>
};

export default DashboardResolver;