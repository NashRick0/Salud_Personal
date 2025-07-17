
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, IS_FIREBASE_CONFIGURED } from './config';
import { UserData } from './../types/data';


const DEFAULT_USER_DATA: UserData = {
    goals: { exercise: 30, sleep: 8, calories: 2000 },
    stats: {},
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  console.log("--- Intentando obtener datos del usuario ---");
  if (!IS_FIREBASE_CONFIGURED) {
    console.log("MODO DEMO: Devolviendo datos de demostración.");
    return DEFAULT_USER_DATA;
  }

  console.log(`MODO REAL: Buscando documento para el usuario: ${userId}`);
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        console.log("Documento encontrado en Firebase.");
        const firebaseData = userDoc.data();
        return { ...DEFAULT_USER_DATA, ...firebaseData };
    } else {
        console.log("El documento no existe en Firebase. Devolviendo datos por defecto.");
        return DEFAULT_USER_DATA;
    }
  } catch (error) {
    console.error("[getUserData] Error al obtener documento:", error);
    return null;
  }
};

export const saveUserData = async (userId: string, data: Partial<UserData>): Promise<void> => {
  console.log("--- Intentando guardar datos del usuario ---");
  if (!IS_FIREBASE_CONFIGURED) {
    console.log("MODO DEMO: No se guardará en Firebase.");
    return;
  }

  console.log(`MODO REAL: Guardando datos para el usuario: ${userId}`);
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
    console.log("¡ÉXITO! Datos guardados en Firebase correctamente.");
  } catch (error) {
    console.error("[saveUserData] Error al guardar documento:", error);
  }
};