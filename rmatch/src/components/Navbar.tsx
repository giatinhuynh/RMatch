"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const TeammateIcon = ({ color = "currentColor", ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill={color}>
        <path
            fill="currentColor"
            d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
        />
    </svg>
);

const SwipeIcon = ({ color = "currentColor", ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={color}>
        <path
            fill="currentColor"
            d="M32 32l448 0c17.7 0 32 14.3 32 32l0 32c0 17.7-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96L0 64C0 46.3 14.3 32 32 32zm0 128l448 0 0 256c0 35.3-28.7 64-64 64L96 480c-35.3 0-64-28.7-64-64l0-256zm128 80c0 8.8 7.2 16 16 16l160 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-160 0c-8.8 0-16 7.2-16 16z"
        />
    </svg>
);

const FriendIcon = ({ color = "currentColor", ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill={color}>
        <path
            fill="currentColor"
            d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM609.3 512l-137.8 0c5.4-9.4 8.6-20.3 8.6-32l0-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2l61.4 0C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"
        />
    </svg>
);

const MatchIcon = ({ color = "currentColor", ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill={color}>
        <path
            fill="currentColor"
            d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
        />
    </svg>
);

const ProfileIcon = ({ color = "currentColor", ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill={color}>
        <path
            fill="currenColor"
            d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm80 256l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16L80 384c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zm256-32l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
        />
    </svg>
);

export default function Navbar() {
    const router = useRouter();

    const navItems = [
        { name: "Find Teammates", path: "/find-teammates", icon: TeammateIcon },
        { name: "Find Friends", path: "/find-friends", icon: FriendIcon },
        { name: "Swipe History", path: "/swipe-history", icon: SwipeIcon },
        { name: "Matches", path: "/matches", icon: MatchIcon },
        { name: "Profile", path: "/profile", icon: ProfileIcon },
    ];

    return (
        <nav className="bg-gray-100 w-64 h-screen flex flex-col" style={{ height: "calc(100vh - 54px)" }}>
            <ul className="mt-10">
                {navItems.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <li
                            key={index}
                            className={`flex items-center py-3 px-6 text-black hover:text-[#E60028] cursor-pointer ${
                                router.pathname === item.path ? "font-bold" : ""
                            }`}
                            onClick={() => router.push(item.path)}>
                            <div className="mr-4">
                                {typeof Icon === "string" ? (
                                    <Image src={Icon} alt={`${item.name} Icon`} className="w-6 h-6 rounded-full" />
                                ) : (
                                    <Icon color={router.pathname === item.path ? "#E60028" : "currentColor"} width={24} height={24} />
                                )}
                            </div>
                            {item.name}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
