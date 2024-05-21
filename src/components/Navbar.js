import { useEffect, useState } from "react";
import Link from "next/link";
import "@/styles/Navbar.module.css"; 
import Image from "next/image";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(0);
  const [isToggled, setToggled] = useState(false);

  const toggleNav = () => {
    if (screenWidth <= 753) {
      setToggled(!isToggled);
    }
  };

  const closeNav = () => {
    setToggled(false);
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
    if (screenWidth >= 754 && isToggled) {
      closeNav();
    }
  }, [screenWidth, isToggled]);  // Added screenWidth to dependencies

  return (
    <>
      <div className="navHolder">
        <div className={isToggled ? "bars active" : "bars"} onClick={toggleNav}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
        <div className="logo">
          <Image priority={true} src={'/logo.png'} width={190.22} height={50} alt="logo" />
        </div>
        <div className={isToggled ? "links active" : "links"}>          
          <Link href="/" onClick={toggleNav}>
            Home
          </Link>
          <Link href="/QRCodeScanner" onClick={toggleNav}>
            QR Code Scanner
          </Link>
          <Link href="/barcodeScanner" onClick={toggleNav}>
            Barcode Scanner
          </Link>
          <Link href="/login" onClick={toggleNav}>
            Login
          </Link>
        </div>
      </div>
    </>
  );
}