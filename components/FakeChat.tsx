'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FakeChatProps {
  messages: string[];
}

export default function FakeChat({ messages }: FakeChatProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (index < messages.length - 1) {
      const id = setTimeout(() => setIndex(index + 1), 2000);
      return () => clearTimeout(id);
    }
  }, [index, messages.length]);
  return (
    <div className="space-y-2">
      {messages.slice(0, index + 1).map((msg, i) => (
        <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {msg}
        </motion.p>
      ))}
    </div>
  );
}
