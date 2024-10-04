import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBxQrigYRQ4Fj3G9r2nUA7k54dBo0kcKsg",
  authDomain: "event-manager-11130.firebaseapp.com",
  projectId: "event-manager-11130",
  storageBucket: "event-manager-11130.appspot.com",
  messagingSenderId: "315869204176",
  appId: "1:315869204176:web:87b236d07bdd316de318d5",
  measurementId: "G-DMGP180X0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;