import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './_app'; // Adjust the import path based on your project structure
import styles from '@/styles/signinup.module.css';
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile');
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
            <label className={styles.checkbox}>
              <input type="checkbox" name="remember"/> Remember me
            </label>
            <Button type="submit" className={styles.buttomform}>Log In</Button>
          </div>
          <div className={styles.container}>
            <span className={styles.psw}><a href="#">Forgot password?</a></span>
          </div>
        </form>
      </>
    </>
  );
}
