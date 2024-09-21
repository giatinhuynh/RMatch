// src/app/swipe-history/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Image from 'next/image';

interface Swipe {
  id: string;
  swipe_type: string;
  profiles: {
    name: string;
    profile_image: string;
  };
}

export default function SwipeHistory() {
  const [swipes, setSwipes] = useState<Swipe[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        console.log("User ID set:", user.id);
      } else {
        console.log("No user found");
        setError("No user found. Please make sure you're logged in.");
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function fetchSwipes() {
      if (!userId) {
        console.log("No user ID, skipping swipe fetch");
        return;
      }
      console.log("Fetching swipes for user:", userId);
      const { data: swipeData, error } = await supabase
        .from('swipes')
        .select('*, profiles!swiped_profile_id_fkey(name, profile_image)')
        .eq('swiper_id', userId);

      if (error) {
        console.error('Error fetching swipe history:', error);
        setError("Failed to fetch swipe history. Please try again later.");
      } else {
        console.log("Swipes fetched:", swipeData);
        setSwipes(swipeData as Swipe[]);
      }
    }
    fetchSwipes();
  }, [userId]);

  const handleUnswipe = async (swipeId: string) => {
    try {
      const { error } = await supabase
        .from('swipes')
        .delete()
        .eq('id', swipeId);
      if (error) {
        console.error('Error unswiping:', error);
      } else {
        setSwipes(swipes.filter((swipe) => swipe.id !== swipeId));
      }
    } catch (error) {
      console.error('Unexpected error during unswipe:', error);
    }
  };

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Swipe History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {swipes.length > 0 ? (
          swipes.map((swipe) => (
            <div key={swipe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={swipe.profiles.profile_image || '/default-avatar.png'}
                  alt={`${swipe.profiles.name}'s avatar`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{swipe.profiles.name}</h2>
                <p className="text-gray-600 mb-2">Swipe: {swipe.swipe_type}</p>
                <button
                  className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                  onClick={() => handleUnswipe(swipe.id)}
                >
                  Unswipe
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            <p>No swipe history found. (User ID: {userId || 'Not set'})</p>
          </div>
        )}
      </div>
    </div>
  );
}
