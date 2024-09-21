'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const ProfileSection = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h2 className="text-2xl font-semibold mb-4">{title}</h2>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder = "" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
    />
  </div>
);

export default function Profile() {
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeStep = (step) => {
    setSuccess(false);
    setCurrentStep(step);
  };

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

      setProfile({
        ...profileData,
        skills: profileData.skills ? profileData.skills.join(', ') : '',
        current_courses: profileData.current_courses ? profileData.current_courses.join(', ') : '',
        interests: profileData.interests ? profileData.interests.join(', ') : '',
      });
    }

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure form submission only happens on step 3
    if (currentStep !== 3) {
      e.preventDefault(); // Prevent submission on any step other than 3
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not logged in.');
      }
  
      const updatedProfile = {
        ...profile,
        skills: profile.skills ? profile.skills.split(',').map((skill) => skill.trim()).filter(Boolean) : [],
        current_courses: profile.current_courses
          ? profile.current_courses.split(',').map((course) => course.trim()).filter(Boolean)
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <ProfileSection title="Basic Information">
      <InputField
        label="Name"
        value={profile.name || ''}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        placeholder="Enter your full name"
      />
      <TextAreaField
        label="Bio"
        value={profile.bio || ''}
        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        placeholder="Tell us about yourself"
      />
      <InputField
        label="Profile Image URL"
        value={profile.profile_image || ''}
        onChange={(e) => setProfile({ ...profile, profile_image: e.target.value })}
        placeholder="Enter the URL of your profile image"
      />
      <InputField
        label="Gender"
        value={profile.gender || ''}
        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
        placeholder="Enter your gender"
      />
      <InputField
        label="Age"
        type="number"
        value={profile.age || ''}
        onChange={(e) => setProfile({ ...profile, age: e.target.value })}
        placeholder="Enter your age"
      />
      <InputField
        label="Birthday"
        type="date"
        value={profile.birthday || ''}
        onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
      />
      <InputField
        label="Nationality"
        value={profile.nationality || ''}
        onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
        placeholder="Enter your nationality"
      />
    </ProfileSection>
  );

  const renderStep2 = () => (
    <ProfileSection title="Academic & Work Information">
      <InputField
        label="Academic Program"
        value={profile.academic_program || ''}
        onChange={(e) => setProfile({ ...profile, academic_program: e.target.value })}
        placeholder="Enter your academic program"
      />
      <InputField
        label="Student ID"
        value={profile.student_id || ''}
        onChange={(e) => setProfile({ ...profile, student_id: e.target.value })}
        placeholder="Enter your student ID"
      />
      <InputField
        label="GPA"
        type="number"
        step="0.01"
        value={profile.gpa || ''}
        onChange={(e) => setProfile({ ...profile, gpa: e.target.value })}
        placeholder="Enter your GPA"
      />
      <InputField
        label="Current Courses"
        value={profile.current_courses || ''}
        onChange={(e) => setProfile({ ...profile, current_courses: e.target.value })}
        placeholder="Enter your current courses (comma-separated)"
      />
      <InputField
        label="Skills"
        value={profile.skills || ''}
        onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
        placeholder="Enter your skills (comma-separated)"
      />
      <InputField
        label="Desired Role"
        value={profile.desired_role || ''}
        onChange={(e) => setProfile({ ...profile, desired_role: e.target.value })}
        placeholder="Enter your desired role"
      />
      <InputField
        label="Work Preference"
        value={profile.work_preference || ''}
        onChange={(e) => setProfile({ ...profile, work_preference: e.target.value })}
        placeholder="Enter your work preference"
      />
      <InputField
        label="Availability"
        value={profile.availability || ''}
        onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
        placeholder="Enter your availability"
      />
    </ProfileSection>
  );

  const renderStep3 = () => (
    <ProfileSection title="Additional Information">
      <InputField
        label="Interests"
        value={profile.interests || ''}
        onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
        placeholder="Enter your interests (comma-separated)"
      />
      <InputField
        label="LinkedIn Profile"
        value={profile.social_links.linkedin || ''}
        onChange={(e) => setProfile({
          ...profile,
          social_links: { ...profile.social_links, linkedin: e.target.value },
        })}
        placeholder="Enter your LinkedIn profile URL"
      />
      <InputField
        label="GitHub Profile"
        value={profile.social_links.github || ''}
        onChange={(e) => setProfile({
          ...profile,
          social_links: { ...profile.social_links, github: e.target.value },
        })}
        placeholder="Enter your GitHub profile URL"
      />
    </ProfileSection>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">Profile updated successfully!</p>}

      <div className="mb-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      <div className="flex-grow text-right">
        {currentStep > 1 && (
          <button
            type="button" // Change to "button" to prevent form submission
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => changeStep(currentStep - 1)}
          >
            Previous
          </button>
        )}
        {currentStep < 3 ? (
          <button
            type="button" // Change to "button" to prevent form submission
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => changeStep(currentStep + 1)}
          >
            Next
          </button>
        ) : (
          <button
            type="submit" // Keep this as "submit" to allow form submission
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </button>
        )}
      </div>
    </form>
  );
}
