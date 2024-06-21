import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { onAuthStateChanged, sendEmailVerification, updateEmail, updateProfile } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import styles from '@/styles/signinup.module.css';
import Button from '@/components/Button';
import Link from "next/link";

export default function EditPage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setUsername(user.displayName || "");
      } else {
        router.push('/login');
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (!user) return null;
  const updateIcon = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      await updateEmail(auth.currentUser, email);      
      // Profile updated!
    } catch (error) {
      // An error occurred
      console.error("Profile Error: ", error);
      // Handle errors appropriately (e.g., display an error message to the user)
      alert(error);
    }
  };
  const updateDisplayName = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      await updateEmail(auth.currentUser, email);      
      // Profile updated!
    } catch (error) {
      // An error occurred
      console.error("Profile Error: ", error);
      // Handle errors appropriately (e.g., display an error message to the user)
      alert(error);
    }
  };
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    try {
      await updateEmail(auth.currentUser, email);
      // Email updated!
    } catch (error) {
      // An error occurred
      console.error("Email Error: ", error);
      alert(error.message);
    }
  };

  return (
    <>
    
      <Head>
        <title>Edit Profile</title>
      </Head>
      <div className={styles.settingsContainer}>
      <h1>Account Settings</h1>
      {/* <form method="post" className={styles.form} onSubmit={updateIcon}>
      <label htmlFor="username">Display Name</label>
      <p>Please enter your full name, or a display name you are comfortable with.</p>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Button type="submit button" >Save</Button>
      </form> */}
      <form method="post" className={styles.form} onSubmit={updateDisplayName}>
      <label htmlFor="username">Display Name</label>
      <p>Please enter your full name, or a display name you are comfortable with.</p>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Button type="submit button" >Save</Button>
      </form>
      <form method="post" className={styles.form} onSubmit={handleUpdateEmail}>
      <label htmlFor="email">Email</label>
      <p>Enter the email addresses you want to use to log in with. Your primary email will be used for account-related notifications.</p>
          <input
            id="username"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit button" >Save</Button>
      </form>
      </div>
      
    </>
  );
}
