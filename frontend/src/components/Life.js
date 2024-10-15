import React from 'react';
import '../Styles/Life.css'; // Asegúrate de crear este archivo CSS
import { useState, useEffect } from 'react';







const Life = ({vidaActual}) => {
 /*
  const [estado, setEstado] = useState('normal');
  const [vidaActual, setVidaActual] = useState(5);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conexión WebSocket establecida desde el front - life');
    };



    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido desde el front:', data);
      setEstado(data.estado);

      if (data.estado === 'insolacion') {
        setVidaActual(2);
      } else if (data.estado === 'caliente') {
        setVidaActual(3);
      } else if (data.estado === 'caluroso') {
        setVidaActual(4); // Corregido a Math.max
      } else if (data.estado === 'ideal') {
        setVidaActual(5); // Incrementa hasta un máximo de 5
      } else if (data.estado === 'fresco') {
        setVidaActual(4); // Corregido a Math.max
      } else if (data.estado === 'frio') {
        setVidaActual(3); // Corregido a Math.max
      } else if (data.estado === 'hipotermia') {
        setVidaActual(2);
      } else if (data.estado === 'critico') {
        setVidaActual(1);
      }
    };

    // setVidaActual(prev => Math.min(prev + 1, 5));  <---- Para el botón, esta es la lógica
 

    ws.onclose = () =>{
      console.log('WebSocket cerrado (front)')
    }

    ws.onerror = () => {
      console.log('WebSocket error (front)')
    }

    return () => {
      ws.close();
    };
  }, []);

 */
  return (
    <div className="life-container">
      <h2 className="life-title">Vida</h2>
      <div className="heart-images">
        {[...Array(5)].map((_, index) => (
          <img
            key={index}
            src="/Images/pixel-heart.png"
            alt="Corazón"
            className={`heart-image ${index < vidaActual ? 'active' : 'inactive'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Life;
