// src/services/paymentService.js
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const createCheckoutSession = async () => {
  try {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'GramaKids Premium',
        price: 999,
      }),
    });

    if (!response.ok) {
      throw new Error('La respuesta del servidor no fue OK');
    }

    const session = await response.json();
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error("Error al redirigir a Stripe:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error al crear la sesion de checkout:", error);
    return { success: false, error: error.message };
  }
};

// NUEVA FUNCIÓN PARA MERCADOPAGO
const createMercadoPagoPreference = async () => {
  try {
    const response = await fetch('/.netlify/functions/create-mercadopago-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'GramaKids Premium',
        price: 999,
      }),
    });

    if (!response.ok) {
      throw new Error('Error al crear preferencia de MercadoPago');
    }

    const data = await response.json();
    
    // Redirigir a MercadoPago
    window.location.href = data.init_point;
    
    return { success: true };
  } catch (error) {
    console.error("Error con MercadoPago:", error);
    return { success: false, error: error.message };
  }
};

const createLemonSqueezyCheckout = async () => {
  try {
    const response = await fetch('/.netlify/functions/create-lemon-squeezy-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Error al crear checkout de Lemon Squeezy');
    }

    const data = await response.json();
    window.location.href = data.url;
    
    return { success: true };
  } catch (error) {
    console.error("Error con Lemon Squeezy:", error);
    return { success: false, error: error.message };
  }
};
export const paymentService = {
  createCheckoutSession,
  createMercadoPagoPreference,
  createLemonSqueezyCheckout,
};