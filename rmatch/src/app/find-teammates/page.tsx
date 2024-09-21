'use client';

import { useState, useEffect } from 'react';
import ProfileCard from '../../components/ProfileCard';
import { supabase } from '../services/supabaseClient';

export default function FindTeammates() {
  const [profiles, setProfiles] = useState([]);
  const [courses, setCourses] = useState([]); // Store user's enrolled courses
  const [selectedCourse, setSelectedCourse] = useState(''); // Store selected course
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null); // Handle errors

  // Fetch the current user ID and their currently enrolled courses
  useEffect(() => {
    async function fetchUserAndCourses() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        setError('Error fetching user information.');
        return;
      }
      if (user) {
        setUserId(user.id);

        // Fetch the user's profile to get their currently enrolled courses
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('current_courses')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Error fetching profile.');
          return;
        }

        if (profileData.current_courses && profileData.current_courses.length > 0) {
          setCourses(profileData.current_courses); // Set courses the user is enrolled in
        } else {
          console.log('No courses found for user.');
          setError('You are not enrolled in any courses.');
        }
      }
    }

    fetchUserAndCourses();
  }, []);

  const fetchProfilesForCourse = async (course) => {
    if (!course || !userId) return;

    const { data: swipedProfiles, error: swipedError } = await supabase
      .from('swipes')
      .select('swiped_profile_id')
      .eq('swiper_id', userId);

    if (swipedError) {
      console.error('Error fetching swiped profiles:', swipedError);
      setError('Error fetching swiped profiles.');
      return;
    }

    const swipedProfileIds = swipedProfiles.map((swipe) => swipe.swiped_profile_id);

    const { data: profilesData, error } = await supabase
      .from('profiles')
      .select('*')
      .contains('current_courses', [course])
      .not('id', 'in', `(${swipedProfileIds.join(',')})`)
      .not('id', 'eq', userId);

    if (error) {
      console.error('Error fetching profiles:', error);
      setError('Error fetching profiles.');
      return;
    }

    setProfiles(profilesData);
    setCurrentProfileIndex(0); // Reset profile index when a new course is selected
  };

  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);
    fetchProfilesForCourse(selected);
  };

  // Define the handleSwipe function
  const handleSwipe = async (profileId, swipeType) => {
    if (!userId) return;

    console.log('Attempting to swipe: ', { profileId, swipeType, userId });

    try {
      // Insert the swipe into the swipes table
      const { error: swipeError } = await supabase
        .from('swipes')
        .insert([{ swiper_id: userId, swiped_profile_id: profileId, swipe_type }]);

      if (swipeError) {
        console.error('Error inserting swipe:', swipeError.message); // Log the error message
        setError('Error during swipe.');
        return;
      }

      // Move to the next profile
      setCurrentProfileIndex((prevIndex) => prevIndex + 1);
    } catch (err) {
      console.error('Unexpected error during swipe:', err); // Log any unexpected error
      setError('Unexpected error during swipe.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">Find a Teammate</h1>

      {/* Course Selection Dropdown */}
      {courses.length > 0 ? (
        <select
          className="border p-2 mb-6 rounded"
          value={selectedCourse}
          onChange={handleCourseChange}
        >
          <option value="">Select a course</option>
          {courses.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-600">You are not enrolled in any courses.</p>
      )}

      {/* Show selected course */}
      {selectedCourse && (
        <div className="mb-4 text-lg">
          <p className="font-bold text-gray-700">Currently finding teammates for: <span className="text-blue-600">{selectedCourse}</span></p>
        </div>
      )}

      {/* Render ProfileCard or show message if no profiles */}
      {selectedCourse && profiles.length === 0 && (
        <p>No profiles available for {selectedCourse}.</p>
      )}
      {selectedCourse && profiles.length > 0 && currentProfileIndex < profiles.length && (
        <ProfileCard profile={profiles[currentProfileIndex]} onSwipe={handleSwipe} />
      )}

      {/* Error Handling */}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
