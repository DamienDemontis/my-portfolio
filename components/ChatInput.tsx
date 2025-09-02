'use client';
import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend(text);
        setText('');
      }}
      className="flex gap-2"
    >
      <input
        className="border p-2 flex-1"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-primary-light text-white px-4">
        Send
      </button>
    </form>
  );
}
