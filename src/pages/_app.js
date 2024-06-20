// _app.js
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

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
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = app.name && typeof window !== 'undefined' ? getAnalytics(app) : null;
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
export { auth, database  };

async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <div className="pagescroll">
        <Component {...pageProps} />
      </div>
    </>
  );
}
