import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export class AuthService {
  // Registrar nuevo usuario
  static async register(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Crear documento de usuario en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        premium: false,
        createdAt: new Date(),
        progress: {}
      });
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Iniciar sesión
  static async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Cerrar sesión
  static async logout() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Obtener datos del usuario
  static async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'Usuario no encontrado' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Actualizar estado premium
  static async updatePremiumStatus(userId, isPremium) {
    try {
      await setDoc(doc(db, 'users', userId), { premium: isPremium }, { merge: true });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Escuchar cambios de autenticación
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
}