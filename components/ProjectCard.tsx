'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ProjectCard({ title, description, image }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl shadow-lg/10 p-4"
    >
      <Image src={image} alt={title} width={300} height={200} className="rounded-xl" />
      <h3 className="mt-2 font-bold">{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}
