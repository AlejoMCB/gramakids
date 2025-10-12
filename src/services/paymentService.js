// src/services/paymentService.js

// Importamos la librería de Stripe para el front-end
import { loadStripe } from '@stripe/stripe-js';

// Tu clave PUBLICABLE de Stripe (esta no es secreta)
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
        price: 999, // $9.99 en centavos
      }),
    });

    if (!response.ok) {
      throw new Error('La respuesta del servidor no fue OK');
    }

    const session = await response.json();

    // Redirigir al checkout de Stripe
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
    console.error("Error al crear la sesión de checkout:", error);
    return { success: false, error: error.message };
  }
};

export const paymentService = {
  createCheckoutSession,
};