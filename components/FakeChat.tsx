'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FakeChatProps {
  messages: string[];
}

export default function FakeChat({ messages }: FakeChatProps) {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const text = messages[index];
    let i = 0;
    const id = setInterval(() => {
      setCurrent(text.slice(0, i + 1));
      i += 1;
      if (i === text.length) {
        clearInterval(id);
        if (index < messages.length - 1) {
          setTimeout(() => {
            setIndex(index + 1);
            setCurrent('');
          }, 800);
        }
      }
    }, 50);
    return () => clearInterval(id);
  }, [index, messages]);

  return (
    <div className="space-y-2">
      {messages.slice(0, index).map((msg, i) => (
        <motion.p key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {msg}
        </motion.p>
      ))}
      <motion.p key={index} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {current}
      </motion.p>
    </div>
  );
}
