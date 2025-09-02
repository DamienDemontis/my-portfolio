'use client';
import { useState } from 'react';
import ChatInput from '@/components/ChatInput';

export default function AskPage() {
  const [messages, setMessages] = useState<string[]>([]);
  return (
    <main className="p-4">
      {messages.map((m, i) => (
        <p key={i}>{m}</p>
      ))}
      <ChatInput
        onSend={async (text) => {
          setMessages((prev) => [...prev, text]);
          const res = await fetch('/api/ask', {
            method: 'POST',
            body: JSON.stringify({ prompt: text }),
          });
          const data = await res.json();
          setMessages((prev) => [...prev, data.reply]);
        }}
      />
    </main>
  );
}
