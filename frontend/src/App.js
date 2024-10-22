import React, { useState } from 'react';
import './App.css';
import Nambar from './components/Nambar';
import Content from './components/Content';

function App() {
  const [estadoAlien, setEstadoAlien] = useState(''); // Estado para controlar la clase del content-box

  // Función para obtener la clase CSS según el estado del alien
  const getClassName = (estado) => {
    switch (estado) {
      case 'Muerto':
        return 'content-box muerto';
      case 'Frío':
        return 'content-box frio';
      case 'Caluroso':
        return 'content-box caluroso';
      case 'Ideal':
        return 'content-box ideal';
      default:
        return 'content-box'; // Clase por defecto
    }
  };

  return (
    <div className="App">
      <Nambar />

      {/* Se cambia la clase del content-box según el estado */}
      <div className={getClassName(estadoAlien)}>
        <Content setEstadoAlien={setEstadoAlien} />
      </div>
    </div>
  );
}

export default App;
