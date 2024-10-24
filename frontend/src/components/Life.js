import React from 'react';
import '../Styles/Life.css'; 
import { useState, useEffect } from 'react';

const Life = ({vidaActual}) => {

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
