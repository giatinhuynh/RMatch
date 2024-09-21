"use client";

import { useState, useEffect } from "react";
import ProfileCard from "../../components/ProfileCard";
import { supabase } from "../services/supabaseClient";
import { useSpring, animated } from "react-spring";

export default function FindFriends() {
    const [profiles, setProfiles] = useState([]);
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);
    const [swipeAnimation, setSwipeAnimation] = useSpring(() => ({
        opacity: 1,
        transform: "translateX(0)",
    }));

    // Fetch user data and the profiles they have not swiped on
    useEffect(() => {
        async function fetchUserAndProfiles() {
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

                // Get swiped profiles to exclude them from the list
                const { data: swipedProfiles, error: swipedError } = await supabase
                    .from("swipes")
                    .select("swiped_profile_id")
                    .eq("swiper_id", user.id);

                if (swipedError) {
                    console.error("Error fetching swiped profiles:", swipedError);
                    setError("Error fetching swiped profiles.");
                    return;
                }

                const swipedProfileIds = swipedProfiles.map((swipe) => swipe.swiped_profile_id);

                // Fetch all profiles, excluding the current user and previously swiped profiles
                const { data: profilesData, error } = await supabase
                    .from("profiles")
                    .select("id, name, bio, profile_image, interests, availability, gender, academic_program") // Include fields relevant for finding friends
                    .not("id", "in", `(${swipedProfileIds.join(",")})`) // Exclude previously swiped profiles
                    .not("id", "eq", user.id); // Exclude the current user

                if (error) {
                    console.error("Error fetching profiles:", error);
                    setError("Error fetching profiles.");
                    return;
                }

                setProfiles(profilesData);
                setCurrentProfileIndex(0);
            }
        }

        fetchUserAndProfiles();
    }, []);

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
            <h1 className="mt-2 text-2xl font-extrabold mb-6 text-black">Find Friends</h1>

            {/* Display profile cards if available */}
            {profiles.length > 0 && currentProfileIndex < profiles.length ? (
                <animated.div
                    style={swipeAnimation}
                    className="flex flex-col items-center mb-4 w-full transition-transform duration-200"
                >
                    <ProfileCard profile={profiles[currentProfileIndex]} onSwipe={handleSwipe} />
                </animated.div>
            ) : (
                <p className="text-gray-200">No more profiles available to find friends.</p>
            )}

            {error && <p className="text-red-300">{error}</p>}
        </div>
    );
}
