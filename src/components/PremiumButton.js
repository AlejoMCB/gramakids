import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';
import { AuthService } from '../services/authService';

const PremiumButton = ({ user, onPremiumUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePremiumUpgrade = async () => {
    if (!user) {
      alert('Debes iniciar sesión para acceder a la versión premium');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Usar el nuevo servicio de pago con Stripe
      const result = await paymentService.createCheckoutSession();
      
      if (result.success) {
        // El usuario será redirigido a Stripe Checkout
        // La actualización del estado premium se manejará después del pago exitoso
        console.log('Redirigiendo a Stripe Checkout...');
      } else {
        setError(result.error || 'Error al crear sesión de pago');
      }
    } catch (error) {
      setError('Error inesperado. Inténtalo de nuevo.');
      console.error('Error en upgrade premium:', error);
    }

    setLoading(false);
  };

  const handleStripePayment = async () => {
    // Ahora usamos directamente handlePremiumUpgrade que ya tiene la integración con Stripe
    await handlePremiumUpgrade();
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <div style={{ 
        background: 'linear-gradient(45deg, #FFD700, #FFA500)', 
        padding: '20px', 
        borderRadius: '15px', 
        marginBottom: '20px',
        color: '#333'
      }}>
        <h3>🌟 Versión Premium 🌟</h3>
        <p>Desbloquea todos los niveles y funciones especiales</p>
        <ul style={{ textAlign: 'left', margin: '15px 0' }}>
          <li>✅ Acceso a todos los niveles</li>
          <li>✅ Ejercicios adicionales</li>
          <li>✅ Seguimiento detallado del progreso</li>
          <li>✅ Sin anuncios</li>
          <li>✅ Nuevos personajes y avatares</li>
        </ul>
        <div style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '10px 0' }}>
          Solo $9.99 USD
        </div>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: '15px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleStripePayment}
        disabled={loading}
        className="premium-button"
        style={{ 
          fontSize: '1.3em', 
          padding: '20px 40px',
          marginBottom: '10px',
          width: '100%',
          maxWidth: '300px'
        }}
      >
        {loading ? 'Procesando...' : '🚀 Obtener Premium'}
      </button>

      <div style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        <p>💳 Pago seguro con Stripe</p>
        <p>🔒 Activación inmediata</p>
        <p>📱 Funciona en todos tus dispositivos</p>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          background: '#f0f0f0', 
          borderRadius: '10px',
          fontSize: '0.8em',
          color: '#666'
        }}>
          <strong>Modo Desarrollo:</strong> El pago se simula automáticamente
        </div>
      )}
    </div>
  );
};

export default PremiumButton;