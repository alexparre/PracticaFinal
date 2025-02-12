// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXw1Q0FQiR67u4_neE0sKbG-WL5KbcZ7U",
  authDomain: "proyectofinal-977a7.firebaseapp.com",
  databaseURL: "https://proyectofinal-977a7-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "proyectofinal-977a7",
  storageBucket: "proyectofinal-977a7.firebasestorage.app",
  messagingSenderId: "621786380420",
  appId: "1:621786380420:web:5e0be7f4499eeb3b906ad1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

