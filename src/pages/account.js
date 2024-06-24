import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { onAuthStateChanged, verifyBeforeUpdateEmail, updateEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/firebase/firebaseConfig";
import styles from '@/styles/signinup.module.css';
import Button from '@/components/Button';


export default function EditPage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setUsername(user.displayName || "");
        setAvatar(user.photoURL || "");
      } else {
        router.push('/login');
      }
    });

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
    verifyBeforeUpdateEmail (auth.currentUser, email)
  .then(() => {
    // Email verification sent!
    alert("Email verification sent");
  });
    try {
      await updateEmail(auth.currentUser, email);
      // Email updated!
      

    } catch (error) {
      // An error occurred
      console.error("Email Error: ", error);
      alert(error.message);
    }
  };
  const reauthenticate = async () => {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
    } catch (error) {
      console.error("Re-authentication Error: ", error);
      alert("Re-authentication failed. Please check your current password.");
      throw error; // Rethrow the error to prevent further execution in case of failure
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await reauthenticate();
      await updatePassword(auth.currentUser, password);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Password Update Error: ", error);
      alert("An error occurred while updating the password: " + error.message);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      alert("Please select an image to upload.");
      return;
    }

    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    try {
      await uploadBytes(storageRef, avatarFile);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      setAvatar(photoURL);
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error("Profile Picture Error: ", error);
      alert("An error occurred while updating the avatar: " + error.message);
    }
  };


  return (
    <>
    
      <Head>
        <title>Account</title>
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
       <form method="post" className={styles.form} onSubmit={handleUpdateAvatar}>
          <div className={styles.sectionContainer}>
            <img src={avatar} alt="Avatar" className={styles.userAvatar}onClick={() => document.getElementById('avatarInput').click()}/>
            <h4>Avatar</h4>
            <p>This is your avatar. <br/> Click on the avatar to upload a custom one from your files.</p>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              required
              style={{display: 'none'}}
            ></input>
          </div>
          <div className={styles.sectionFooter}>
            <p>An avatar is optional but strongly recommended.</p>
            <Button type="submit button">Save</Button>
          </div>
        </form>
      <form method="post" className={styles.form} onSubmit={updateDisplayName}>
      
          <div className={styles.sectionContainer}>
          <h4 htmlFor="username">Display Name</h4>
      <p>Please enter your full name, or a display name you are comfortable with.</p>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength="32"
            required
          />
          </div>
          <div className={styles.sectionFooter}>
          <p>Please use 32 characters at maximum.</p>
          <Button type="submit button" >Save</Button>
          </div>
          
      </form>
      
      <form method="post" className={styles.form} onSubmit={handleUpdateEmail}>
      <div className={styles.sectionContainer}>
      <h4>Email</h4>
      <p>Enter the email addresses you want to use to log in with. Your primary email will be used for account-related notifications.</p>
          {/* <h5>{email}</h5> */}
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
      </div>
      <div className={styles.sectionFooter}>
          <p>Emails must be verified to be able to login with them or be used as primary email.</p>
          <Button type="submit button" >Save</Button>
     </div>
      </form>
      <form method="post" className={styles.form} onSubmit={handleUpdatePassword}>
      <div className={styles.sectionContainer}>
      <h4>Password</h4>
      <p>Enter the email addresses you want to use to log in with. Your primary email will be used for account-related notifications.</p>
      <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              minLength={6}
              required
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              suggested= "new-password"
              minLength={6}
              required
            />        
      </div>
      <div className={styles.sectionFooter}>
          <p>Emails must be verified to be able to login with them or be used as primary email.</p>
          <Button type="submit button" >Save</Button>
     </div>
      </form>
      </div>
      
    </>
  );
}
