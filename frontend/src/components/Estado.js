import React from 'react';
import '../Styles/Estado.css'; // Asegúrate de tener el archivo CSS

const Estado = ({ estado, vidaActual }) => {
  // Definir la clase del estado basado en el valor del estado o la vida actual
  const getEstadoClass = (estado, vidaActual) => {
    if (vidaActual === 0) {
      return 'estado-muerto'; // Si la vida es 0, estado es Muerto
    }
    switch (estado) {
      case 'Ideal':
        return 'estado-ideal';
      case 'Frio':
        return 'estado-frio';
      case 'Caluroso':
        return 'estado-caliente';
      default:
        return '';
    }
  };
  console.log(estado);

  // Definir el estado mostrado basado en la vida
  const mostrarEstado = vidaActual === 0 ? 'Muerto' : estado;

  return (
    <div className="estado-container">
      <h2 className="estado-title">Estado</h2>
      {/* Aplicar la clase según el estado o la vida */}
      <h3 className={`estado-value ${getEstadoClass(mostrarEstado, vidaActual)}`}>{mostrarEstado}</h3>
    </div>
  );
};

export default Estado;
