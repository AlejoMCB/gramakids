import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebaseConfig';
import { AuthService } from '../services/authService';
import { UserProgressService } from '../services/userProgressService';
import LoginForm from '../components/LoginForm';
import UserInfo from '../components/UserInfo';
import MenuPage from './MenuPage';

const HomePage = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      setDataLoading(true);
      
      if (user) {
        // Usuario autenticado - cargar datos de Firestore
        const userDataResult = await AuthService.getUserData(user.uid);
        if (userDataResult.success) {
          setUserData(userDataResult.data);
        }

        // Sincronizar progreso local con Firestore
        await UserProgressService.syncLocalToFirestore(user.uid);
        
        // Cargar progreso
        const progressResult = await UserProgressService.loadProgress(user.uid);
        if (progressResult.success) {
          setUserProgress(progressResult.data);
        }
      } else {
        // Usuario no autenticado - cargar de localStorage
        const progressResult = await UserProgressService.loadProgress(null);
        if (progressResult.success) {
          setUserProgress(progressResult.data);
        }
        setUserData(null);
      }
      
      setDataLoading(false);
    };

    if (!loading) {
      loadUserData();
    }
  }, [user, loading]);

  const handleLoginSuccess = (loggedInUser) => {
    setShowLogin(false);
    // Los datos se cargarán automáticamente por el useEffect
  };

  const handleLogout = () => {
    setUserData(null);
    setUserProgress(null);
    setShowLogin(false);
  };

  const handlePremiumUpdate = (isPremium) => {
    setUserData(prev => ({ ...prev, premium: isPremium }));
  };

  if (loading || dataLoading) {
    return (
      <div className="container">
        <div className="loading">Cargando GramaKids...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="auth-error">Error de conexión: {error.message}</div>
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="container">
        <header>
          <h1>🌟 GramaKids 🌟</h1>
        </header>
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onToggleMode={setShowLogin}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>🌟 GramaKids 🌟</h1>
        
        <div className="stats">
          <span>⭐ {userProgress?.stars || 0}</span>
          <span>🏆 Nivel {userProgress?.currentLevel || 1}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '20px'
        }}>
          {user ? (
            <UserInfo 
              user={user} 
              userData={userData} 
              onLogout={handleLogout} 
            />
          ) : (
            <button 
              onClick={() => setShowLogin(true)}
              className="btn-secondary"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </header>

      <main>
        <div className="character">
          <div className="avatar">🦊</div>
          <div className="speech-bubble">
            {user 
              ? `¡Hola ${user.email.split('@')[0]}! ¿Listo para aprender gramática?`
              : '¡Hola! Soy Foxy y te ayudaré a aprender gramática. ¡Empezamos!'
            }
          </div>
        </div>

        <MenuPage 
          user={user}
          userData={userData}
          userProgress={userProgress}
          onPremiumUpdate={handlePremiumUpdate}
          onProgressUpdate={setUserProgress}
        />
      </main>
    </div>
  );
};

export default HomePage;