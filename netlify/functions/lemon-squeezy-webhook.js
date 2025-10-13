const crypto = require('crypto');

exports.handler = async (event) => {
  const signature = event.headers['x-signature'];
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  // Verificar firma
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(event.body);
  const digest = hmac.digest('hex');

  if (digest !== signature) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Invalid signature' })
    };
  }

  const data = JSON.parse(event.body);
  console.log('Lemon Squeezy event:', data.meta.event_name);

  // Aquí actualizar usuario a premium
  if (data.meta.event_name === 'order_created') {
    console.log('Pago exitoso para usuario:', data.data.attributes.user_email);
    // TODO: Actualizar base de datos
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true })
  };
};