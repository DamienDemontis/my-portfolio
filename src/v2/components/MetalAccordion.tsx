import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  title: string;
  content: ReactNode;
  badge?: string;
}

interface MetalAccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export default function MetalAccordion({
  items,
  className = '',
  allowMultiple = false,
}: MetalAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {items.map((item, i) => {
        const isOpen = openItems.has(i);
        return (
          <div
            key={i}
            className="transition-all duration-300"
            style={{
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 3,
              background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
            }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium transition-colors duration-300 ${isOpen ? 'text-white' : 'text-[#888] group-hover:text-[#ccc]'}`}>
                  {item.title}
                </span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#555] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]" style={{ borderRadius: 2 }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <motion.svg
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                className="text-[#555]"
              >
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-sm text-[#777] leading-relaxed border-t border-[rgba(255,255,255,0.04)] pt-3">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
