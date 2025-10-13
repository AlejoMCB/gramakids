const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  console.log("Funcion invocada");
  
  // Validar que existe la clave
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("STRIPE_SECRET_KEY no configurada");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuracion de Stripe faltante' })
    };
  }

  try {
    const { price, name } = JSON.parse(event.body);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: name },
          unit_amount: price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://gramakids.netlify.app/pago-exitoso',
      cancel_url: 'https://gramakids.netlify.app/pago-cancelado',
    });
    
    console.log("Sesion creada:", session.id);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    console.error("Error al crear sesion:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};