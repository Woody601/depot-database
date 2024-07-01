import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ToggleSwitch from '@/components/ToggleSwitch';
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import Firebase auth functions
import { auth } from "@/firebase/firebaseConfig";
import styles from '@/styles/Navbar.module.css';

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [isToggled, setToggled] = useState(false);
  const [isAvatarToggled, setAvatarToggled] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const userMenuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeNav();
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const toggleNav = () => {
    if (screenWidth < 769) {
      setToggled(!isToggled);
    }
  };

  const closeAvatar = () => {
    setAvatarToggled(false);
  }
  const closeNav = () => {
    setToggled(false);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        closeAvatar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

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
  
  useEffect(() => {
    const handleEscKeyDown = (event) => {
      if (event.key == "Escape" && isToggled) {
        closeNav();
      }
      if (event.key == "Escape" && isAvatarToggled) {
        closeAvatar();
      }
    };
    window.addEventListener("keydown", handleEscKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleEscKeyDown);
    };
  }, [isToggled, isAvatarToggled]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentEmail(user.email || "");
        setUsername(user.displayName || "");
        setAvatar(user.photoURL || "");
      }
    });

    return () => unsubscribe();
  }, []);
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
              <div ref={userMenuRef} className='userProfile'>
                <Image priority src={user.photoURL} alt="user" width={45} height={45} draggable="false" quality={100} className="profilePic" onClick={() => setAvatarToggled(!isAvatarToggled)} />
                  <ul className="dropdown-content" style={{ display: isAvatarToggled ? 'block' : 'none' }}>
                    <div className='userDetails'>
                      <p className='userName'>{user.displayName}</p>
                      <p className='userEmail'>{user.email}</p>
                    </div>
                    <li onClick={closeAvatar}><Link href="/profile" onClick={toggleNav}>Dashboard</Link></li>
                    <li onClick={closeAvatar}><Link href="/account" onClick={toggleNav}>Account Settings<i className="material-symbols-outlined">settings</i></Link></li>
                    <li className='sectionDivider'/>
                    <li className='themeSetting'>Theme
                      <div className='themeSwitch'>
                        <ToggleSwitch icon="computer" />
                        <ToggleSwitch icon="light_mode" />
                        <ToggleSwitch icon="dark_mode" />
                      </div>
                    </li>
                    <li className='sectionDivider'/>
                    <li onClick={handleLogout}><Link href="" onClick={toggleNav}>Log Out<i className="material-symbols-outlined">logout</i></Link></li>
                  </ul>
              </div>
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
