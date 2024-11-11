// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDcoL5OSWcDq5xrT1r_REofWTTfd0giXdg",
    authDomain: "cwm-2024-2-t-p.firebaseapp.com",
    projectId: "cwm-2024-2-t-p",
    storageBucket: "cwm-2024-2-t-p.appspot.com",
    messagingSenderId: "408498992042",
    appId: "1:408498992042:web:b22b4ff83b65b8ce7df1d3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Obtenemos la referencia a nuestra base de datos de Firestore y la exportamos.
// Esta referencia se nos va a pedir para cada interacción que queramos realizar contra Firestore.
export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);