// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCptt3KvWhsDiu5-4nOyVa_UHuSL-ahHfM",
    authDomain: "esc-depot-db.firebaseapp.com",
    databaseURL: "https://esc-depot-db-default-rtdb.firebaseio.com",
    projectId: "esc-depot-db",
    storageBucket: "esc-depot-db.appspot.com",
    messagingSenderId: "918356965847",
    appId: "1:918356965847:web:fd27535d16e6066cd5b392",
    measurementId: "G-JNHR545HQ9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };


// Initialize Firestore and Auth
export const db = getFirestore(app);
export const auth = getAuth(app);