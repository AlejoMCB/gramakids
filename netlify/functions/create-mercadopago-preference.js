const mercadopago = require('mercadopago');

exports.handler = async (event) => {
  console.log('Funcion MercadoPago invocada');
  
  // Configurar MercadoPago con tu Access Token
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
  });

  try {
    const { price, name } = JSON.parse(event.body);
    
    const preference = {
      items: [{
        title: name,
        unit_price: price / 100, // MP usa decimales (9.99 no 999)
        quantity: 1,
        currency_id: 'USD'
      }],
      back_urls: {
        success: 'https://gramakids.netlify.app/pago-exitoso',
        failure: 'https://gramakids.netlify.app/pago-cancelado',
        pending: 'https://gramakids.netlify.app/pago-pendiente'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    
    console.log('Preferencia MP creada:', response.body.id);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        id: response.body.id,
        init_point: response.body.init_point 
      })
    };
  } catch (error) {
    console.error('Error MP:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
