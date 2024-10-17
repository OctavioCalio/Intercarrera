//frio ideal caluroso y muerto


import '../Styles/Datos.css';
import Life from "./Life";
import Temperatura from "./Temperatura";
import Estado from "./Estado";
import FeedButton from './FeedButton';
import { useState, useEffect } from 'react';


const Datos = () => {

  const [estado, setEstado] = useState('Esperando...');
  const [temperatura, setTemperatura] = useState('...');
  const [vidaActual, setVidaActual] = useState();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida desde el front - Datos');
    };
    ws.onmessage = (event) => {

      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);

      setTemperatura(data.temperatura);
      setEstado(data.estado);
      setVidaActual(data.vida);
      
      
      console.log('Estado actualizado:', estado);
      console.log('Vida recibida desde el front: ' + data.vida)
      
       /*
      if (data.estado === 'Caluroso') {
        setVidaActual(4);
      } else if (data.estado === 'Ideal') {
        setVidaActual(5);
      } else if (data.estado === 'Frío') {
        setVidaActual(4);
      } else if (data.estado === 'Muerto') {
        setVidaActual(0);
      }
      */
    };

    ws.onclose = () => {
      console.log('WebSocket cerrado (front - Datos)')
    }
    ws.onerror = () => {
      console.log('WebSocket error (front - Datos)')
    }
    return () => {
      ws.close();
    };
  }, []);

  //Botón:

  const handleClick = () => {
    setVidaActual(prevVida => Math.min(prevVida + 1, 5)); // 5 como máximo
  };

  return (
    <div className="Datos">
      <Life vidaActual={vidaActual}></Life>
      <Temperatura temperatura={temperatura}></Temperatura>
      <Estado estado={estado}></Estado>
      <FeedButton handleClick={handleClick}></FeedButton>
    </div>
  );
};

export default Datos;
