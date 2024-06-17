import Head from "next/head";
import styles from "@/styles/signinup.module.css";
import { signUpWithEmailAndPassword } from "firebase/auth";
export default function Home() {
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <form action="/action_page.php" className={styles.formContainer}>
        <div className={styles.container}>
          <h1>Sign Up</h1>
          <p>Please fill in this form to create an account.</p>
          <hr />

          <label htmlFor="email"><b>Email</b></label>
          <input type="text" placeholder="Enter Email" name="email" required />

          <label htmlFor="psw"><b>Password</b></label>
          <input type="password" placeholder="Enter Password" name="psw" required />

          <label htmlFor="psw-repeat"><b>Repeat Password</b></label>
          <input type="password" placeholder="Repeat Password" name="psw-repeat" required />
          
          <label>
            <input type="checkbox" defaultChecked="checked" name="remember" style={{ marginBottom: "15px" }} /> Remember me
          </label>
          
          <p>By creating an account you agree to our <a href="#" style={{ color: "dodgerblue" }}>Terms & Privacy</a>.</p>

          <div className={styles.clearfix}>
            <button type="button" className={styles.cancelbtn}>Cancel</button>
            <button type="submit" className={styles.signupbtn}>Sign Up</button>
          </div>
        </div>
      </form>
    </>
  );
}
