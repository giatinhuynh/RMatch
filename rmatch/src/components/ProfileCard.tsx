'use client'; 

import { useState } from 'react';
import Image from 'next/image';

export default function ProfileCard({ profile, onSwipe }) {
  const [activeTab, setActiveTab] = useState(1); // Track which tab is active (1 = Basic Info, 2 = Outcome & Motivation, 3 = Academic & Work Details)

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-80">
      {/* Profile Picture */}
      <div className="relative w-full h-64">
        <Image
          src={profile.profile_image?.startsWith('http') ? profile.profile_image : `/images/${profile.profile_image || 'default-avatar.jpg'}`}
          alt={profile.name}
          layout="fill"
          objectFit="cover"
          onError={(e) => (e.target.src = '/images/default-avatar.jpg')}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 mt-4">
        <button className={`py-2 px-4 ${activeTab === 1 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab(1)}>
          Basic Info
        </button>
        <button className={`py-2 px-4 ${activeTab === 2 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab(2)}>
          Outcome & Motivation
        </button>
        <button className={`py-2 px-4 ${activeTab === 3 ? 'border-b-2 border-blue-500' : ''}`} onClick={() => setActiveTab(3)}>
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
              <strong>Academic Program:</strong> {profile.academic_program || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Nationality:</strong> {profile.nationality || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Gender:</strong> {profile.gender || 'Not specified'}
            </p>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <p className="text-gray-600">
              <strong>Outcome Preference:</strong> {profile.outcome_preference || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Motivation / Purpose:</strong> {profile.motivation || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Work Ethic:</strong> {profile.work_ethic || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Wants in a Team:</strong> {Array.isArray(profile.team_wants) ? profile.team_wants.join(', ') : 'No preferences specified'}
            </p>
          </div>
        )}

        {activeTab === 3 && (
          <div>
            <p className="text-gray-600">
              <strong>Academic Program:</strong> {profile.academic_program || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Work Preference:</strong> {profile.work_preference || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Availability:</strong> {profile.availability || 'Not specified'}
            </p>
            <p className="text-gray-600 mt-2">
              <strong>Current Courses:</strong> {Array.isArray(profile.current_courses) ? profile.current_courses.join(', ') : 'No courses specified'}
            </p>
          </div>
        )}
      </div>

      {/* Swiping Buttons */}
      <div className="flex justify-around mt-4 mb-4">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 transition"
          onClick={() => onSwipe(profile.id, 'dislike')}
        >
          &#10060; Swipe Left
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition"
          onClick={() => onSwipe(profile.id, 'like')}
        >
          &#10004; Swipe Right
        </button>
      </div>
    </div>
  );
}
