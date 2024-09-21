// src/app/matches/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch the current user
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        setError('Error fetching user information.');
        return;
      }
      if (user) {
        setUserId(user.id);
      }
    }

    fetchUser();
  }, []);

  // Fetch matches from the matches table
  useEffect(() => {
    async function fetchMatches() {
      if (!userId) return;

      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          user_1_id, user_2_id, profiles!user_1_id_fkey(name, profile_image), profiles!user_2_id_fkey(name, profile_image)
        `)
        .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`);

      if (error) {
        console.error('Error fetching matches:', error);
        setError('Error fetching matches.');
        return;
      }

      setMatches(matchesData);
    }

    fetchMatches();
  }, [userId]);

  // Function to navigate to the chat page
  const initiateChat = (matchedUserId) => {
    router.push(`/chat/${matchedUserId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      {/* Display matches or show a message if no matches */}
      {matches.length > 0 ? (
        matches.map((match, index) => {
          // Determine which user is the matched profile (the user other than the current one)
          const matchedUserId = match.user_1_id === userId ? match.user_2_id : match.user_1_id;
          const profile = match.user_1_id === userId ? match.profiles[1] : match.profiles[0];

          return (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={profile?.profile_image || '/images/default-avatar.jpg'}
                  alt={profile?.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <p>{profile?.name}</p>
              </div>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded"
                onClick={() => initiateChat(matchedUserId)}
              >
                Chat
              </button>
            </div>
          );
        })
      ) : (
        <p>No matches found.</p>
      )}

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
