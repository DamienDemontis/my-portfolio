import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface TimelineItem {
  title: string;
  subtitle?: string;
  period: string;
  content: ReactNode;
  icon?: ReactNode;
}

interface MetalTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export default function MetalTimeline({ items, className = '' }: MetalTimelineProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-px"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.08) 10%, rgba(255,255,255,0.08) 90%, transparent)',
        }}
      />

      {items.map((item, i) => {
        const isLeft = i % 2 === 0;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
            className={`
              relative flex items-start mb-12 last:mb-0
              md:justify-${isLeft ? 'start' : 'end'}
            `}
          >
            <div
              className="absolute left-[15px] md:left-1/2 md:-translate-x-1/2 top-1 w-[9px] h-[9px] z-10 rotate-45"
              style={{
                background: 'linear-gradient(135deg, #444, #222)',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 0 10px rgba(255,255,255,0.05)',
              }}
            />

            <div
              className={`
                ml-10 md:ml-0
                md:w-[calc(50%-30px)]
                ${isLeft ? '' : 'md:ml-auto'}
              `}
            >
              <div
                className="p-5 transition-all duration-300 hover:border-[rgba(255,255,255,0.12)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(17,17,17,0.8), rgba(10,10,10,0.9))',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 4,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {item.icon && <span className="text-[#666]">{item.icon}</span>}
                    <h4 className="text-[#e0e0e0] font-semibold text-sm">{item.title}</h4>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#555] whitespace-nowrap font-medium">
                    {item.period}
                  </span>
                </div>
                {item.subtitle && (
                  <p className="text-[#777] text-xs mb-3 tracking-wide">{item.subtitle}</p>
                )}
                <div className="text-[#888] text-sm leading-relaxed">{item.content}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
