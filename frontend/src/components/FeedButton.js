import React, { useState } from 'react';
import '../Styles/FeedButton.css';

const FeedButton = ({ onClick, disabled }) => {
  const [mensaje, setMensaje] = useState(''); // Estado para manejar el mensaje

  const handleClick = async () => {
    const vidaAIncrementar = 1; // Define cuánta vida quieres añadir

    try {
      const response = await fetch('https://intercarrera-back.onrender.com/curar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vida: vidaAIncrementar }),
      });

      if (!response.ok) {
        throw new Error('Error al incrementar la vida');
      }

      const data = await response.json();
      setMensaje(data.message); // Actualiza el mensaje con la respuesta del servidor
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al incrementar la vida.'); // Mensaje de error
    }
  };

  return (
    <div>
      <button 
        className="btn btn-primary-curar" 
        onClick={handleClick} 
        disabled={disabled} // Deshabilitar el botón según la prop
      >
        Curar
      </button>
      {/* {mensaje && <p className="mensaje">{mensaje}</p>} Muestra el mensaje si existe */}
    </div>
  );
};

export default FeedButton;