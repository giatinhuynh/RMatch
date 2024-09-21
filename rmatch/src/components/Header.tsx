"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/app/services/supabaseClient"; // Adjust the path if necessary
import logo from "@/app/img/logo.png"; // Adjust the path based on your project structure
import defaultAvatar from "@/app/img/avatar.png"; // Default avatar if no profile image

export default function Header() {
    const router = useRouter();
    const [profileImage, setProfileImage] = useState(null); // State to hold profile image URL
    const [error, setError] = useState('');

    // Fetch user profile image
    useEffect(() => {
        async function fetchProfileImage() {
            try {
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError || !user) {
                    setError("Error fetching user information.");
                    return;
                }

                // Fetch user's profile from 'profiles' table
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('profile_image')
                    .eq('id', user.id)
                    .single();

                if (profileError || !profileData) {
                    setError("Error fetching profile.");
                    return;
                }

                setProfileImage(profileData.profile_image || null); // Set profile image URL
            } catch (error) {
                console.error("Error fetching profile image:", error);
                setError("Unexpected error occurred.");
            }
        }

        fetchProfileImage();
    }, []);

    return (
        <header className="bg-white shadow p-1 px-3 flex justify-between items-center w-full h-[54px]">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => router.push("/find-teammates")}>
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
                        src={profileImage || defaultAvatar} // Use user's profile image if available, otherwise fallback to default avatar
                        alt="User Avatar"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </header>
    );
}
