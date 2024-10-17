import React from 'react';
import '../Styles/Temperatura.css'; // Asegúrate de crear este archivo CSS
import { useState, useEffect } from 'react';

const Temperatura = ({temperatura}) => {
  
  return (
    <div className="temperatura-container">
      <h2 className="Temperatura-title">Temperatura</h2>
      <h3 className="Temperatura-value">{temperatura}º</h3>
    </div>
  );
};

export default Temperatura;
