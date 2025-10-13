exports.handler = async (event) => {
  const LEMON_SQUEEZY_API_KEY = process.env.LEMON_SQUEEZY_API_KEY;
  const STORE_ID = process.env.LEMON_SQUEEZY_STORE_ID;
  const VARIANT_ID = process.env.LEMON_SQUEEZY_VARIANT_ID;

  try {
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

    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        url: data.data.attributes.url 
      })
    };
  } catch (error) {
    console.error('Error Lemon Squeezy:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};