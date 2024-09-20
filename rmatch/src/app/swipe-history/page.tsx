// src/app/swipe-history/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function SwipeHistory() {
  const [swipes, setSwipes] = useState([]);
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
    async function fetchSwipes() {
      if (!userId) return;

      const { data: swipeData, error } = await supabase
        .from('swipes')
        .select('*, profiles!swiped_profile_id_fkey(*)') // Join with profiles table
        .eq('swiper_id', userId); // Fetch swipes made by the current user

      if (error) {
        console.error('Error fetching swipe history:', error);
        return;
      }

      setSwipes(swipeData);
    }

    fetchSwipes();
  }, [userId]);

  const handleUnswipe = async (swipeId) => {
    try {
      const { error } = await supabase
        .from('swipes')
        .delete()
        .eq('id', swipeId);

      if (error) {
        console.error('Error unswiping:', error);
        return;
      }

      // Filter out the removed swipe from the local state
      setSwipes(swipes.filter((swipe) => swipe.id !== swipeId));
    } catch (err) {
      console.error('Unexpected error during unswipe:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Swipe History</h1>

      {swipes.length > 0 ? (
        swipes.map((swipe, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <p>{swipe.profiles.name} (Swipe: {swipe.swipe_type})</p>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={() => handleUnswipe(swipe.id)}
            >
              Unswipe
            </button>
          </div>
        ))
      ) : (
        <p>No swipe history found.</p>
      )}
    </div>
  );
}
