
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9ngIn2za2A1ptgwgy62feERLmsSEev8Q",
  authDomain: "apphabitos-7542e.firebaseapp.com",
  projectId: "apphabitos-7542e",
  storageBucket: "apphabitos-7542e.firebasestorage.app",
  messagingSenderId: "327111839619",
  appId: "1:327111839619:web:755eec17ff22fabfbaf0b6",
  measurementId: "G-L1ZD9PM1H7"
};

export const IS_FIREBASE_CONFIGURED: boolean = firebaseConfig.projectId !== "1234546789";

console.log(`Firebase está configurado: ${IS_FIREBASE_CONFIGURED}. Project ID: ${firebaseConfig.projectId}`);

let app: FirebaseApp;
let db: Firestore;

if (IS_FIREBASE_CONFIGURED) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.log("Firebase SDK inicializado correctamente.");
  } catch (e) {
    console.error("ERROR AL INICIALIZAR FIREBASE:", e);
  }
} else {
  console.warn("Usando datos de demostración porque Firebase no está configurado.");
}

export { db };
