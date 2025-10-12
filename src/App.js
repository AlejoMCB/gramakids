import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/payment-pending" element={<PaymentPending />} />
        </Routes>
      </div>
    </Router>
  );
}

// Componentes para manejo de pagos
const PaymentSuccess = () => (
  <div className="container">
    <div className="game-area" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#4CAF50' }}>¡Pago Exitoso! 🎉</h2>
      <p>Tu cuenta premium ha sido activada.</p>
      <button onClick={() => window.location.href = '/'} className="btn-primary">
        Ir a GramaKids
      </button>
    </div>
  </div>
);

const PaymentFailure = () => (
  <div className="container">
    <div className="game-area" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#f44336' }}>Pago Cancelado</h2>
      <p>No se realizó ningún cargo. Puedes intentar de nuevo.</p>
      <button onClick={() => window.location.href = '/'} className="btn-primary">
        Volver a GramaKids
      </button>
    </div>
  </div>
);

const PaymentPending = () => (
  <div className="container">
    <div className="game-area" style={{ textAlign: 'center' }}>
      <h2 style={{ color: '#FF8E53' }}>Pago Pendiente</h2>
      <p>Tu pago está siendo procesado. Te notificaremos cuando esté listo.</p>
      <button onClick={() => window.location.href = '/'} className="btn-primary">
        Volver a GramaKids
      </button>
    </div>
  </div>
);

export default App;