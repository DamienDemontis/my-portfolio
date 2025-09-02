import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <motion.pre
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-mono"
      >
        {"console.log('404')"}
      </motion.pre>
    </main>
  );
}
