// src/components/Navbar.tsx

'use client';

import { useRouter } from 'next/navigation';

const navItems = [
  { name: 'Find Teammates', path: '/dashboard', icon: '⭐' },
  { name: 'Find Friends', path: '/find-friends', icon: '👤' },
  { name: 'Matches', path: '/matches', icon: '❤️' },
  { name: 'Messages', path: '/messages', icon: '💬' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
  { name: 'Profile', path: '/profile', icon: '👤' }
];

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="bg-gray-100 w-64 h-screen flex flex-col">
      <ul className="mt-10">
        {navItems.map((item, index) => (
          <li
            key={index}
            className={`flex items-center py-3 px-6 hover:bg-red-500 hover:text-white cursor-pointer ${
              router.pathname === item.path ? 'bg-red-500 text-white' : ''
            }`}
            onClick={() => router.push(item.path)}
          >
            <span className="mr-4">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
}
