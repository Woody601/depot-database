import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@./lib/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
      <h1>Profile</h1>
      <p>Welcome, {user.email}</p>
    </div>
  );
};

export default Profile;