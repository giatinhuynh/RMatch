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
        .select('*, profiles!swiped_profile_id_fkey(name)') // Join with the profiles table to get names
        .eq('swiper_id', userId);

      if (error) {
        console.error('Error fetching swipe history:', error);
      } else {
        setSwipes(swipeData);
      }
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
      } else {
        setSwipes(swipes.filter((swipe) => swipe.id !== swipeId)); // Remove the unswiped item from the list
      }
    } catch (error) {
      console.error('Unexpected error during unswipe:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Swipe History</h1>

      {swipes.length > 0 ? (
        swipes.map((swipe, index) => (
          <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4">
            <p>{swipe.profiles.name} (Swipe: {swipe.swipe_type})</p> {/* Display the profile name */}
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
