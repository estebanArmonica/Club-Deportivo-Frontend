import React from 'react';
import ErrorPage from './ErrorPage';

const Error400 = () => (
  <ErrorPage 
    code="400" 
    title="Solicitud Incorrecta" 
    message="La solicitud que enviaste al servidor tiene un formato incorrecto o le faltan datos obligatorios." 
  />
);
export default Error400;