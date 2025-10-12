import React, { useState } from 'react';
import { AuthService } from '../services/authService';

const LoginForm = ({ onSuccess, onToggleMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validaciones
    if (!email || !password) {
      setError('Por favor completa todos los campos');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await AuthService.login(email, password);
      } else {
        result = await AuthService.register(email, password);
      }

      if (result.success) {
        setSuccess(isLogin ? '¡Bienvenido de vuelta!' : '¡Cuenta creada exitosamente!');
        setTimeout(() => {
          onSuccess(result.user);
        }, 1000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error inesperado. Inténtalo de nuevo.');
    }

    setLoading(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', color: '#667eea', marginBottom: '20px' }}>
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          disabled={loading}
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          disabled={loading}
        />
        
        {!isLogin && (
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            disabled={loading}
          />
        )}
        
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
        
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
        </button>
      </form>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          type="button" 
          onClick={toggleMode}
          className="btn-secondary"
          disabled={loading}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <button 
          type="button" 
          onClick={() => onToggleMode(false)}
          className="btn-secondary"
          disabled={loading}
        >
          Continuar sin cuenta
        </button>
      </div>
    </div>
  );
};

export default LoginForm;