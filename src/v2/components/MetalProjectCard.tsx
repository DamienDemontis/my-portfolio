import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import MetalBadge from './MetalBadge';

interface MetalProjectCardProps {
  title: string;
  description: string;
  image?: string;
  tags?: string[];
  links?: { label: string; href: string; icon?: ReactNode }[];
  featured?: boolean;
  className?: string;
}

export default function MetalProjectCard({
  title,
  description,
  image,
  tags = [],
  links = [],
  featured = false,
  className = '',
}: MetalProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -6 }}
      className={`
        group relative overflow-hidden
        ${featured ? 'md:col-span-2' : ''}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #111 0%, #0a0a0a 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 4,
        boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
      }}
    >
      {image && (
        <div className="relative overflow-hidden" style={{ height: featured ? 280 : 200 }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            style={{ filter: 'grayscale(100%) contrast(1.1) brightness(0.7)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.9) 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02), transparent)',
            }}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-[#e0e0e0] group-hover:text-white transition-colors">
            {title}
          </h3>
          {featured && (
            <MetalBadge variant="chrome">Featured</MetalBadge>
          )}
        </div>

        <p className="text-sm text-[#777] leading-relaxed mb-4">{description}</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <MetalBadge key={tag} variant="outline" size="sm">{tag}</MetalBadge>
            ))}
          </div>
        )}

        {links.length > 0 && (
          <div className="flex items-center gap-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-[#666] hover:text-white transition-colors font-medium"
              >
                {link.icon}
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <div
        className="absolute top-0 left-0 w-full h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
        }}
      />
    </motion.div>
  );
}
