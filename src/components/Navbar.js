import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase auth functions
import { auth, db } from "../firebase/firebaseConfig";
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [isToggled, setToggled] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        // Check if the user is actually logged in
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        } // handle if doc doesn't exist
      }
    };
    fetchUsername();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const toggleNav = () => {
    if (screenWidth < 769) {
      setToggled(!isToggled);
    }
  };

  const closeNav = () => {
    setToggled(false);
  };

  useEffect(() => {
    const updateScreenWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    updateScreenWidth();
    window.addEventListener('resize', updateScreenWidth);
    if (screenWidth > 769 && isToggled) {
      closeNav();
    }
    return () => window.removeEventListener('resize', updateScreenWidth);
  }, [screenWidth, isToggled]);

  return (
    <>
      <div className={isToggled ? 'navHolder active' : 'navHolder'}>
        <div className="logo">
          <Image priority src='/logo.png' alt="logo" width={700} height={184} draggable="false" quality={100} />
        </div>
        <div className={isToggled ? 'bars active' : 'bars'} onClick={toggleNav}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className="links">
          <Link href="/" onClick={toggleNav}>Home</Link>
          <Link href="/CodeScanner" onClick={toggleNav}>Scanner</Link>
          <Link href="/database" onClick={toggleNav}>Database</Link>
          {user ? (
            <>
              <Link href="/profile" onClick={toggleNav}>{username}'s Profile</Link>
              <Link href="" onClick={handleLogout}>Logout</Link>
            </>
          ) : (
            <Link href="/login" onClick={toggleNav}>Login</Link>
          )}
        </div>
      </div>
      <div className={isToggled ? 'nav overlay active' : 'nav overlay'} onClick={closeNav} />
    </>
  );
}
