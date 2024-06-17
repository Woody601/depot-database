import Head from 'next/head';
import styles from "@/styles/404.module.css"; 
export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404: Page Not Found</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.nextError}>404</h1>
          <h2 className={styles.message}>This page could not be found.</h2>
        </div>
      </div>
    </>
  );
};