'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchMatches() {
      if (!userId) return;

      const { data: matchesData, error } = await supabase
        .from('matches')
        .select('*, profile_1_id, profile_2_id')  // Ensure we are fetching both profiles in the match
        .or(`profile_1_id.eq.${userId},profile_2_id.eq.${userId}`); // Fetch matches for the current user

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      setMatches(matchesData);
    }

    fetchMatches();
  }, [userId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Matches</h1>

      {matches.length > 0 ? (
        matches.map((match, index) => {
          // Determine which profile is the matched user
          const matchedProfileId = match.profile_1_id === userId ? match.profile_2_id : match.profile_1_id;

          return (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4">
              <p>Matched Profile ID: {matchedProfileId}</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded">
                Message
              </button>
            </div>
          );
        })
      ) : (
        <p>No matches found.</p>
      )}
    </div>
  );
}
