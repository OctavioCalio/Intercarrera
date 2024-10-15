import React from 'react';
import '../Styles/Temperatura.css'; // Asegúrate de crear este archivo CSS
import { useState, useEffect } from 'react';

const Temperatura = ({temperatura}) => {
  /*
  const [temperatura, setTemperatura] = useState('33');
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida desde el front - Temperatura');
    };



    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido desde el front - temperatura:', data);
      setTemperatura(data.temperatura);

      
    };

    ws.onclose = () =>{
      console.log('WebSocket cerrado (front - temperatura)')
    }

    ws.onerror = () => {
      console.log('WebSocket error (front - temperatura)')
    }

    return () => {
      ws.close();
    };
  }, []);

 */
  return (
    <div className="temperatura-container">
      <h2 className="Temperatura-title">Temperatura</h2>
      <h3 className="Temperatura-value">{temperatura}º</h3>
    </div>
  );
};

export default Temperatura;
