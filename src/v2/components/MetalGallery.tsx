import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface MetalGalleryProps {
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function MetalGallery({
  images,
  columns = 3,
  className = '',
}: MetalGalleryProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  const navigate = useCallback((dir: 1 | -1) => {
    if (selected === null) return;
    setSelected(Math.max(0, Math.min(images.length - 1, selected + dir)));
  }, [selected, images.length]);

  const close = useCallback(() => setSelected(null), []);

  useEffect(() => {
    if (selected === null) return;

    document.body.classList.add('metal-body-locked');

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.classList.remove('metal-body-locked');
    };
  }, [selected, navigate, close]);

  return (
    <>
      <div className={`grid ${colClass[columns]} gap-2 ${className}`} role="list" aria-label="Photo gallery">
        {images.map((img, i) => (
          <motion.div
            key={i}
            role="listitem"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.02 }}
          >
            <button
              onClick={() => setSelected(i)}
              className="relative group cursor-pointer overflow-hidden w-full block text-left"
              style={{
                aspectRatio: '4/3',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.04)',
              }}
              aria-label={`View ${img.alt}${img.caption ? `: ${img.caption}` : ''}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-all duration-500 metal-gallery-color-reveal"
                loading="lazy"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)' }}
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-[11px] text-[#bbb] tracking-wide">{img.caption}</p>
                </div>
              )}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)', borderRadius: 'inherit' }}
              />
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            style={{ background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(20px)' }}
            role="dialog"
            aria-modal="true"
            aria-label={`Viewing ${images[selected].alt}`}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative max-w-4xl w-full max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selected].src}
                alt={images[selected].alt}
                className="max-w-full max-h-[75vh] object-contain mx-auto metal-gallery-lightbox-img"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                }}
              />
              {images[selected].caption && (
                <p className="mt-4 text-center text-sm text-[#8a8a8a] tracking-wide">
                  {images[selected].caption}
                </p>
              )}

              <div className="absolute -top-10 left-0 right-0 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">
                  {selected + 1} / {images.length}
                </span>
                <button
                  onClick={close}
                  className="text-[#666] hover:text-white transition-colors cursor-pointer p-1"
                  aria-label="Close gallery"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" /></svg>
                </button>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); navigate(-1); }}
                className="absolute left-2 md:left-[-50px] top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors cursor-pointer p-2"
                aria-label="Previous image"
              >
                <svg width="20" height="20" viewBox="0 0 20 20"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate(1); }}
                className="absolute right-2 md:right-[-50px] top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition-colors cursor-pointer p-2"
                aria-label="Next image"
              >
                <svg width="20" height="20" viewBox="0 0 20 20"><path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
