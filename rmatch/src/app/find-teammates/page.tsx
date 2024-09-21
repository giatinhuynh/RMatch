"use client";
import { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard";
import { supabase } from "../services/supabaseClient";
import { useSpring, animated } from "react-spring";

export default function FindTeammates() {
    const [profiles, setProfiles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track if the dropdown is open
    const [swipeAnimation, setSwipeAnimation] = useSpring(() => ({
        opacity: 1,
        transform: "translateX(0)",
    }));

    // Fetch user data and their current courses
    useEffect(() => {
        async function fetchUserAndCourses() {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();
            if (userError) {
                console.error("Error fetching user:", userError);
                setError("Error fetching user information.");
                return;
            }
            if (user) {
                setUserId(user.id);

                const { data: profileData, error: profileError } = await supabase
                    .from("profiles")
                    .select("current_courses")
                    .eq("id", user.id)
                    .single();

                if (profileError) {
                    console.error("Error fetching profile:", profileError);
                    setError("Error fetching profile.");
                    return;
                }

                setCourses(profileData.current_courses || []);
            }
        }

        fetchUserAndCourses();
    }, []);

    // Fetch profiles for a given course
    const fetchProfilesForCourse = async (course) => {
        if (!course || !userId) return;

        // Get swiped profiles to exclude them
        const { data: swipedProfiles, error: swipedError } = await supabase
            .from("swipes")
            .select("swiped_profile_id")
            .eq("swiper_id", userId);
        if (swipedError) {
            console.error("Error fetching swiped profiles:", swipedError);
            setError("Error fetching swiped profiles.");
            return;
        }

        const swipedProfileIds = swipedProfiles.map((swipe) => swipe.swiped_profile_id);

        // Fetch profiles that match the course and exclude swiped profiles and the current user
        const { data: profilesData, error } = await supabase
            .from("profiles")
            .select("id, name, bio, profile_image, gender, nationality, academic_program, work_preference, availability, current_courses, outcome_preference, motivation, work_ethic, team_wants") // Fetch all required fields
            .contains("current_courses", [course])
            .not("id", "in", `(${swipedProfileIds.join(",")})`)
            .not("id", "eq", userId);

        if (error) {
            console.error("Error fetching profiles:", error);
            setError("Error fetching profiles.");
            return;
        }

        setProfiles(profilesData);
        setCurrentProfileIndex(0);
    };

    // Handle course change
    const handleCourseChange = (e) => {
        const selected = e.target.value;
        setSelectedCourse(selected);
        fetchProfilesForCourse(selected);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    // Handle swipe logic (left or right)
    const handleSwipe = async (profileId, swipeType) => {
        if (!userId) return;

        // Trigger swipe animation
        setSwipeAnimation({
            opacity: 0,
            transform: swipeType === "right" ? "translateX(100%)" : "translateX(-100%)",
        });

        // Wait for animation to finish before updating the profile index
        await new Promise((resolve) => setTimeout(resolve, 300));

        try {
            // Insert swipe record into the database
            const { error: swipeError } = await supabase
                .from("swipes")
                .insert([{ swiper_id: userId, swiped_profile_id: profileId, swipe_type: swipeType }]);

            if (swipeError) {
                console.error("Error inserting swipe:", swipeError);
                setError("Error during swipe.");
                return;
            }

            setCurrentProfileIndex((prevIndex) => prevIndex + 1);
        } catch (err) {
            console.error("Unexpected error processing swipe:", err);
            setError("Unexpected error processing swipe.");
        }

        // Reset animation
        setSwipeAnimation({ opacity: 1, transform: "translateX(0)" });
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-r from-red-500 to-blue-700 rounded-md"
            style={{ height: "calc(100vh - 54px)" }}
        >
            <h1 className="mt-2 text-2xl font-extrabold mb-6 text-black">Find a Teammate</h1>

            {/* Course Dropdown */}
            {courses.length > 0 ? (
                <div className="relative mb-4">
                    <select
                        className="appearance-none w-full bg-white outline-none border-none text-gray-700 py-3 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ease-in-out duration-200"
                        value={selectedCourse}
                        onChange={handleCourseChange}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown open/close
                        onBlur={() => setIsDropdownOpen(false)} // Close dropdown when it loses focus
                    >
                        <option value="" disabled>
                            Select a course
                        </option>
                        {courses.map((course, index) => (
                            <option key={index} value={course}>
                                {course}
                            </option>
                        ))}
                    </select>

                    {/* Arrow Icon */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg
                            className={`fill-current h-5 w-5 text-gray-500 transition-transform duration-300 ${
                                isDropdownOpen ? "rotate-180" : "rotate-0"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                    </div>
                </div>
            ) : (
                <p className="text-gray-200">You are not enrolled in any courses.</p>
            )}

            {!selectedCourse && courses.length > 0 && <p className="text-gray-200">Please select a course to find teammates.</p>}

            {selectedCourse && profiles.length === 0 && <p className="text-gray-200">No profiles available for {selectedCourse}.</p>}

            {/* Display profile cards if available */}
            {selectedCourse && profiles.length > 0 && currentProfileIndex < profiles.length && (
                <animated.div
                    style={swipeAnimation}
                    className="flex flex-col items-center mb-4 w-full transition-transform duration-200"
                >
                    <ProfileCard profile={profiles[currentProfileIndex]} onSwipe={handleSwipe} />
                </animated.div>
            )}

            {error && <p className="text-red-300">{error}</p>}
        </div>
    );
}
