import '../Styles/Datos.css';
import Life from "./Life";
import Temperatura from "./Temperatura";
import Estado from "./Estado";
import FeedButton from './FeedButton';
import { useState, useEffect } from 'react';

const Datos = () => {

  const [estado, setEstado] = useState('Ideal');
  const [temperatura, setTemperatura] = useState('33');
  const [vidaActual, setVidaActual] = useState(5);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida desde el front - Datos');
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido:', data);


      //actualizar el estdo y la temperatura
      setTemperatura(data.temperatura);
      setEstado(data.estado);
      console.log('Estado actualizado:', estado);

      if (data.estado === 'Insolación') {
        setVidaActual(2);
      } else if (data.estado === 'Caliente') {
        setVidaActual(3);
      } else if (data.estado === 'Caluroso') {
        setVidaActual(4); // Corregido a Math.max
      } else if (data.estado === 'Ideal') {
        setVidaActual(5); // Incrementa hasta un máximo de 5
      } else if (data.estado === 'Fresco') {
        setVidaActual(4); // Corregido a Math.max
      } else if (data.estado === 'Frío') {
        setVidaActual(3); // Corregido a Math.max
      } else if (data.estado === 'Hipotermia') {
        setVidaActual(2);
      } else if (data.estado === 'Crítico') {
        setVidaActual(1);
      }
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
  }, [estado, temperatura, vidaActual]);

  const handleClick = () => {
    setVidaActual(prevVida => {
      //vida máxima 5

      const nuevaVida = Math.min(prevVida + 1, 5);
      let nuevaTemperatura = temperatura;


      if (nuevaTemperatura > 34) {
        nuevaTemperatura -= 1;
      } else if (nuevaTemperatura < 32) {
        nuevaTemperatura += 1;
      }

      setTemperatura(nuevaTemperatura);


      if (nuevaTemperatura >= 32 && nuevaTemperatura <= 34) {
        setEstado('Ideal');
        setVidaActual(5); // Vida máxima
      } else if (nuevaTemperatura >= 30 && nuevaTemperatura < 32) {
        setEstado('Fresco');
        setVidaActual(4);
      } else if (nuevaTemperatura >= 28 && nuevaTemperatura < 30) {
        setEstado('Frío');
        setVidaActual(3);
      } else if (nuevaTemperatura >= 26 && nuevaTemperatura < 28) {
        setEstado('Hipotermia');
        setVidaActual(2);
      } else if (nuevaTemperatura >= 24 && nuevaTemperatura < 26) {
        setEstado('Crítico');
        setVidaActual(1);
      } else if (nuevaTemperatura > 34 && nuevaTemperatura <= 36) {
        setEstado('Caluroso');
        setVidaActual(4);
      } else if (nuevaTemperatura > 36 && nuevaTemperatura <= 38) {
        setEstado('Caliente');
        setVidaActual(3);
      } else if (nuevaTemperatura > 38 && nuevaTemperatura <= 40) {
        setEstado('Insolación');
        setVidaActual(2);
      } else if (nuevaTemperatura > 40) {
        setEstado('Crítico');
        setVidaActual(1);
      }

      return nuevaVida;
    });
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
