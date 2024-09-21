// src/app/find-teammates/page.tsx\

'use client';

import { useState, useEffect } from 'react';
import ProfileCard from '../../components/ProfileCard';
import { supabase } from '../services/supabaseClient';

export default function FindTeammates() {
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [courses, setCourses] = useState([]); // Store the list of courses
  const [selectedCourse, setSelectedCourse] = useState(''); // Store the selected course
  const [userId, setUserId] = useState(null); // Current user ID
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Fetch the current user's ID
    async function fetchUser() {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching user:', userError);
          setError('Error fetching user information.');
          return;
        }
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error('Unexpected error fetching user:', err);
        setError('Unexpected error fetching user information.');
      }
    }

    fetchUser();
  }, []);

  // Fetch courses and profiles logic (same as before)
  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data, error } = await supabase.from('profiles').select('current_courses');
        if (error) {
          console.error('Error fetching courses:', error);
          setError('Error fetching courses.');
          return;
        }
        const uniqueCourses = [...new Set(data.flatMap(profile => profile.current_courses))];
        setCourses(uniqueCourses);
      } catch (err) {
        console.error('Unexpected error fetching courses:', err);
        setError('Unexpected error fetching courses.');
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    async function fetchProfiles() {
      if (!selectedCourse || !userId) return;
      try {
        // Fetch profiles that are in the selected course and have not been swiped by the current user
        const { data: swipedProfiles, error: swipedError } = await supabase
          .from('swipes')
          .select('swiped_profile_id')
          .eq('swiper_id', userId);

        if (swipedError) {
          console.error('Error fetching swiped profiles:', swipedError);
          setError('Error fetching swiped profiles.');
          return;
        }

        const swipedProfileIds = swipedProfiles.map(swipe => swipe.swiped_profile_id);

        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .contains('current_courses', [selectedCourse])
          .not('id', 'in', `(${swipedProfileIds.join(',')})`) // Exclude swiped profiles
          .limit(10);

        if (error) {
          console.error('Error fetching profiles:', error);
          setError('Error fetching profiles.');
          return;
        }

        setProfiles(profiles);
      } catch (err) {
        console.error('Unexpected error fetching profiles:', err);
        setError('Unexpected error fetching profiles.');
      }
    }
    fetchProfiles();
  }, [selectedCourse, userId]);

  // Handle swipe logic
  const handleSwipe = async (profileId, swipeType) => {
    if (!userId) return;

    try {
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert([
          { swiper_id: userId, swiped_profile_id: profileId, swipe_type: swipeType }
        ]);

      if (swipeError) {
        console.error('Error inserting swipe:', swipeError);
        setError('Error registering swipe.');
        return;
      }

      // Move to the next profile
      setCurrentProfileIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error('Unexpected error processing swipe:', err);
      setError('Unexpected error processing swipe.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">Find a Teammate</h1>

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Course Selection Dropdown */}
      <select
        className="border p-2 mb-6 rounded"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select a course</option>
        {courses.map((course, index) => (
          <option key={index} value={course}>
            {course}
          </option>
        ))}
      </select>

      {/* Display Profiles */}
      {profiles.length > 0 && currentProfileIndex < profiles.length ? (
        <ProfileCard profile={profiles[currentProfileIndex]} />
      ) : (
        <p>No profiles found for this course.</p>
      )}

      {/* Swiping Buttons */}
      {profiles.length > 0 && currentProfileIndex < profiles.length && (
        <div className="mt-4 flex space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-6 rounded-lg"
            onClick={() => handleSwipe(profiles[currentProfileIndex].id, 'dislike')}
          >
            Swipe Left
          </button>
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg"
            onClick={() => handleSwipe(profiles[currentProfileIndex].id, 'like')}
          >
            Swipe Right
          </button>
        </div>
      )}
    </div>
  );
}
