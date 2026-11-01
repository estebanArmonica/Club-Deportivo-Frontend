import React from 'react';
import ErrorPage from './ErrorPage';

const Error500 = () => (
  <ErrorPage 
    code="500" 
    title="Error Interno del Servidor" 
    message="Algo salió mal de nuestro lado. Nuestro equipo técnico ya ha sido notificado." 
  />
);
export default Error500;