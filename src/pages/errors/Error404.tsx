import React from 'react';
import ErrorPage from './ErrorPage';

const Error404 = () => (
  <ErrorPage 
    code="404" 
    title="Página no encontrada" 
    message="Lo sentimos, la página que estás buscando no existe o ha sido movida." 
  />
);
export default Error404;