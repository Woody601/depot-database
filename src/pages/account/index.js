import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function Profile () {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
      <p>Welcome, {user.displayName}</p>
      <Link href="account/edit">Edit Profile</Link>
    </div>
  );
};