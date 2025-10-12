# 🌟 GramaKids - Aprende Gramática Jugando

Una aplicación web educativa interactiva para que los niños aprendan gramática española de forma divertida, con sistema de autenticación y monetización.

## 🚀 Características

- **Juegos Educativos**: 6 niveles progresivos de gramática española
- **Sistema Freemium**: 2 niveles gratuitos + 4 niveles premium
- **Autenticación**: Registro y login con Firebase Auth
- **Progreso Sincronizado**: Guarda el progreso en Firestore y localStorage
- **Pagos Seguros**: Integración con Stripe para pagos premium
- **PWA Ready**: Funciona como aplicación web progresiva
- **Responsive**: Diseño adaptable para móviles y tablets

## 🎮 Niveles Disponibles

### Gratuitos
1. **Identifica las Palabras** - Sustantivos, adjetivos y verbos
2. **Sustantivos Propios e Impropios** - Diferencias básicas

### Premium
3. **Tiempos Verbales** - Presente, pasado y futuro
4. **Artículos y Determinantes** - Definidos e indefinidos
5. **Género y Número** - Concordancia gramatical
6. **Sinónimos y Antónimos** - Relaciones semánticas

## 🛠️ Tecnologías

- **Frontend**: React 18 + React Router
- **Autenticación**: Firebase Auth
- **Base de Datos**: Firestore
- **Pagos**: Stripe Checkout
- **Hosting**: Netlify
- **Estilos**: CSS3 con animaciones

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd gramakids
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

4. **Configurar Firebase**
   - Crear proyecto en [Firebase Console](https://console.firebase.google.com)
   - Habilitar Authentication (Email/Password)
   - Crear base de datos Firestore
   - Copiar configuración a `.env`

5. **Configurar Stripe**
   - Crear cuenta en [Stripe](https://stripe.com)
   - Obtener claves de API (modo test)
   - Agregar clave pública a `.env`

6. **Ejecutar en desarrollo**
```bash
npm start
```

## 🔧 Configuración Detallada

### Firebase Setup

1. **Crear proyecto Firebase**
   - Ir a [Firebase Console](https://console.firebase.google.com)
   - Crear nuevo proyecto
   - Habilitar Google Analytics (opcional)

2. **Configurar Authentication**
   - En Authentication > Sign-in method
   - Habilitar "Email/Password"
   - Configurar dominio autorizado (tu dominio de Netlify)

3. **Configurar Firestore**
   - Crear base de datos en modo test
   - Configurar reglas básicas:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /userProgress/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

4. **Obtener configuración**
   - En Project Settings > General
   - Copiar configuración de Firebase SDK
   - Agregar valores a `.env`

### Stripe Setup

1. **Crear cuenta Stripe**
   - Registrarse en [Stripe](https://stripe.com)
   - Activar modo test

2. **Obtener claves API**
   - En Dashboard > Developers > API keys
   - Copiar "Publishable key" (pk_test_...)
   - Agregar a `.env` como `REACT_APP_STRIPE_PUBLISHABLE_KEY`

3. **Crear productos** (Opcional para producción)
   - En Products, crear "GramaKids Premium"
   - Precio: $9.99 USD
   - Copiar Price ID para backend

### Variables de Entorno

Crear archivo `.env` con:

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=gramakids-12345.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=gramakids-12345
REACT_APP_FIREBASE_STORAGE_BUCKET=gramakids-12345.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef

# Stripe
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC...
```

## 🚀 Despliegue en Netlify

1. **Conectar repositorio**
   - Crear cuenta en [Netlify](https://netlify.com)
   - Conectar con GitHub/GitLab
   - Seleccionar repositorio

2. **Configurar build**
   - Build command: `npm run build`
   - Publish directory: `build`

3. **Agregar variables de entorno**
   - En Site settings > Environment variables
   - Agregar todas las variables del archivo `.env`

4. **Configurar redirects**
   - Crear archivo `public/_redirects`:
   ```
   /*    /index.html   200
   ```

## 💳 Sistema de Pagos

### Modo Desarrollo
- Los pagos se simulan automáticamente
- No se realizan cargos reales
- Premium se activa inmediatamente

### Modo Producción
- Requiere backend para crear sesiones de Stripe
- Implementar webhooks para verificar pagos
- Configurar dominios autorizados

### Flujo de Pago
1. Usuario hace clic en "Obtener Premium"
2. Se abre modal de pago
3. En desarrollo: simulación automática
4. En producción: redirección a Stripe Checkout
5. Callback actualiza estado premium en Firestore

## 📱 Funcionalidades

### Sistema de Progreso
- **Estrellas**: Se ganan por respuestas correctas
- **Niveles**: Progresión automática
- **Sincronización**: Entre dispositivos para usuarios registrados
- **Persistencia**: localStorage para usuarios anónimos

### Autenticación
- **Registro**: Email + contraseña
- **Login**: Persistente entre sesiones
- **Migración**: Progreso local se sincroniza al hacer login
- **Logout**: Mantiene progreso local

### Monetización
- **Freemium**: 2 niveles gratuitos
- **Premium**: $9.99 USD por acceso completo
- **Activación**: Inmediata tras pago exitoso
- **Persistencia**: Estado premium guardado en Firestore

## 🔒 Seguridad

- **Autenticación**: Firebase Auth con validación
- **Autorización**: Reglas Firestore por usuario
- **Pagos**: Stripe con validación server-side
- **Datos**: Encriptación en tránsito y reposo

## 🐛 Troubleshooting

### Error: Firebase not configured
- Verificar variables de entorno
- Comprobar sintaxis en `.env`
- Reiniciar servidor de desarrollo

### Error: Stripe key invalid
- Verificar clave pública de Stripe
- Comprobar modo test/producción
- Verificar formato pk_test_...

### Error: Firestore permission denied
- Verificar reglas de Firestore
- Comprobar autenticación del usuario
- Verificar estructura de documentos

## 📈 Próximas Funcionalidades

- [ ] Más niveles de gramática
- [ ] Sistema de logros
- [ ] Modo multijugador
- [ ] Reportes para padres
- [ ] Integración con MercadoPago
- [ ] Aplicación móvil nativa

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

- **Email**: soporte@gramakids.com
- **Documentación**: [docs.gramakids.com](https://docs.gramakids.com)
- **Issues**: [GitHub Issues](https://github.com/usuario/gramakids/issues)

---

Hecho con ❤️ para que los niños aprendan gramática de forma divertida.