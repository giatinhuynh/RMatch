// pages/profile.tsx
import { useEffect, useState } from 'react';
import { supabase } from './services/supabaseClient';
import { useRouter } from 'next/router';

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.session();

    if (!session) {
      router.push('/auth/login'); // Redirect to login if not authenticated
    } else {
      setUser(session.user);
    }
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login'); // Redirect to login on logout
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
