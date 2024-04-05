import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/Navbar.module.css"; 

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [isToggled, setToggled] = useState(false);

  const toggleNav = () => {
    if (screenWidth <= 960) {
      setToggled(!isToggled);
    }
  };

  const updateScreenWidth = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    updateScreenWidth();
    window.addEventListener("resize", updateScreenWidth);
    return () => window.removeEventListener("resize", updateScreenWidth);
  }, []);

  useEffect(() => {
    if (screenWidth >= 960 && isToggled) {
      setToggled(false);
    }
  }, [isToggled]);

  return (
    <>
      <div className="navHolder">
        <div className={isToggled ? "bars active" : "bars"} onClick={toggleNav}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className={isToggled ? "links active" : "links"}>
          <Link href="/" onClick={toggleNav}>
            Home
          </Link>
          <Link href="/QRCodeScanner" onClick={toggleNav}>
            QR Code Scanner
          </Link>
          <Link href="/games" onClick={toggleNav}>
            Games
          </Link>
          <Link href="/contact" onClick={toggleNav}>
            Contact
          </Link>
        </div>
      </div>
    </>
  );
}
