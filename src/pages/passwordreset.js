import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { sendPasswordResetEmail  } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import styles from '@/styles/signinup.module.css';
import Button from '@/components/Button';
import Link from "next/link";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail (auth, email);
      alert("Password reset email sent!");
      router.push("/login"); // Redirect to homepage (or wherever you like) after login
    } catch (error) {
      console.error("Password Reset Error: ", error);
      // Handle errors appropriately (e.g., display an error message to the user)
    }
  };

  return (
    <>
      <Head>
        <title>Reset Your Password</title>
      </Head>
      
        <form method="post" className={styles.form} onSubmit={handleReset}>
          <h2>Reset your password</h2>
          <p>Please enter the email address associated with your account. We will send you a link to reset your password.</p>
          <div className={styles.container}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className={styles.buttomform}>Reset Password</Button>
          </div>
          <div className={styles.container}>
            <span className={styles.psw}><Link href="/login">Remember your password?</Link></span>
          </div>
        </form>
      </>
  );
}
