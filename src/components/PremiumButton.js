import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';

const PremiumButton = ({ user, onPremiumUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (method) => {
    if (!user) {
      alert('Debes iniciar sesion para acceder a la version premium');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = method === 'stripe' 
        ? await paymentService.createCheckoutSession()
        : await paymentService.createMercadoPagoPreference();

      if (!result.success) {
        setError(result.error || 'Error al procesar el pago');
      }
    } catch (error) {
      setError('Error inesperado. Intentalo de nuevo.');
      console.error('Error en pago:', error);
    }

    setLoading(false);
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
        <h3>🌟 Version Premium 🌟</h3>
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
        <div className="auth-error" style={{ marginBottom: '15px', color: 'red' }}>
          {error}
        </div>
      )}

      {/* BOTÓN DE STRIPE */}
      <button
        onClick={() => handlePayment('stripe')}
        disabled={loading}
        style={{
          fontSize: '1.2em',
          padding: '15px 30px',
          marginBottom: '10px',
          width: '100%',
          maxWidth: '300px',
          background: '#6772e5',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Procesando...' : '💳 Pagar con Stripe'}
      </button>

      {/* BOTÓN DE MERCADOPAGO */}
      <button
        onClick={() => handlePayment('mercadopago')}
        disabled={loading}
        style={{
          fontSize: '1.2em',
          padding: '15px 30px',
          marginBottom: '10px',
          width: '100%',
          maxWidth: '300px',
          background: '#009ee3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Procesando...' : '🇦🇷 Pagar con MercadoPago'}
      </button>

      <div style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        <p>🔒 Pago 100% seguro</p>
        <p>⚡ Activacion inmediata</p>
        <p>📱 Funciona en todos tus dispositivos</p>
      </div>
    </div>
  );
};

export default PremiumButton;