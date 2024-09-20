// src/components/Header.tsx

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center w-full">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/path-to-logo.png" // Replace with your logo path
          alt="RMatch Logo"
          width={40}
          height={40}
        />
        <h1 className="ml-3 font-bold text-xl">RMATCH</h1>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center">
        {/* User Icon / Avatar */}
        <div className="relative h-10 w-10 rounded-full overflow-hidden">
          <Image
            src="/path-to-avatar.jpg" // Replace with the avatar image path
            alt="User Avatar"
            layout="fill"
            objectFit="cover"
            onClick={() => router.push('/profile')}
          />
        </div>
      </div>
    </header>
  );
}
