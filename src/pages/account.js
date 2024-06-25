import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { onAuthStateChanged, verifyBeforeUpdateEmail, updateEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/firebase/firebaseConfig";
import styles from '@/styles/signinup.module.css';
import Button from '@/components/Button';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function EditPage() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [isICOToggled, setICOToggled] = useState(false);
  const initialCropState = { aspect: 1/1, unit: '%', width: 50, height: 50, x: 25, y: 25, keepSelection: true };
  const [crop, setCrop] = useState("");
  const [completedCrop, setCompletedCrop] = useState(null);
  const router = useRouter();
  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  
  function closeImageCropOverlay() {
    setICOToggled(false);
    document.getElementById('avatarUpload').reset();
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setCurrentEmail(user.email || "");
        setUsername(user.displayName || "");
        setAvatar(user.photoURL || "");
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const handleEscKeyDown = (event) => {
      if (event.key == "Escape" && isICOToggled) {
        closeImageCropOverlay();
      }
    };
    window.addEventListener("keydown", handleEscKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleEscKeyDown);
    };
  }, [isICOToggled]);

  if (!user) return null;

  const updateDisplayName = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      await updateEmail(auth.currentUser, email);      
      // Profile updated!
    } catch (error) {
      console.error("Profile Error: ", error);
      alert(error);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (email == currentEmail) {
      alert("This is your current email address. Please enter a new email you would like to use.");
      return;
    }
    else {
      verifyBeforeUpdateEmail(auth.currentUser, email)
    .then(() => {
      // Email verification sent!
      alert("Email verification sent");
    });
    }
    try {
      await updateEmail(auth.currentUser, email);
      // Email updated!
    } catch (error) {
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
      setNewAvatar(URL.createObjectURL(e.target.files[0]));
      setCrop(initialCropState); // Reset crop when a new avatar is selected
      setICOToggled(true);
    } else if (e.target.files[null]) {
      alert("Please select an image to upload.");
      setICOToggled(false);
    }
  };

  const getCroppedImg = (image, crop) => {
    const canvas = canvasRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = avatarFile.name;
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleUpdateAvatar = async (e) => {
    e.preventDefault();
    if (!avatarFile || !completedCrop) {
      alert("Please select and crop an image to upload.");
      return;
    }

    const croppedImageBlob = await getCroppedImg(imageRef.current, completedCrop);

    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    try {
      closeImageCropOverlay();
      await uploadBytes(storageRef, croppedImageBlob);
      const photoURL = await getDownloadURL(storageRef);
      setAvatar(photoURL);
      await updateProfile(auth.currentUser, { photoURL });
      alert("Profile picture updated successfully!");
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
        <form id="avatarUpload" method="post" className={styles.form} onSubmit={handleUpdateAvatar}>
          <div className={isICOToggled ? "overlay active" : "overlay"}>
            <div className={styles.overlayContent}>
              <div className={styles.overlayBody}>
                <ReactCrop 
                  crop={crop} 
                  onChange={(c) => setCrop(c)} 
                  aspect={1 / 1} 
                  keepSelection={true} 
                  onComplete={(c) => setCompletedCrop(c)}
                >
                  <img ref={imageRef} src={newAvatar} alt="Avatar" className={styles.userAvatar} />
                </ReactCrop>
              </div>
              <div className={styles.overlayFooter}>
                <Button type="button" onClick={closeImageCropOverlay}>Cancel</Button>
                <Button type="submit button">Set Avatar</Button>
              </div>
            </div>
          </div>
          <div className={styles.sectionContainer}>
            <img src={avatar} alt="Avatar" className={styles.userAvatar} onClick={() => document.getElementById('avatarInput').click()} />
            <h4>Avatar</h4>
            <p>This is your avatar. <br /> Click on the avatar to upload a custom one from your files.</p>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              required
              style={{ display: 'none' }}
            ></input>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          <div className={styles.sectionFooter}>
            <p>An avatar is optional but strongly recommended.</p>
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
            <Button type="submit button">Save</Button>
          </div>
        </form>
        <form method="post" className={styles.form} onSubmit={handleUpdateEmail}>
          <div className={styles.sectionContainer}>
            <h4>Email</h4>
            <p>Enter the email addresses you want to use to log in with. Your primary email will be used for account-related notifications.</p>
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
            <Button type="submit button">Save</Button>
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
              minLength={6}
              required
            />
          </div>
          <div className={styles.sectionFooter}>
            <p>Emails must be verified to be able to login with them or be used as primary email.</p>
            <Button type="submit button">Save</Button>
          </div>
        </form>
      </div>
    </>
  );
}
