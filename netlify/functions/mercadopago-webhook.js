const crypto = require('crypto');
const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log('=== WEBHOOK MERCADOPAGO ===');
  
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Notificación de MercadoPago:', body.type);

    // MercadoPago envía el tipo de notificación
    if (body.type === 'payment') {
      const paymentId = body.data.id;
      console.log('Payment ID:', paymentId);

      // Obtener detalles del pago
      const paymentDetails = await getPaymentDetails(paymentId);
      
      if (paymentDetails && paymentDetails.status === 'approved') {
        const userEmail = paymentDetails.payer.email;
        console.log('✅ Pago aprobado para:', userEmail);

        // Activar premium en Firebase
        const activated = await activatePremiumByEmail(userEmail);
        
        if (activated) {
          console.log('🎉 Usuario activado como premium en Firebase');
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Error procesando webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Obtener detalles del pago desde MercadoPago
async function getPaymentDetails(paymentId) {
  const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
  
  if (!ACCESS_TOKEN) {
    console.error('MERCADOPAGO_ACCESS_TOKEN no configurado');
    return null;
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error obteniendo detalles del pago');
      return null;
    }
  } catch (error) {
    console.error('Error en getPaymentDetails:', error);
    return null;
  }
}

// Función para activar premium en Firebase por email
async function activatePremiumByEmail(email) {
  const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;
  const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;

  if (!FIREBASE_API_KEY || !FIREBASE_PROJECT_ID) {
    console.error('Variables de Firebase no configuradas');
    return false;
  }

  try {
    // Buscar usuario por email
    const queryUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`;
    
    const queryResponse = await fetch(queryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'users' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'email' },
              op: 'EQUAL',
              value: { stringValue: email }
            }
          },
          limit: 1
        }
      })
    });

    const queryData = await queryResponse.json();
    
    if (!queryData || !queryData[0] || !queryData[0].document) {
      console.log('Usuario no encontrado en Firebase:', email);
      return false;
    }

    const userDocPath = queryData[0].document.name;
    
    // Actualizar usuario a premium
    const updateUrl = `https://firestore.googleapis.com/v1/${userDocPath}?updateMask.fieldPaths=premium&updateMask.fieldPaths=premiumActivatedAt`;
    
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          premium: { booleanValue: true },
          premiumActivatedAt: { timestampValue: new Date().toISOString() }
        }
      })
    });

    if (updateResponse.ok) {
      console.log('Usuario actualizado a premium:', email);
      return true;
    } else {
      console.error('Error actualizando usuario');
      return false;
    }

  } catch (error) {
    console.error('Error en activatePremiumByEmail:', error);
    return false;
  }
}