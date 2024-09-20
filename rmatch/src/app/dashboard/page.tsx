// src/app/dashboard/page.tsx

import ProfileCard from '../../components/ProfileCard';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">Find a Teammate</h1>

      {/* Render the ProfileCard */}
      <ProfileCard />

      {/* Example buttons for swipe actions */}
      <div className="mt-4 flex space-x-4">
        <button
          className="bg-red-500 text-white py-2 px-6 rounded-lg"
        >
          Swipe Left
        </button>
        <button
          className="bg-green-500 text-white py-2 px-6 rounded-lg"
        >
          Swipe Right
        </button>
      </div>
    </div>
  );
}
