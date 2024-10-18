import React, { useState } from 'react';
import '../Styles/RevivirButton.css'; // Asegúrate de crear este archivo CSs

const RevivirButton = () => {
  const [mensaje, setMensaje] = useState(''); // Estado para manejar el mensaje de respuesta

  const handleRevivir = async () => {
    try {
      const response = await fetch('http://localhost:3001/revivir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al intentar revivir');
      }

      const data = await response.json();
      setMensaje(data.message); // Actualiza el mensaje con la respuesta del servidor
    } catch (error) {
      console.error('Error:', error);
      setMensaje('Error al intentar revivir.'); // Mensaje de error
    }
  };

  return (
    <div>
      <button className="btn btn-primary-revivir" onClick={handleRevivir}>
        Revivir
      </button>
      {/* {mensaje && <p className="mensaje">{mensaje}</p>} Muestra el mensaje si existe */}
    </div>
  );
};

export default RevivirButton;
