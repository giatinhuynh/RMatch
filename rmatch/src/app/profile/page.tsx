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
    gender: '',
    gpa: '',
    age: '',
    birthday: '',
    student_id: '',
    nationality: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not logged in.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          bio: profile.bio,
          profile_image: profile.profile_image,
          skills: profile.skills.split(','), // Convert to array
          desired_role: profile.desired_role,
          academic_program: profile.academic_program,
          work_preference: profile.work_preference,
          availability: profile.availability,
          current_courses: profile.current_courses.split(','), // Convert to array
          social_links: profile.social_links, // Store as JSON
          interests: profile.interests.split(','), // Convert to array
          gender: profile.gender,
          gpa: parseFloat(profile.gpa), // Parse GPA to a float
          age: parseInt(profile.age), // Parse age to an integer
          birthday: profile.birthday, // Date in YYYY-MM-DD format
          student_id: profile.student_id,
          nationality: profile.nationality,
        });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);
      router.push('/profile'); // Redirect or refresh profile page on success
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

        {/* Additional Info */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Additional Info</h2>

          <label className="block mb-2">Gender:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
          />

          <label className="block mb-2 mt-4">GPA:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="number"
            step="0.01"
            value={profile.gpa}
            onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
          />

          <label className="block mb-2 mt-4">Age:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="number"
            value={profile.age}
            onChange={(e) => setProfile({ ...profile, age: e.target.value })}
          />

          <label className="block mb-2 mt-4">Birthday:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="date"
            value={profile.birthday}
            onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
          />

          <label className="block mb-2 mt-4">Student ID:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.student_id}
            onChange={(e) => setProfile({ ...profile, student_id: e.target.value })}
          />

          <label className="block mb-2 mt-4">Nationality:</label>
          <input
            className="w-full border p-2 rounded-md"
            type="text"
            value={profile.nationality}
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

        {/* Social Links */}
        <div className="bg-white p-4 shadow-sm rounded-md">
          <h2 className="text-lg font-semibold mb-2">Social Links</h2>

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
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md mt-6">
          Save Profile
        </button>
      </form>
    </div>
  );
}
