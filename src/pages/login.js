// pages/login.js

import { useState } from "react";
import { auth } from "@./lib/firebaseConfig";
import Head from "next/head";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    //   alert("Logged in successfully!");
      router.push( "/" );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
        <Head>
            <title>Login</title>
        </Head>
        <div>
            <h1>Login</h1>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    </>
  );
};

export default Login;
