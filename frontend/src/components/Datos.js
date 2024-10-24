import '../Styles/Datos.css';
import Life from "./Life";
import Temperatura from "./Temperatura";
import Estado from "./Estado";
import { useState, useEffect } from 'react';

const Datos = ({ setEstado }) => {
  const [estado, actualizarEstado] = useState('Esperando');
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
      actualizarEstado(data.estado);
      setVidaActual(data.vida);

      console.log('Estado actualizado:', data.estado);
      console.log('Vida recibida desde el front: ' + data.vida);

      // Actualizamos el estado que controla la imagen en Content
      setEstado(data.estado);
    };

    ws.onclose = () => {
      console.log('WebSocket cerrado (front - Datos)');
    };

    ws.onerror = () => {
      console.log('WebSocket error (front - Datos)');
    };

    return () => {
      ws.close();
    };
  }, [setEstado]);

  return (
    <div className="Datos">
      <Life vidaActual={vidaActual}></Life>
      <Temperatura temperatura={temperatura}></Temperatura>
      <Estado estado={estado} vidaActual={vidaActual}></Estado>
    </div>
  );
};

export default Datos;
