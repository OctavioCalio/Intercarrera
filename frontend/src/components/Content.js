// src/components/Content.js
import React from "react";
import "../Styles/Content.css";
import { useAuth0 } from "@auth0/auth0-react";
import Spinner from 'react-bootstrap/Spinner';
import Datos from "./Datos";
import FeedButton from "./FeedButton";

const Content = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <>
      {isLoading ? (
        <div className="spinner-container">
          <Spinner animation="border" role="status" style={{ color: 'yellow', width: '3rem', height: '3rem' }}> {/* Aumenta el tamaño */}
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : isAuthenticated ? (
        <div className="content">
          <Datos></Datos>
          <img src="/Images/alien-normal-big.gif" alt="App Icon" className="alien" />
          <FeedButton></FeedButton>
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
