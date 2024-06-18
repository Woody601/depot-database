// lib/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";  // add this 
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebase from 'firebase/app';
import 'firebase/auth';

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // add this
const auth = getAuth(app);
const db = getFirestore(app);
// Get a list of cities from your database
export { auth, db , database};