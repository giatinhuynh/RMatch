"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/app/img/logo.png"; // Adjust the path based on your project structure
import avatar from "@/app/img/avatar.png"; // Adjust the path based on your project structure

export default function Header() {
    const router = useRouter();

    return (
        <header className="bg-white shadow p-1 px-3 flex justify-between items-center w-full h-[54px]">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => router.push("/")}>
                <Image
                    src={logo} // Use imported image
                    alt="RMatch Logo"
                    width={140}
                    height={60}
                />
            </div>

            {/* User Profile Section */}
            <div className="flex items-center">
                {/* Notification Icon */}
                <button className="mr-5 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 17h5l-1.405-1.405C18.2 14.533 18 13.767 18 13V8.5a5.5 5.5 0 10-11 0V13c0 .767-.2 1.533-.595 2.595L5 17h10zM9.5 20h5a1.5 1.5 0 01-3 0h-2z"
                        />
                    </svg>
                </button>

                {/* User Icon / Avatar */}
                <div className="relative h-10 w-10 rounded-full overflow-hidden cursor-pointer" onClick={() => router.push("/profile")}>
                    <Image
                        src={avatar} // Use imported image
                        alt="User Avatar"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
