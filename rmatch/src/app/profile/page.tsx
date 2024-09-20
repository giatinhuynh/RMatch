'use client';

import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    profile_image: '',
    skills: '',
    desired_role: '',
    academic_program: '',
    work_preference: '',
    availability: '',
    current_courses: '',
    social_links: { linkedin: '', github: '' },
    interests: '',
    location: '',
    languages: '',
    preferred_project_type: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Reset error state
    setSuccess(false); // Reset success state
    
    try {
      // Get the currently authenticated user in Supabase v2.x
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
  
      if (authError) {
        throw new Error('Could not retrieve user: ' + authError.message);
      }
  
      if (!user) {
        throw new Error('User not logged in.');
      }
  
      // Try upserting the data to the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,  // User's ID should be linked correctly
          ...profile, // Spread the profile state object
          skills: profile.skills.split(','), // Convert skills to array
          current_courses: profile.current_courses.split(','), // Convert courses to array
          interests: profile.interests.split(','), // Convert interests to array
          languages: profile.languages.split(','), // Convert languages to array
        });
  
      if (error) {
        setError(error.message); // Display the exact error message from Supabase
        return;
      }
  
      setSuccess(true);
      router.push('/profile'); // Redirect to profile page on success
    } catch (err) {
      setError(err.message || 'An error occurred while saving the profile.');
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Profile updated successfully!</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
          <label className="block mb-2">Name:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <label className="block mb-2 mt-4">Bio:</label>
          <textarea
            className="w-full border p-2 rounded-md"
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            required
          />

          <label className="block mb-2 mt-4">Profile Image URL:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.profile_image}
            onChange={(e) => setProfile({ ...profile, profile_image: e.target.value })}
          />
        </div>

        {/* Skills & Interests Section */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Skills & Interests</h2>
          <label className="block mb-2">Skills (comma-separated):</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
          />

          <label className="block mb-2 mt-4">Desired Role:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.desired_role}
            onChange={(e) => setProfile({ ...profile, desired_role: e.target.value })}
          />

          <label className="block mb-2 mt-4">Interests (comma-separated):</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.interests}
            onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
          />
        </div>

        {/* Academic & Work Section */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Academic & Work Details</h2>
          <label className="block mb-2">Academic Program:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.academic_program}
            onChange={(e) => setProfile({ ...profile, academic_program: e.target.value })}
          />

          <label className="block mb-2 mt-4">Work Preference:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.work_preference}
            onChange={(e) => setProfile({ ...profile, work_preference: e.target.value })}
          />

          <label className="block mb-2 mt-4">Availability:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.availability}
            onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
          />

          <label className="block mb-2 mt-4">Current Courses (comma-separated):</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.current_courses}
            onChange={(e) => setProfile({ ...profile, current_courses: e.target.value })}
          />
        </div>

        {/* Social Links & Location */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Social Links & Location</h2>
          <label className="block mb-2">LinkedIn:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.social_links.linkedin}
            onChange={(e) =>
              setProfile({
                ...profile,
                social_links: { ...profile.social_links, linkedin: e.target.value },
              })
            }
          />

          <label className="block mb-2 mt-4">GitHub:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.social_links.github}
            onChange={(e) =>
              setProfile({
                ...profile,
                social_links: { ...profile.social_links, github: e.target.value },
              })
            }
          />

          <label className="block mb-2 mt-4">Location:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.location}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          />

          <label className="block mb-2 mt-4">Languages Spoken (comma-separated):</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.languages}
            onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
          />

          <label className="block mb-2 mt-4">Preferred Project Type:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.preferred_project_type}
            onChange={(e) =>
              setProfile({ ...profile, preferred_project_type: e.target.value })
            }
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mt-6">
          Save Profile
        </button>
      </form>
    </div>
  );
}
