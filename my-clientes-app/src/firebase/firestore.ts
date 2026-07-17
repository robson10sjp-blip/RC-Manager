import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta a instância do Firestore
const firestore = getFirestore(app);
export default firestore;