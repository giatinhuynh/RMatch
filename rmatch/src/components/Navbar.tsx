// src/components/Navbar.tsx

"use client";

import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component
import TeammateIcon from "@/app/icons/teammates.svg"; // Original icon path
import FriendIcon from "@/app/icons/friend.svg";
import MatchIcon from "@/app/icons/match.svg";
import MessageIcon from "@/app/icons/message.svg";
import SettingsIcon from "@/app/icons/settings.svg";
import ProfileIcon from "@/app/img/avatar.png";

const navItems = [
    { name: "Find Teammates", path: "/dashboard", icon: TeammateIcon },
    { name: "Find Friends", path: "/find-friends", icon: FriendIcon },
    { name: "Matches", path: "/matches", icon: MatchIcon },
    { name: "Messages", path: "/messages", icon: MessageIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
    { name: "Profile", path: "/profile", icon: ProfileIcon, isProfile: true }, // Add flag to identify Profile
];

export default function Navbar() {
    const router = useRouter();

    return (
        <nav className="bg-gray-100 w-64 h-screen flex flex-col" style={{ height: "calc(100vh - 54px)" }}>
            <ul className="mt-10">
                {navItems.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center py-3 px-6 text-black hover:text-[#E60028] cursor-pointer ${
                            router.pathname === item.path ? "font-bold" : ""
                        }`}
                        onClick={() => router.push(item.path)}>
                        <div className={`mr-4 ${item.isProfile ? "rounded-full overflow-hidden" : ""}`}>
                            <Image
                                src={item.icon}
                                alt={`${item.name} Icon`}
                                width={24}
                                height={24}
                                className={`fill-current transition-all duration-200 ${item.isProfile ? "rounded-full" : ""}`}
                            />
                        </div>
                        {item.name}
                    </li>
                ))}
            </ul>
        </nav>
    );
}
