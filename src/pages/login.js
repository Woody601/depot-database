  import React, { useState } from "react";
  import { useRouter } from "next/router";
  import Head from "next/head";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../firebase/firebaseConfig";
  import styles from '@/styles/signinup.module.css';
  import Button from '@/components/Button';
  import Link from "next/link";

  export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/profile"); // Redirect to account (or wherever you like) after login
      } catch (error) {
        if (error.code == "auth/wrong-password") {
          alert("The password is incorrect.");
        } else if (error.code == "auth/user-not-found") {
          alert("The user was not found.");
          
        }
        else if (error.code == "auth/too-many-requests") {
          alert("This account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or try again later.");
        }
        else {
          alert("The email and password did not match any in our system.");
        }
        // Handle errors appropriately (e.g., display an error message to the user)
      }
    };

    return (
      <>
        <Head>
          <title>Login</title>
        </Head>
        <>
        
          <form method="post" className={styles.form} onSubmit={handleLogin}>
            <h3>Login</h3>
            
            <div className={styles.container}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="psw">Password</label>
              <input
                id="psw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              
              {/* <label className={styles.checkbox}>
                <input type="checkbox" name="remember"/> Remember me
              </label> */}
              <Button type="submit" className={styles.buttomform}>Log In</Button>
            </div>
            <div className={styles.container}>
              <span className={styles.psw}><Link href="/passwordreset">Forgot your password?</Link></span>
            </div>
          </form>
        </>
      </>
    );
  }
