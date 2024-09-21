"use client";

import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useRouter } from "next/navigation"; // To navigate to the chat page

interface Profile {
    id: string;
    name: string;
    profile_image: string;
}

interface Match {
    swiped_profile_id: string;
    profiles: Profile[]; // Changed profiles to an array of Profile objects
}

export default function Matches() {
    const [matches, setMatches] = useState<Match[]>([]); // Define the structure of matches explicitly
    const [userId, setUserId] = useState<string | null>(null); // Set userId as string | null
    const [error, setError] = useState<string | null>(null); // Allow error to be string or null
    const router = useRouter();

    // Fetch user information
    useEffect(() => {
        async function fetchUser() {
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
            }
        }

        fetchUser();
    }, []);

    // Fetch matches for the user
    useEffect(() => {
        async function fetchMatches() {
            if (!userId) return;

            try {
                // Step 1: Fetch IDs of profiles that swiped right on the current user
                const { data: swipedOnMeData, error: swipedOnMeError } = await supabase
                    .from("swipes")
                    .select("swiper_id")
                    .eq("swiped_profile_id", userId)
                    .eq("swipe_type", "like");

                if (swipedOnMeError) {
                    console.error("Error fetching profiles who swiped on me:", swipedOnMeError);
                    setError("Error fetching swipes.");
                    return;
                }

                const swipedOnMeIds = swipedOnMeData.map((swipe) => swipe.swiper_id);

                // Step 2: Fetch profiles that the current user swiped right on and are in the swipedOnMe list
                const { data: matchesData, error: matchesError } = await supabase
                    .from("swipes")
                    .select(`
                        swiped_profile_id, 
                        swiper_id, 
                        swipe_type, 
                        profiles!swiped_profile_id_fkey(id, name, profile_image)
                    `)
                    .eq("swiper_id", userId)
                    .eq("swipe_type", "like")
                    .in("swiped_profile_id", swipedOnMeIds); // Mutual swipe check

                if (matchesError) {
                    console.error("Error fetching matches:", matchesError);
                    setError("Error fetching matches.");
                    return;
                }

                // Step 3: Filter out the current user's profile from the matches
                const filteredMatches = matchesData.filter((match: Match) => {
                    // Assuming profiles is an array, take the first profile object
                    return match.profiles[0]?.id !== userId;
                });

                setMatches(filteredMatches);
            } catch (err) {
                console.error("Unexpected error fetching matches:", err);
                setError("Unexpected error fetching matches.");
            }
        }

        fetchMatches();
    }, [userId]);

    const initiateChat = (matchedProfileId: string) => {
        // Navigate to the chat page with the matched profile ID
        router.push(`/chat/${matchedProfileId}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-grey-700">Your Matches</h1>

            {/* Display matches or a message if no matches are found */}
            {matches.length > 0 ? (
                matches.map((match, index) => (
                    <div key={index} className="bg-white p-4 shadow-md rounded-lg mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <img
                                src={match.profiles[0]?.profile_image || "/images/default-avatar.jpg"} // Use the first profile from the array
                                alt={match.profiles[0]?.name}
                                className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                            <p className="text-gray-700">{match.profiles[0]?.name}</p>
                        </div>
                        <button
                            className="bg-blue-500 text-grey-700 py-2 px-4 rounded"
                            onClick={() => initiateChat(match.swiped_profile_id)}
                        >
                            Chat
                        </button>
                    </div>
                ))
            ) : (
                <p>No matches found.</p>
            )}

            {/* Error Handling */}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
