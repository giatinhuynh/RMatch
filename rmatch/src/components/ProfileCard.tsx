// src/components/ProfileCard.tsx

import { useState } from 'react';
import Image from 'next/image';

export default function ProfileCard({ profile }) {
  const [activeTab, setActiveTab] = useState(1); // Track which tab is active (1 = Basic Info, 2 = Outcome & Motivation, 3 = Academic & Work Details)

  // Ensure the profile image has a valid path
  const profileImageSrc = profile.profile_image?.startsWith('http') 
    ? profile.profile_image 
    : `/images/${profile.profile_image || 'default-avatar.jpg'}`;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-80">
      {/* Profile Picture */}
      <div className="relative w-full h-64">
        <Image
          src={profileImageSrc} // Use a valid URL or relative path with a leading slash
          alt={profile.name}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mt-4">
        <button
          className={`py-2 px-4 ${activeTab === 1 ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Basic Info
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 2 ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          Outcome & Motivation
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 3 ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab(3)}
        >
          Academic & Work Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {activeTab === 1 && (
          <div>
            <h2 className="text-xl font-semibold">{profile.name}</h2>
            <p className="text-gray-600">{profile.bio}</p>
            <p className="text-gray-600 mt-2">
              <strong>Academic Program:</strong> {profile.academic_program}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Nationality:</strong> {profile.nationality}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Gender:</strong> {profile.gender}
            </p>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <p className="text-gray-600">
              <strong>Outcome Preference:</strong> {profile.outcome_preference}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Motivation / Purpose:</strong> {profile.motivation}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Work Ethic:</strong> {profile.work_ethic}
            </p>
            <p className="text-gray-600 mt-2">
              {/* Safely check if team_wants exists and is an array */}
              <strong>Wants in a Team:</strong> {Array.isArray(profile.team_wants) ? profile.team_wants.join(', ') : 'No preferences specified'}
            </p>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <p className="text-gray-600">
              <strong>Academic Program:</strong> {profile.academic_program}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Work Preference:</strong> {profile.work_preference}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Availability:</strong> {profile.availability}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Current Courses:</strong> {profile.current_courses.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Swiping Buttons */}
      <div className="flex justify-around mt-4 mb-4">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
          onClick={() => console.log('Swiped Left')} // Replace with actual swipe left logic
        >
          &#10060;
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition"
          onClick={() => console.log('Swiped Right')} // Replace with actual swipe right logic
        >
          &#10004;
        </button>
      </div>
    </div>
  );
}
