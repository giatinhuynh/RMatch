'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase.from('messages').select('*');
      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data);
      }
    }

    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            {message.message_text} - {new Date(message.sent_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
