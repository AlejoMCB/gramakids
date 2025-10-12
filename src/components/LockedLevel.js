import React from 'react';

const LockedLevel = ({ level, onUpgradeClick }) => {
  return (
    <div className="level-card locked-level">
      <div className="lock-overlay">
        <div className="lock-icon">🔒</div>
        <h4>{level.title}</h4>
        <p>Disponible en versión Premium</p>
        <button 
          onClick={onUpgradeClick}
          className="premium-button"
          style={{ fontSize: '0.9em', padding: '10px 20px' }}
        >
          Desbloquear
        </button>
      </div>
      
      <h3 style={{ opacity: 0.5 }}>{level.title}</h3>
      <p style={{ opacity: 0.5 }}>{level.description}</p>
      <div style={{ 
        background: '#ddd', 
        color: '#999', 
        padding: '10px 20px', 
        borderRadius: '20px',
        fontSize: '0.9em'
      }}>
        Premium requerido
      </div>
    </div>
  );
};

export default LockedLevel;