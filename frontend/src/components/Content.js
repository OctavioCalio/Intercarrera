import React, { useState, useEffect, useRef } from "react";
import "../Styles/Content.css";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from 'react-bootstrap/Spinner';
import Datos from "./Datos";
import FeedButton from "./FeedButton";
import RevivirButton from "./RevivirButton";

const Content = ({ setEstadoAlien }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [estado, setEstado] = useState('');
  const [imagen, setImagen] = useState('/Images/alien-normal-big.gif');
  const [estadoLuz, setEstadoLuz] = useState('Desconocido');
  const [imagenLuz, setImagenLuz] = useState('/Images/sol-pixel.png'); // Asigna un valor inicial aquí
  const luzImgRef = useRef(null); // Referencia para la imagen de luz

  // Función para obtener la imagen de luz según el estadoLuz
  const getImagenLuz = () => {
    return estadoLuz === 'Luz encendida' ? '/Images/sol-pixel.png' : '/Images/luna-pixel.png';
  };

  // Función para obtener la imagen del alien según su estado
  const getImagen = (estado) => {
    switch (estado) {
      case 'Muerto':
        return '/Images/alien-muerto-big.gif';
      case 'Frio':
        return '/Images/alien-frio-big.gif';
      case 'Caluroso':
        return '/Images/alien-calor-big.gif';
      case 'Ideal':
        return '/Images/alien-normal-big.gif';
      default:
        return '/Images/alien-normal-big.gif';
    }
  };

  // Efecto para manejar cambios en el estado del alien
  useEffect(() => {
    setImagen(getImagen(estado));
    setEstadoAlien(estado);
  }, [estado, setEstadoAlien]);

  // Efecto para manejar cambios en estadoLuz
  useEffect(() => {
    if (luzImgRef.current) {
      luzImgRef.current.classList.add('fade-out'); // Inicia el fade out

      const fadeOutDuration = 500; // Duración del fade out

      // Cambia la imagen después del fade out
      const timer = setTimeout(() => {
        setImagenLuz(getImagenLuz()); // Cambia el estado de la imagen de luz
        luzImgRef.current.classList.remove('fade-out'); // Elimina la clase para reiniciar el efecto
      }, fadeOutDuration);

      // Limpia el temporizador si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [estadoLuz]); // Este efecto solo se activará cuando estadoLuz cambie

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
          <Datos setEstado={setEstado} setEstadoLuz={setEstadoLuz} />
          <div className="alien-container">
            <img 
              ref={luzImgRef} // Usar la referencia para la imagen de luz
              src={imagenLuz} // Usa el estado para la imagen de luz
              alt="Estado de Luz" 
              className={`estado-luz-icon ${estadoLuz === 'Luz apagada' ? 'dimmed' : ''}`} 
            />
            <img 
              id="alien" 
              src={imagen} 
              alt="Alien" 
              className={`alien ${estadoLuz === 'Luz apagada' ? 'dimmed' : ''}`} 
            />
          </div>
          {estado !== 'Muerto' && <FeedButton />}
          {estado === 'Muerto' && <RevivirButton />}
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
