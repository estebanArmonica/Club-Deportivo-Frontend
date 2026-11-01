import React from 'react';
import ErrorPage from './ErrorPage';

const Error403 = () => (
  <ErrorPage 
    code="403" 
    title="Acceso Denegado" 
    message="No tienes los permisos necesarios para acceder a esta página o recurso." 
  />
);
export default Error403;