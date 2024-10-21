import React, { useState, useEffect } from "react";
import "../Styles/Content.css";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from 'react-bootstrap/Spinner';
import Datos from "./Datos";
import FeedButton from "./FeedButton";
import RevivirButton from "./RevivirButton";

const Content = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [estado, setEstado] = useState('');
  const [imagen, setImagen] = useState('/Images/alien-normal-big.gif');

  useEffect(() => {
    const img = document.getElementById('alien');
    if (img) {
        img.classList.add('fade-out');
        setTimeout(() => {
            setImagen(getImagen(estado));
            img.classList.remove('fade-out');
        }, 200); // Duración de la transición
    }
  }, [estado]);

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
        return '/Images/alien-normal-big.gif';
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
          <Datos setEstado={setEstado}></Datos>
          <img id="alien" src={imagen} alt="App Icon" className="alien" />
          {estado !== 'Muerto' && <FeedButton></FeedButton>}
          {estado === 'Muerto' && <RevivirButton></RevivirButton>}
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
