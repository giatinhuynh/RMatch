'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const [chats, setChats] = useState([]);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching user:', error);
        setError('Error fetching user information.');
        return;
      }
      setUserId(user.id);
    }

    fetchUser();
  }, []);

  // Fetch all chats for the current user
  useEffect(() => {
    async function fetchChats() {
      if (!userId) return;

      try {
        // Fetch chats where the current user is either user_1 or user_2
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select(`
            id,
            user_1,
            user_2,
            created_at,
            user1Profile:profiles!user_1(id, name),
            user2Profile:profiles!user_2(id, name)
          `)
          .or(`user_1.eq.${userId},user_2.eq.${userId}`);

        if (chatError) {
          console.error('Error fetching chats:', chatError);
          setError('Error fetching chats.');
          return;
        }

        // Fetch the most recent message for each chat
        const updatedChats = await Promise.all(
          chatData.map(async (chat) => {
            const { data: lastMessage, error: messageError } = await supabase
              .from('messages')
              .select('message_text, sent_at, sender_id')
              .eq('chat_id', chat.id)
              .order('sent_at', { ascending: false })
              .limit(1);

            if (messageError) {
              console.error('Error fetching messages:', messageError);
              return { ...chat, lastMessage: null }; // Handle error, return chat without last message
            }

            return {
              ...chat,
              lastMessage: lastMessage.length > 0 ? lastMessage[0] : null, // Attach last message to the chat
            };
          })
        );

        setChats(updatedChats);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Unexpected error occurred.');
      }
    }

    fetchChats();
  }, [userId]);

  const handleChatClick = (chatId) => {
    // Navigate to the chat page for the selected chat
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Messages</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white p-4 shadow-sm rounded-lg">
        {chats.length > 0 ? (
          <ul>
            {chats.map((chat) => {
              // Determine the other user's name
              const otherUser =
                chat.user_1 === userId ? chat.user2Profile : chat.user1Profile;
              const otherUserName = otherUser?.name ?? 'Unknown User';

              // Get the most recent message in this chat
              const lastMessage = chat.lastMessage;

              return (
                <li
                  key={chat.id}
                  className="p-4 border-b last:border-none cursor-pointer hover:bg-gray-100"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className="flex justify-between items-center">
                    {/* Display other user's name */}
                    <p className="font-semibold">Chat with {otherUserName}</p>

                    {/* Display the most recent message */}
                    <p className="text-sm text-gray-500 truncate">
                      {lastMessage ? lastMessage.message_text : 'No messages yet'}
                    </p>
                  </div>

                  {/* Display the time of the last message */}
                  {lastMessage && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(lastMessage.sent_at).toLocaleTimeString()}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500">You have no messages yet.</p>
        )}
      </div>
    </div>
  );
}
  