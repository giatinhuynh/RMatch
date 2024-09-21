'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    profile_image: '',
    skills: '', // Will display as a comma-separated string
    desired_role: '',
    academic_program: '',
    work_preference: '',
    availability: '',
    current_courses: '', // Will display as a comma-separated string
    social_links: { linkedin: '', github: '' },
    interests: '', // Will display as a comma-separated string
    gender: '',
    gpa: '',
    age: '',
    birthday: '',
    student_id: '',
    nationality: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch the current user's profile data when the page loads
  useEffect(() => {
    async function fetchProfile() {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Error fetching user information.');
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        setError('Error fetching profile.');
        return;
      }

      // Convert array fields to comma-separated strings for display in the form
      setProfile({
        ...profileData,
        skills: profileData.skills ? profileData.skills.join(', ') : '',
        current_courses: profileData.current_courses ? profileData.current_courses.join(', ') : '',
        interests: profileData.interests ? profileData.interests.join(', ') : '',
      });
    }

    fetchProfile();
  }, []);

  // Update profile data in Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not logged in.');
      }

      // Convert comma-separated strings back to arrays
      const updatedProfile = {
        ...profile,
        skills: profile.skills ? profile.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : [],
        current_courses: profile.current_courses
          ? profile.current_courses.split(',').map((course) => course.trim()).filter(Boolean) // Handle courses as an array
          : [],
        interests: profile.interests
          ? profile.interests.split(',').map((interest) => interest.trim()).filter(Boolean)
          : [],
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updatedProfile,
        });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
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
        {/* Basic Info */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Basic Info</h2>
          <label className="block mb-2">Name:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.name || ''}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            required
          />

          <label className="block mb-2 mt-4">Bio:</label>
          <textarea
            className="w-full border p-2 rounded-md"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            required
          />

          <label className="block mb-2 mt-4">Profile Image URL:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.profile_image || ''}
            onChange={(e) => setProfile({ ...profile, profile_image: e.target.value })}
          />
        </div>

        {/* Additional Info */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Additional Info</h2>

          <label className="block mb-2">Gender:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.gender || ''}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          />

          <label className="block mb-2 mt-4">GPA:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="number"
            step="0.01"
            value={profile.gpa || ''}
            onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
          />

          <label className="block mb-2 mt-4">Age:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="number"
            value={profile.age || ''}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />

          <label className="block mb-2 mt-4">Birthday:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="date"
            value={profile.birthday || ''}
            onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
          />

          <label className="block mb-2 mt-4">Student ID:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.student_id || ''}
            onChange={(e) => setProfile({ ...profile, student_id: e.target.value })}
          />

          <label className="block mb-2 mt-4">Nationality:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.nationality || ''}
            onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
          />
        </div>

        {/* Academic & Work Details */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Academic & Work Details</h2>

          <label className="block mb-2">Academic Program:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.academic_program || ''}
            onChange={(e) => setProfile({ ...profile, academic_program: e.target.value })}
          />

          <label className="block mb-2 mt-4">Work Preference:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.work_preference || ''}
            onChange={(e) => setProfile({ ...profile, work_preference: e.target.value })}
          />

          <label className="block mb-2 mt-4">Availability:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.availability || ''}
            onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
          />

          <label className="block mb-2 mt-4">Current Courses (comma-separated):</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.current_courses || ''}
            onChange={(e) => setProfile({ ...profile, current_courses: e.target.value })}
          />
        </div>

        {/* Social Links */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Social Links</h2>

          <label className="block mb-2">LinkedIn:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.social_links.linkedin || ''}
            onChange={(e) => setProfile({
              ...profile,
              social_links: { ...profile.social_links, linkedin: e.target.value },
            })}
          />

          <label className="block mb-2 mt-4">GitHub:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.social_links.github || ''}
            onChange={(e) => setProfile({
              ...profile,
              social_links: { ...profile.social_links, github: e.target.value },
            })}
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mt-6">
          Save Profile
        </button>
      </form>
    </div>
  );
}
