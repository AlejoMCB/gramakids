import React, { useState } from 'react';
import { getAllLevels, isLevelFree } from '../data/levelData';
import LockedLevel from '../components/LockedLevel';
import PremiumButton from '../components/PremiumButton';
import GamePage from './GamePage';

const MenuPage = ({ user, userData, userProgress, onPremiumUpdate, onProgressUpdate }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  const levels = getAllLevels();
  const isPremium = userData?.premium || false;

  const handleLevelSelect = (levelNumber) => {
    const level = levels[levelNumber];
    
    if (!level.isFree && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    
    setSelectedLevel(levelNumber);
  };

  const handleBackToMenu = () => {
    setSelectedLevel(null);
  };

  const handleUpgradeClick = () => {
    setShowPremiumModal(true);
  };

  const handlePremiumModalClose = () => {
    setShowPremiumModal(false);
  };

  if (selectedLevel) {
    return (
      <GamePage
        levelNumber={selectedLevel}
        user={user}
        userProgress={userProgress}
        onBack={handleBackToMenu}
        onProgressUpdate={onProgressUpdate}
      />
    );
  }

  return (
    <div className="game-area">
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2>Selecciona un Nivel</h2>
        <p>
          {isPremium 
            ? '¡Tienes acceso completo! 🎉' 
            : `Niveles gratuitos disponibles: ${Object.values(levels).filter(l => l.isFree).length}`
          }
        </p>
      </div>

      {!isPremium && (
        <div style={{ marginBottom: '30px' }}>
          <PremiumButton 
            user={user}
            onPremiumUpdate={onPremiumUpdate}
          />
        </div>
      )}

      <div className="level-grid">
        {Object.entries(levels).map(([levelNumber, level]) => {
          const isCompleted = userProgress?.completedLevels?.includes(parseInt(levelNumber));
          const isAccessible = level.isFree || isPremium;
          
          if (!isAccessible) {
            return (
              <LockedLevel
                key={levelNumber}
                level={level}
                onUpgradeClick={handleUpgradeClick}
              />
            );
          }

          return (
            <div
              key={levelNumber}
              className="level-card"
              onClick={() => handleLevelSelect(levelNumber)}
              style={{
                cursor: 'pointer',
                border: isCompleted ? '3px solid #4CAF50' : '1px solid #ddd'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{level.title}</h3>
                {isCompleted && <span style={{ fontSize: '1.5em' }}>✅</span>}
                {level.isFree && <span style={{ 
                  background: '#4CAF50', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '10px', 
                  fontSize: '0.8em' 
                }}>GRATIS</span>}
              </div>
              
              <p>{level.description}</p>
              
              <div style={{ marginTop: '15px' }}>
                <button className="btn-primary" style={{ fontSize: '0.9em', padding: '10px 20px' }}>
                  {isCompleted ? 'Jugar de Nuevo' : 'Empezar'}
                </button>
              </div>
              
              {level.exercises && (
                <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#666' }}>
                  {level.exercises.length} ejercicios
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Premium */}
      {showPremiumModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <button 
                onClick={handlePremiumModalClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5em',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>
            
            <PremiumButton 
              user={user}
              onPremiumUpdate={(isPremium) => {
                onPremiumUpdate(isPremium);
                setShowPremiumModal(false);
              }}
            />
          </div>
        </div>
      )}

      <div className="help-button" onClick={() => alert('💡 Completa los niveles gratuitos para desbloquear más contenido premium!')}>
        ❓
      </div>
    </div>
  );
};

export default MenuPage;