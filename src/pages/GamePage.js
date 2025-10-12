import React, { useState, useEffect } from 'react';
import { getAllLevels } from '../data/levelData';
import { UserProgressService } from '../services/userProgressService';

const GamePage = ({ levelNumber, user, userProgress, onBack, onProgressUpdate }) => {
  const [gameState, setGameState] = useState({
    currentExercise: 0,
    score: 0,
    exercises: [],
    currentWordIndex: 0
  });
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  const levels = getAllLevels();
  const currentLevel = levels[levelNumber];

  useEffect(() => {
    if (currentLevel) {
      setGameState({
        currentExercise: 0,
        score: 0,
        exercises: [...currentLevel.exercises],
        currentWordIndex: 0
      });
    }
  }, [levelNumber, currentLevel]);

  const getCurrentExercise = () => {
    return gameState.exercises[gameState.currentExercise];
  };

  const getCurrentWord = () => {
    const exercise = getCurrentExercise();
    return exercise?.words[gameState.currentWordIndex];
  };

  const checkAnswer = async (selectedAnswer) => {
    const exercise = getCurrentExercise();
    const currentWord = getCurrentWord();
    const correctAnswer = exercise.answers[currentWord];
    
    setShowResult(true);
    
    if (selectedAnswer === correctAnswer) {
      setResult('correct');
      setGameState(prev => ({ ...prev, score: prev.score + 1 }));
      
      // Actualizar progreso y estrellas
      const newStars = (userProgress?.stars || 0) + 10;
      const updatedProgress = {
        ...userProgress,
        stars: newStars,
        currentLevel: Math.max(userProgress?.currentLevel || 1, parseInt(levelNumber))
      };
      
      await UserProgressService.saveProgress(user?.uid, updatedProgress);
      onProgressUpdate(updatedProgress);
      
    } else {
      setResult('incorrect');
    }
    
    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    setShowResult(false);
    setResult('');
    
    const exercise = getCurrentExercise();
    
    // Siguiente palabra del ejercicio actual
    if (gameState.currentWordIndex < exercise.words.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex + 1
      }));
    } else {
      // Siguiente ejercicio
      if (gameState.currentExercise < gameState.exercises.length - 1) {
        setGameState(prev => ({
          ...prev,
          currentExercise: prev.currentExercise + 1,
          currentWordIndex: 0
        }));
      } else {
        // Nivel completado
        completeLevelAsync();
      }
    }
  };

  const completeLevelAsync = async () => {
    const starsEarned = Math.floor((gameState.score / getTotalQuestions()) * 3);
    const newStars = (userProgress?.stars || 0) + (starsEarned * 10);
    const completedLevels = [...(userProgress?.completedLevels || [])];
    
    if (!completedLevels.includes(parseInt(levelNumber))) {
      completedLevels.push(parseInt(levelNumber));
    }
    
    const updatedProgress = {
      ...userProgress,
      stars: newStars,
      completedLevels,
      currentLevel: Math.max(userProgress?.currentLevel || 1, parseInt(levelNumber) + 1)
    };
    
    await UserProgressService.saveProgress(user?.uid, updatedProgress);
    onProgressUpdate(updatedProgress);
    
    setLevelComplete(true);
  };

  const getTotalQuestions = () => {
    return gameState.exercises.reduce((total, exercise) => total + exercise.words.length, 0);
  };

  const getProgress = () => {
    const totalQuestions = getTotalQuestions();
    const currentQuestion = gameState.exercises
      .slice(0, gameState.currentExercise)
      .reduce((total, exercise) => total + exercise.words.length, 0) + gameState.currentWordIndex + 1;
    
    return Math.floor((currentQuestion / totalQuestions) * 100);
  };

  const getOptionsForLevel = () => {
    const level = parseInt(levelNumber);
    
    if (level === 1) {
      return ['sustantivo', 'adjetivo', 'verbo'];
    } else if (level === 2) {
      return ['propio', 'impropio'];
    } else if (level === 3) {
      return ['presente', 'pasado', 'futuro'];
    } else if (level === 4) {
      return ['definido', 'indefinido'];
    } else if (level === 5) {
      return ['masculino singular', 'femenino singular', 'masculino plural', 'femenino plural'];
    } else {
      return ['sinónimo', 'antónimo', 'ninguna relación'];
    }
  };

  const getHint = (correctAnswer) => {
    const hints = {
      sustantivo: "Los sustantivos son nombres de personas, animales, cosas o lugares.",
      adjetivo: "Los adjetivos describen cómo son las cosas (color, tamaño, forma).",
      verbo: "Los verbos son acciones que realizamos (correr, saltar, comer).",
      propio: "Los sustantivos propios son nombres específicos que se escriben con mayúscula.",
      impropio: "Los sustantivos impropios son nombres comunes que no se escriben con mayúscula.",
      presente: "El presente indica que la acción ocurre ahora.",
      pasado: "El pasado indica que la acción ya ocurrió.",
      futuro: "El futuro indica que la acción ocurrirá después.",
      definido: "Los artículos definidos (el, la, los, las) se refieren a algo específico.",
      indefinido: "Los artículos indefinidos (un, una, unos, unas) se refieren a algo general."
    };
    
    return hints[correctAnswer] || "¡Sigue practicando!";
  };

  if (!currentLevel) {
    return (
      <div className="game-area">
        <div style={{ textAlign: 'center' }}>
          <h2>Nivel no encontrado</h2>
          <button onClick={onBack} className="btn-primary">
            Volver al Menú
          </button>
        </div>
      </div>
    );
  }

  if (levelComplete) {
    const starsEarned = Math.floor((gameState.score / getTotalQuestions()) * 3);
    
    return (
      <div className="game-area">
        <div className="level-complete">
          <h2>¡Nivel Completado!</h2>
          <div className="stars-earned">{'⭐'.repeat(starsEarned)}</div>
          <p>Puntuación: {gameState.score}/{getTotalQuestions()}</p>
          <p>¡Has ganado {starsEarned * 10} estrellas!</p>
          
          <div style={{ marginTop: '30px' }}>
            <button onClick={onBack} className="btn-primary">
              Volver al Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  const exercise = getCurrentExercise();
  const currentWord = getCurrentWord();
  
  if (!exercise || !currentWord) {
    return (
      <div className="game-area">
        <div className="loading">Cargando ejercicio...</div>
      </div>
    );
  }

  const question = exercise.question.replace('{word}', currentWord);

  return (
    <div className="game-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button onClick={onBack} className="btn-secondary">
          ← Volver
        </button>
        <div className="progress-bar" style={{ width: '200px' }}>
          <div className="progress" style={{ width: `${getProgress()}%` }}></div>
        </div>
      </div>

      <div className="exercise">
        <h3>{currentLevel.title}</h3>
        <div className="sentence">"{exercise.sentence}"</div>
        
        <div className="question">
          <h4>{question}</h4>
          <div style={{ 
            fontSize: '1.5em', 
            color: '#667eea', 
            fontWeight: 'bold',
            margin: '20px 0',
            padding: '10px',
            background: '#f0f0f0',
            borderRadius: '10px'
          }}>
            {currentWord}
          </div>
        </div>
        
        <div className="options">
          {getOptionsForLevel().map((option) => (
            <button
              key={option}
              onClick={() => checkAnswer(option)}
              className="option-btn"
              disabled={showResult}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
        
        {showResult && (
          <div className={`result ${result}`}>
            {result === 'correct' ? (
              <div>
                ¡Correcto! 🎉<br />
                <span style={{ fontSize: '0.9em' }}>+10 estrellas</span>
              </div>
            ) : (
              <div>
                ¡Inténtalo de nuevo! 💪<br />
                <strong>Respuesta correcta: {exercise.answers[currentWord]}</strong><br />
                <span style={{ fontSize: '0.9em', fontStyle: 'italic' }}>
                  {getHint(exercise.answers[currentWord])}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="help-button" onClick={() => alert(getHint(exercise.answers[currentWord]))}>
        ❓
      </div>
    </div>
  );
};

export default GamePage;