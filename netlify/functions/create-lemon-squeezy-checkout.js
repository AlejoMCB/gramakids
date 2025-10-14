exports.handler = async (event) => {
  console.log('=== FUNCIÓN LEMON SQUEEZY INICIADA ===');
  
  const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
  const VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID;

  console.log('API Key presente:', !!LEMON_SQUEEZY_API_KEY);
  console.log('API Key primeros 10 chars:', LEMON_SQUEEZY_API_KEY ? LEMON_SQUEEZY_API_KEY.substring(0, 10) : 'NO EXISTE');
  console.log('Store ID:', STORE_ID);
  console.log('Variant ID:', VARIANT_ID);

  if (!LEMON_SQUEEZY_API_KEY || !STORE_ID || !VARIANT_ID) {
    console.error('Faltan variables de entorno');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Configuración incompleta' })
    };
  }

  try {
    console.log('Llamando a API de Lemon Squeezy...');
    
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: 'user123'
              }
            }
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: STORE_ID
              }
            },
            variant: {
              data: {
                type: 'variants',
                id: VARIANT_ID
              }
            }
          }
        }
      })
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response completa:', JSON.stringify(data));

    if (!response.ok) {
      console.error('Error de API Lemon Squeezy:', JSON.stringify(data));
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Error de Lemon Squeezy', details: data })
      };
    }

    if (!data.data || !data.data.attributes || !data.data.attributes.url) {
      console.error('Respuesta sin URL:', JSON.stringify(data));
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Respuesta inválida de Lemon Squeezy' })
      };
    }
    
    console.log('Checkout URL generada:', data.data.attributes.url);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        url: data.data.attributes.url 
      })
    };
  } catch (error) {
    console.error('Error Lemon Squeezy:', error.message);
    console.error('Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};