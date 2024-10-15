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
      console.log('Mensaje recibido desde el front:', data);


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
      }};

    


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

  const handleClick = () => {
    setVidaActual(prevVida => {
      const nuevaVida = Math.min(prevVida + 1, 5);

      if (nuevaVida === 5) {
        setEstado('Ideal');
        setTemperatura(33); // Temp ideal
      }
      else if (nuevaVida === 4 && temperatura >= 35) {
        setEstado('Caluroso');
        setTemperatura(35);
      }
      else if (nuevaVida === 3 && temperatura >= 37) {
        setEstado('Caliente');
        setTemperatura(37);
      }
      else if (nuevaVida === 2 && temperatura >= 39) {
        setEstado('Insolación');
        setTemperatura(39);
      }



      else if (nuevaVida === 4 && temperatura >= 31) {
        setEstado('Fresco');
        setTemperatura(31);
      }
      else if (nuevaVida === 3 && temperatura >= 29) {
        setEstado('Frío');
        setTemperatura(29);
      }
      else if (nuevaVida === 2 && temperatura >= 27) {
        setEstado('Hipotermia');
        setTemperatura(27);
      }
      else if ( nuevaVida === 1) {
        setEstado('Crítico');

      }
      return nuevaVida; // Actualizamos la vida
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
