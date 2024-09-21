// src/app/matches/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'next/navigation'; // To navigate to the chat page

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

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

  useEffect(() => {
    async function fetchMatches() {
      if (!userId) return;

      // Fetch mutual matches (both users swiped right on each other)
      const { data: matchesData, error } = await supabase
        .from('swipes')
        .select(`
          swiped_profile_id, swiper_id, swipe_type, profiles!swiped_profile_id_fkey(name, profile_image)
        `)
        .eq('swipe_type', 'like')
        .or(`swiper_id.eq.${userId},swiped_profile_id.eq.${userId}`); // Fetch swipes involving the current user

      if (error) {
        console.error('Error fetching matches:', error);
        setError('Error fetching matches.');
        return;
      }

      // Filter out matches where both users swiped "like"
      const filteredMatches = matchesData.filter(
        (match) => match.swiper_id === userId || match.swiped_profile_id === userId
      );

      setMatches(filteredMatches);
    }

    fetchMatches();
  }, [userId]);

  const initiateChat = (matchedProfileId) => {
    // Logic to navigate to the chat page with the matched profile ID
    router.push(`/chat/${matchedProfileId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      {/* Display matches or a message if no matches are found */}
      {matches.length > 0 ? (
        matches.map((match, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={match.profiles?.profile_image || '/images/default-avatar.jpg'}
                alt={match.profiles?.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <p>{match.profiles?.name}</p>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded"
              onClick={() => initiateChat(match.swiped_profile_id)}
            >
              Chat
            </button>
          </div>
        ))
      ) : (
        <p>No matches found.</p>
      )}

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
