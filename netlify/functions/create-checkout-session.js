// --- CÓDIGO DE DIAGNÓSTICO ---
// Primero, intentamos leer la clave y lo registramos en la consola
const secretKey = process.env.STRIPE_SECRET_KEY;
console.log("--- INICIANDO FUNCIÓN ---");
console.log("Variable STRIPE_SECRET_KEY leída:", secretKey ? `Una clave de ${secretKey.length} caracteres que empieza con '${secretKey.substring(0, 7)}...'` : "NO ENCONTRADA o vacía.");

// Solo intentamos inicializar Stripe si la clave parece existir
if (!secretKey) {
  const errorResponse = {
    statusCode: 500,
    body: JSON.stringify({ error: "La variable de entorno STRIPE_SECRET_KEY no fue encontrada en la función." })
  };
  console.error("Error: STRIPE_SECRET_KEY es undefined.");
  return errorResponse;
}

// Ahora, el código original
const stripe = require('stripe')(secretKey);

exports.handler = async (event) => {
  console.log("Handler de la función invocado.");
  try {
    const { price, name } = JSON.parse(event.body);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: { 
            currency: 'usd', 
            product_data: { name: name }, 
            unit_amount: price, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.REACT_APP_URL}/pago-exitoso`,
      cancel_url: `${process.env.REACT_APP_URL}/pago-cancelado`,
    });

    console.log("Sesión de Stripe creada con éxito.");
    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    console.error("Error DENTRO del handler al crear la sesión de Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No se pudo crear la sesión de pago.', details: error.message }),
    };
  }
};