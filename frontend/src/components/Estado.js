import React from 'react';
import '../Styles/Estado.css'; // Asegúrate de crear este archivo CSS
import { useState, useEffect } from 'react';



const Estado = ({estado}) => {
  /*
  const [estado, setEstado] = useState('Ideal');
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida desde el front - Estado');
    };



    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido desde el front:', data);
      setEstado(data.estado);

      if (data.estado === 'insolacion') {
        setEstado('Insolación');
      } else if (data.estado === 'caliente') {
        setEstado('Caliente');;
      } else if (data.estado === 'caluroso') {
        setEstado('Caluroso');
      } else if (data.estado === 'ideal') {
        setEstado('Ideal');;
      } else if (data.estado === 'fresco') {
        setEstado('Fresco');
      } else if (data.estado === 'frio') {
        setEstado('Frío');
      } else if (data.estado === 'hipotermia') {
        setEstado('Hipotermia');
      } else if (data.estado === 'critico') {
        setEstado('Crítico');
      }
    };

    ws.onclose = () =>{
      console.log('WebSocket cerrado (front - Estado)')
    }

    ws.onerror = () => {
      console.log('WebSocket error (front - Estado)')
    }

    return () => {
      ws.close();
    };
  }, []);
   */

  return (
    <div className="estado-container">
      <h2 className="estado-title">Estado</h2>
      <h3 className="estado-value">{estado}</h3>
    </div>
  );
};

export default Estado;
