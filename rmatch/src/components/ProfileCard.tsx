// src/components/ProfileCard.tsx

import Image from 'next/image';

export default function ProfileCard() {
  // Example profile data (hardcoded)
  const profile = {
    name: 'Jane Doe',
    age: 24,
    profile_image: '/default-avatar.jpg', // You can replace this with an actual image URL
    bio: 'I am a Computer Science major with a passion for frontend development and AI.',
    academic_program: 'Computer Science',
    skills: ['JavaScript', 'React', 'AI', 'Data Science'],
    current_courses: ['CS101', 'CS201', 'AI Research'],
    work_preference: 'Remote',
    availability: 'Part-time',
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-80">
      {/* Profile Picture */}
      <div className="relative w-full h-64">
        <Image
          src={profile.profile_image || '/default-avatar.jpg'} // Default profile picture
          alt={profile.name}
          layout="fill"
          objectFit="cover"
        />
      </div>

      {/* Profile Information */}
      <div className="p-4">
        <h2 className="text-xl font-semibold">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-gray-600">{profile.academic_program}</p>
        <p className="text-gray-600 mt-2">{profile.bio}</p>
        <p className="text-gray-600 mt-2">
          <strong>Skills:</strong> {profile.skills.join(', ')}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Courses:</strong> {profile.current_courses.join(', ')}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Work Preference:</strong> {profile.work_preference}
        </p>
        <p className="text-gray-600 mt-2">
          <strong>Availability:</strong> {profile.availability}
        </p>
      </div>
    </div>
  );
}
