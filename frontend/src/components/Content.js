import React, { useState } from "react";
import "../Styles/Content.css";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from 'react-bootstrap/Spinner';
import Datos from "./Datos";
import FeedButton from "./FeedButton";

const Content = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [estado, setEstado] = useState(''); // Añadimos un estado para controlar la imagen
  
  // Lógica para seleccionar la imagen basada en el estado
  const getImagen = (estado) => {
    switch (estado) {
      case 'Muerto':
        return '/Images/alien-muerto-big.gif';
      case 'Frío':
        return '/Images/alien-frio-big.gif';
      case 'Caluroso':
        return '/Images/alien-calor-big.gif';
      case 'Ideal':
        return '/Images/alien-normal-big.gif';
      default:
        return '/Images/alien-normal-big.gif'; // Imagen por defecto
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status" style={{ color: 'yellow', width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : isAuthenticated ? (
        <div className="content">
          {/* Pasamos el setEstado a Datos para que actualice el estado de la imagen */}
          <Datos setEstado={setEstado}></Datos> 
          {/* Renderizar la imagen dependiendo del estado */}
          <img src={getImagen(estado)} alt="App Icon" className="alien" />
          {/* Deshabilitar el botón si el estado es 'Muerto' */}
          <FeedButton disabled={estado === 'Muerto'}></FeedButton>
        </div>
      ) : (
        <div className="content">
          <img src="/Images/pixel-life.png" alt="Title" className="title" />
          <img src="/Images/alien-normal-big.gif" alt="App Icon" className="alien" />
          <p className="login-message">Inicia Sesión</p>
        </div>
      )}
    </>
  );
};

export default Content;
