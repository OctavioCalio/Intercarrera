import React from 'react';
import '../Styles/Estado.css'; // Asegúrate de crear este archivo CSS
import { useState, useEffect } from 'react';



const Estado = ({estado}) => {
 
  return (
    <div className="estado-container">
      <h2 className="estado-title">Estado</h2>
      <h3 className="estado-value">{estado}</h3>
    </div>
  );
};

export default Estado;
