"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useParams } from "next/navigation"; // To get the matched profile ID from the URL

export default function ChatPage() {
    const { id: otherUserId } = useParams(); // Matched profile ID from URL
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState(null);

    // Fetch current user
    useEffect(() => {
        async function fetchUser() {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();
            if (error) {
                console.error("Error fetching user:", error);
                setError("Error fetching user information.");
                return;
            }
            setUserId(user.id);
        }

        fetchUser();
    }, []);

    // Define the fetchMessages function so it's available for both useEffect and sendMessage
    const fetchMessages = async () => {
        if (!chatId) return;

        const { data: messageData, error: messageError } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("sent_at", { ascending: true }); // Sort messages by sent time

        if (messageError) {
            console.error("Error fetching messages:", messageError);
            setError("Error fetching messages.");
            return;
        }

        setMessages(messageData);
    };

    // Fetch chat between the two users or create a new one
    useEffect(() => {
        async function fetchOrCreateChat() {
            if (!userId || !otherUserId) return;

            try {
                // Fetch the most recent chat between the two users
                const { data: chatData, error: chatError } = await supabase
                    .from("chats")
                    .select("id")
                    .or(`user_1.eq.${userId},user_2.eq.${userId}`)
                    .or(`user_1.eq.${otherUserId},user_2.eq.${otherUserId}`)
                    .order("created_at", { ascending: false }) // Order by most recent
                    .limit(1) // Limit to 1 chat
                    .maybeSingle();

                if (chatError) {
                    console.error("Error fetching chat:", chatError);
                    setError(`Error fetching chat: ${chatError.message}`);
                    return;
                }

                if (!chatData) {
                    // If no existing chat found, create a new chat
                    const { data: newChat, error: createError } = await supabase
                        .from("chats")
                        .insert([{ user_1: userId, user_2: otherUserId }])
                        .select("id")
                        .single();

                    if (createError) {
                        console.error("Error creating new chat:", createError);
                        setError(`Error creating chat: ${createError.message}`);
                        return;
                    }

                    setChatId(newChat.id); // Set the new chat ID
                } else {
                    setChatId(chatData.id); // Set the existing chat ID
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("Unexpected error occurred.");
            }
        }

        fetchOrCreateChat();
    }, [userId, otherUserId]);

    // Fetch chat messages once the chat is set
    useEffect(() => {
        fetchMessages(); // Fetch messages once chatId is available
    }, [chatId]);

    // Handle sending a new message
    const sendMessage = async () => {
        if (!newMessage || !chatId || !userId) return;

        const { error: messageError } = await supabase.from("messages").insert([{ chat_id: chatId, sender_id: userId, message_text: newMessage }]);

        if (messageError) {
            console.error("Error sending message:", messageError);
            setError("Error sending message.");
            return;
        }

        // Clear the input and fetch updated messages
        setNewMessage("");
        await fetchMessages(); // Re-fetch messages after sending
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-700">Chat</h1>

            <div className="bg-white p-6 shadow-md rounded-lg">
                {/* Messages Display */}
                <div className="border p-4 rounded-lg mb-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className={`p-2 mb-2 rounded-lg ${message.sender_id === userId ? "bg-blue-100" : "bg-gray-100"}`}>
                            <p>{message.message_text}</p>
                            <p className="text-xs text-gray-500">{new Date(message.sent_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                {/* Input for New Message */}
                <div className="flex text-grey-700">
                    <input
                        type="text"
                        className="border p-2 flex-grow rounded-l-lg"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="bg-blue-500 text-white p-2 rounded-r-lg" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>

            {/* Error Handling */}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}
