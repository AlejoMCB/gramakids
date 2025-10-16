import React, { useState } from 'react';
import { paymentService } from '../services/paymentService';

const PremiumButton = ({ user, onPremiumUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (method) => {
    if (!user) {
      alert('Debes iniciar sesión para acceder a la versión premium');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let result;
      if (method === 'lemonsqueezy') {
        result = await paymentService.createLemonSqueezyCheckout();
      } else if (method === 'mercadopago') {
        result = await paymentService.createMercadoPagoPreference();
      }

      if (!result.success) {
        setError(result.error || 'Error al procesar el pago');
      }
    } catch (error) {
      setError('Error inesperado. Inténtalo de nuevo.');
      console.error('Error en pago:', error);
    }

    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '20px auto', 
      padding: '0 20px' 
    }}>
      {/* Header Premium */}
      <div style={{
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        padding: '30px 20px',
        borderRadius: '20px',
        marginBottom: '25px',
        color: '#333',
        boxShadow: '0 4px 15px rgba(255,165,0,0.3)'
      }}>
        <h2 style={{ 
          margin: '0 0 15px 0',
          fontSize: '1.8em',
          textAlign: 'center'
        }}>
          🌟 Versión Premium
        </h2>
        
        <p style={{ 
          textAlign: 'center', 
          fontSize: '1.1em',
          margin: '0 0 20px 0'
        }}>
          Desbloquea todos los niveles y funciones especiales
        </p>

        <ul style={{ 
          listStyle: 'none',
          padding: 0,
          margin: '0 0 20px 0',
          fontSize: '1em'
        }}>
          <li style={{ padding: '8px 0' }}>✅ Acceso a todos los niveles</li>
          <li style={{ padding: '8px 0' }}>✅ Ejercicios adicionales</li>
          <li style={{ padding: '8px 0' }}>✅ Seguimiento detallado del progreso</li>
          <li style={{ padding: '8px 0' }}>✅ Sin anuncios</li>
          <li style={{ padding: '8px 0' }}>✅ Nuevos personajes y avatares</li>
        </ul>

        <div style={{ 
          fontSize: '2em', 
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Solo $9.99 USD
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#fee',
          border: '2px solid #fcc',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          color: '#c33',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Payment Buttons Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '25px'
      }}>
        {/* Botón Tarjeta Internacional */}
        <button
          onClick={() => handlePayment('lemonsqueezy')}
          disabled={loading}
          style={{
            fontSize: '1.1em',
            padding: '18px 25px',
            background: 'linear-gradient(135deg, #FFC233 0%, #FFB700 100%)',
            color: '#000',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(255,194,51,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(255,194,51,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(255,194,51,0.4)';
          }}
        >
          <span style={{ fontSize: '1.3em' }}>💳</span>
          <span>{loading ? 'Procesando...' : 'Pagar con Tarjeta Internacional'}</span>
        </button>

        {/* Botón MercadoPago */}
        <button
          onClick={() => handlePayment('mercadopago')}
          disabled={loading}
          style={{
            fontSize: '1.1em',
            padding: '18px 25px',
            background: 'linear-gradient(135deg, #009ee3 0%, #0088cc 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 10px rgba(0,158,227,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            opacity: loading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 15px rgba(0,158,227,0.5)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 10px rgba(0,158,227,0.4)';
          }}
        >
          <span style={{ fontSize: '1.3em' }}>🇦🇷</span>
          <span>{loading ? 'Procesando...' : 'Pagar con MercadoPago'}</span>
        </button>
      </div>

      {/* Footer Info */}
      <div style={{ 
        textAlign: 'center',
        color: '#666',
        fontSize: '0.95em',
        lineHeight: '1.8'
      }}>
        <p style={{ margin: '8px 0' }}>🔒 Pago 100% seguro</p>
        <p style={{ margin: '8px 0' }}>⚡ Activación inmediata</p>
        <p style={{ margin: '8px 0' }}>💳 Aceptamos tarjetas de todo el mundo</p>
      </div>
    </div>
  );
};

export default PremiumButton;