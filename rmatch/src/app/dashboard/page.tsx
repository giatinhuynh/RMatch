// src/app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import ProfileCard from '../../components/ProfileCard';
import { supabase } from '../services/supabaseClient';

export default function Dashboard() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  
  useEffect(() => {
    async function fetchProfiles() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(10); // Limit to 10 profiles for now

      if (!error) setProfiles(data);
    }

    fetchProfiles();
  }, []);

  const handleSwipeLeft = () => {
    // Handle swipe left logic here (e.g., update database)
    setCurrentProfileIndex((prevIndex) => prevIndex + 1); // Move to next profile
  };

  const handleSwipeRight = () => {
    // Handle swipe right logic here (e.g., update database)
    setCurrentProfileIndex((prevIndex) => prevIndex + 1); // Move to next profile
  };

  if (profiles.length === 0) return <p>No profiles available</p>;
  if (currentProfileIndex >= profiles.length) return <p>No more profiles to show</p>;

  const currentProfile = profiles[currentProfileIndex];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">Find a Teammate</h1>

      {/* Render the ProfileCard */}
      <ProfileCard profile={currentProfile} />

      {/* Example swipe logic, adjust based on real needs */}
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg"
          onClick={handleSwipeLeft}
        >
          Swipe Left
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg"
          onClick={handleSwipeRight}
        >
          Swipe Right
        </button>
      </div>
    </div>
  );
}
