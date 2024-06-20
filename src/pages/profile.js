import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Profile () {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (!user) return null;

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
};