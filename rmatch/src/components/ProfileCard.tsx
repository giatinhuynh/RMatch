"use client";

import { useState } from "react";
import Image from "next/image";
import avatar from "./../app/img/avatar.png"; // Default avatar if no image is available

export default function ProfileCard({ profile, onSwipe }) {
    const [activeTab, setActiveTab] = useState(1); // Track which tab is active (1 = Basic Info, 2 = Outcome & Motivation, 3 = Academic & Work Details)

    return (
        <div className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden w-[390px] h-[510px] relative">
            {/* Profile Picture */}
            <div className="w-full h-[200px] relative">
                <Image
                    src={profile.profile_image?.startsWith("http") ? profile.profile_image : avatar} // Use avatar if no profile image
                    alt={profile.name}
                    layout="fill"
                    className="object-cover z-10"
                    onError={(e) => (e.currentTarget.src = avatar)} // Fallback to default avatar if image fails to load
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 mt-4 px-4">
                <button className={`text-gray-700 py-2 px-1 ${activeTab === 1 ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab(1)}>
                    Basic Info
                </button>
                <button className={`text-gray-700 py-2 px-1 ${activeTab === 2 ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab(2)}>
                    Outcome & Motivation
                </button>
                <button className={`text-gray-700 py-2 px-1 ${activeTab === 3 ? "border-b-2 border-blue-500" : ""}`} onClick={() => setActiveTab(3)}>
                    Academic & Work Details
                </button>
            </div>

            {/* Tab Content */}
            <div className="p-4">
                {activeTab === 1 && (
                    <div>
                        <pre className="text-gray-700 text-lg font-semibold">{"Name: " + profile.name + "     Bio: " + profile.bio}</pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Academic Program:</strong> {profile.academic_program || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Nationality:</strong> {profile.nationality || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Gender:</strong> {profile.gender || "Not specified"}
                        </pre>
                    </div>
                )}

                {activeTab === 2 && (
                    <div>
                        <pre className="text-gray-600">
                            <strong>Outcome Preference:</strong> {profile.outcome_preference || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Motivation / Purpose:</strong> {profile.motivation || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Work Ethic:</strong> {profile.work_ethic || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Wants in a Team:</strong> {Array.isArray(profile.team_wants) ? profile.team_wants.join(", ") : "No preferences specified"}
                        </pre>
                    </div>
                )}

                {activeTab === 3 && (
                    <div>
                        <pre className="text-gray-600">
                            <strong>Academic Program:</strong> {profile.academic_program || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Work Preference:</strong> {profile.work_preference || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Availability:</strong> {profile.availability || "Not specified"}
                        </pre>
                        <pre className="text-gray-600 mt-2">
                            <strong>Current Courses:</strong>{" "}
                            {Array.isArray(profile.current_courses) ? profile.current_courses.join(", ") : "No courses specified"}
                        </pre>
                    </div>
                )}
            </div>

            {/* Swiping Buttons */}
            <div className="flex justify-around mt-4 mb-4">
                <button
                    className="flex items-center bg-red-600 text-white py-2 px-6 rounded-full hover:bg-red-700 transition duration-200 ease-in-out shadow-md transform hover:scale-105"
                    onClick={() => onSwipe(profile.id, "dislike")}
                >
                    <span className="mr-2">&#10060;</span>
                    Swipe Left
                </button>
                <button
                    className="flex items-center bg-green-600 text-white py-2 px-6 rounded-full hover:bg-green-700 transition duration-200 ease-in-out shadow-md transform hover:scale-105"
                    onClick={() => onSwipe(profile.id, "like")}
                >
                    <span className="mr-2">&#10004;</span>
                    Swipe Right
                </button>
            </div>
        </div>
    );
}
