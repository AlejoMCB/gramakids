import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export class UserProgressService {
  // Guardar progreso (Firestore o localStorage)
  static async saveProgress(userId, progressData) {
    if (userId) {
      // Usuario autenticado - guardar en Firestore
      try {
        await setDoc(doc(db, 'userProgress', userId), progressData, { merge: true });
        return { success: true };
      } catch (error) {
        console.error('Error guardando en Firestore:', error);
        // Fallback a localStorage
        this.saveToLocalStorage(progressData);
        return { success: false, error: error.message };
      }
    } else {
      // Usuario no autenticado - guardar en localStorage
      this.saveToLocalStorage(progressData);
      return { success: true };
    }
  }

  // Cargar progreso (Firestore o localStorage)
  static async loadProgress(userId) {
    if (userId) {
      // Usuario autenticado - cargar de Firestore
      try {
        const progressDoc = await getDoc(doc(db, 'userProgress', userId));
        if (progressDoc.exists()) {
          return { success: true, data: progressDoc.data() };
        } else {
          // Si no existe en Firestore, migrar desde localStorage
          const localData = this.loadFromLocalStorage();
          if (localData) {
            await this.saveProgress(userId, localData);
            return { success: true, data: localData };
          }
          return { success: true, data: this.getDefaultProgress() };
        }
      } catch (error) {
        console.error('Error cargando de Firestore:', error);
        // Fallback a localStorage
        const localData = this.loadFromLocalStorage();
        return { success: true, data: localData || this.getDefaultProgress() };
      }
    } else {
      // Usuario no autenticado - cargar de localStorage
      const localData = this.loadFromLocalStorage();
      return { success: true, data: localData || this.getDefaultProgress() };
    }
  }

  // Actualizar progreso específico
  static async updateProgress(userId, updates) {
    if (userId) {
      try {
        await updateDoc(doc(db, 'userProgress', userId), updates);
        return { success: true };
      } catch (error) {
        console.error('Error actualizando Firestore:', error);
        return { success: false, error: error.message };
      }
    } else {
      const currentData = this.loadFromLocalStorage() || this.getDefaultProgress();
      const updatedData = { ...currentData, ...updates };
      this.saveToLocalStorage(updatedData);
      return { success: true };
    }
  }

  // Funciones auxiliares para localStorage
  static saveToLocalStorage(data) {
    try {
      localStorage.setItem('gramakids_progress', JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  static loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('gramakids_progress');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error cargando de localStorage:', error);
      return null;
    }
  }

  // Progreso por defecto
  static getDefaultProgress() {
    return {
      currentLevel: 1,
      stars: 0,
      completedLevels: [],
      levelProgress: {},
      lastPlayed: new Date().toISOString()
    };
  }

  // Sincronizar progreso local con Firestore al hacer login
  static async syncLocalToFirestore(userId) {
    const localData = this.loadFromLocalStorage();
    if (localData && userId) {
      try {
        const firestoreData = await this.loadProgress(userId);
        
        // Combinar datos (priorizar el más reciente)
        const combinedData = {
          ...firestoreData.data,
          ...localData,
          stars: Math.max(firestoreData.data?.stars || 0, localData.stars || 0),
          currentLevel: Math.max(firestoreData.data?.currentLevel || 1, localData.currentLevel || 1),
          completedLevels: [
            ...(firestoreData.data?.completedLevels || []),
            ...(localData.completedLevels || [])
          ].filter((level, index, arr) => arr.indexOf(level) === index) // Eliminar duplicados
        };

        await this.saveProgress(userId, combinedData);
        return { success: true, data: combinedData };
      } catch (error) {
        console.error('Error sincronizando datos:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: true, data: null };
  }
}