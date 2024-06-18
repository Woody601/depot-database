import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@./lib/AuthContext';
import { auth } from "@./lib/firebaseConfig"; // Import auth from firebaseConfig

import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const { user } = useAuth();
  const [screenWidth, setScreenWidth] = useState(0);
  const [isToggled, setToggled] = useState(false);

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
              <Link href="/profile" onClick={toggleNav}>Profile</Link>
              <Link href="#"onClick={() => { auth.signOut(); closeNav(); }}>Logout</Link>
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
