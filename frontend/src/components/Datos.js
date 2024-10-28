import '../Styles/Datos.css';
import Life from "./Life";
import Temperatura from "./Temperatura";
import Estado from "./Estado";
import { useState, useEffect } from 'react';

const Datos = ({ setEstado, setEstadoLuz }) => {
  const [estado, actualizarEstado] = useState('Esperando');
  const [temperatura, setTemperatura] = useState('...');
  const [vidaActual, setVidaActual] = useState();
  const [estadoLuz, actualizarEstadoLuz] = useState('Desconocido');

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida desde el front - Datos');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);

      setTemperatura(data.temperatura);
      actualizarEstado(data.estado);
      setVidaActual(data.vida);

      const luzEstado = data.despierto ? 'Luz encendida' : 'Luz apagada';
      actualizarEstadoLuz(luzEstado);
      setEstadoLuz(luzEstado); // Enviamos el estado de la luz a Content

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
  }, [setEstado, setEstadoLuz]);

  return (
    <div className="Datos">
      <Life vidaActual={vidaActual}></Life>
      <Temperatura temperatura={temperatura}></Temperatura>
      <Estado estado={estado} vidaActual={vidaActual}></Estado>
    </div>
  );
};

export default Datos;
