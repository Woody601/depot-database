// pages/login.js

import { useState } from "react";
import { auth } from "@./lib/firebaseConfig";
import Head from "next/head";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import styles from "@/styles/signinup.module.css";
import Button from "@/components/Button";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      router.back("/");
    } catch (error) {
      alert(error.message);
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
    <div class="container">
    <label for="email">Email</label>
    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

    <label for="psw">Password</label>
    <input name='psw' type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
    <label className={styles.checkbox}>
      <input type="checkbox" name="remember"/> Remember me
    </label>
    <Button type="submit">Login</Button>
    
  </div>

  <div class={styles.container}>
    <span class={styles.psw}>Forgot <a href="#">password?</a></span>
  </div>
</form>
        </>
    </>
  );
};

export default Login;
