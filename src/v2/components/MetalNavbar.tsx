import React, { useEffect, useMemo, useRef, useState, Children, cloneElement } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNav } from '../core/navigation';
import { sectionIcons, homeIcon, mapIcon, commandIcon } from '../core/sectionIcons';

interface NavItem {
  label: string;
  href: string;
}

interface MetalNavbarProps {
  items: NavItem[];
  logo?: string;
}

/* ── Dock sub-components ── */

const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };
const BASE_SIZE = 44;
const MAGNIFICATION = 64;
const DISTANCE = 140;

function DockItem({
  children,
  onClick,
  mouseX,
  isActive,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  mouseX: MotionValue<number>;
  isActive?: boolean;
  label: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: BASE_SIZE };
    return val - rect.x - rect.width / 2;
  });

  const targetSize = useTransform(mouseDistance, [-DISTANCE, 0, DISTANCE], [BASE_SIZE, MAGNIFICATION, BASE_SIZE]);
  const size = useSpring(targetSize, SPRING);

  return (
    <motion.button
      ref={ref}
      style={{ width: size, height: size, background: 'none', border: 'none', padding: 0 }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className="relative inline-flex items-center justify-center cursor-pointer"
      aria-label={label}
      aria-current={isActive ? 'true' : undefined}
      whileTap={{ scale: 0.85 }}
    >
      {/* Active dot */}
      {isActive && (
        <motion.div
          layoutId="dock-active"
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: 'var(--metal-accent)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}
      {/* Glow behind active item */}
      <div
        className="absolute inset-0 rounded-xl transition-opacity duration-300"
        style={{
          opacity: isActive ? 1 : 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      />
      {Children.map(children, (child) =>
        React.isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ isHovered?: MotionValue<number> }>, { isHovered })
          : child
      )}
    </motion.button>
  );
}

function DockLabel({
  children,
  isHovered,
  forceVisible,
}: {
  children: React.ReactNode;
  isHovered?: MotionValue<number>;
  forceVisible?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsub = isHovered.on('change', (v) => setHovered(v === 1));
    return () => unsub();
  }, [isHovered]);

  const visible = hovered || forceVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -8 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute -top-7 left-1/2 whitespace-nowrap rounded-md px-2 py-0.5"
          style={{
            x: '-50%',
            background: 'rgba(15,15,15,0.95)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            fontSize: 10,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: hovered ? '#ddd' : '#999',
          }}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, isActive }: { children: React.ReactNode; isActive?: boolean; isHovered?: MotionValue<number> }) {
  return (
    <div
      className="flex items-center justify-center transition-colors duration-200"
      style={{ color: isActive ? '#fff' : '#777', width: 20, height: 20 }}
    >
      {children}
    </div>
  );
}

/* ── Separator ── */
function DockSeparator() {
  return <div className="w-px h-6 mx-1 self-center" style={{ background: 'rgba(255,255,255,0.08)' }} />;
}

/* ── Main Navbar ── */

export default function MetalNavbar({ items, logo = 'DD' }: MetalNavbarProps) {
  const { t } = useTranslation();
  const { activeId, travelTo, atlasOpen, setAtlasOpen, setPaletteOpen } = useNav();
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const panelHeight = 60;
  const maxHeight = useMemo(() => Math.max(panelHeight + 16, MAGNIFICATION + MAGNIFICATION / 2 + 4), []);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, SPRING);

  return (
    <>
      {/* ── Desktop Dock ── */}
      <motion.div
        style={{ height, scrollbarWidth: 'none' }}
        className="fixed bottom-0 left-0 right-0 z-50 hidden md:flex items-end justify-center pointer-events-none"
      >
        <motion.nav
          onMouseMove={({ pageX }) => {
            isHovered.set(1);
            mouseX.set(pageX);
          }}
          onMouseLeave={() => {
            isHovered.set(0);
            mouseX.set(Infinity);
          }}
          className="flex items-end gap-1 pb-3 px-3 pointer-events-auto"
          style={{
            height: panelHeight,
            borderRadius: 14,
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
            marginBottom: 12,
          }}
          role="navigation"
          aria-label={t('nav.dockLabel')}
        >
          {/* Home */}
          <DockItem
            mouseX={mouseX}
            onClick={() => travelTo('home')}
            isActive={activeId === 'home'}
            label={t('nav.scrollToTop')}
          >
            <DockIcon isActive={activeId === 'home'}>{homeIcon}</DockIcon>
            <DockLabel>{logo}</DockLabel>
          </DockItem>

          <DockSeparator />

          {/* Section items */}
          {items.map((item) => {
            const id = item.href.slice(1);
            const isActive = activeId === id;
            return (
              <DockItem
                key={item.href}
                mouseX={mouseX}
                onClick={() => travelTo(id)}
                isActive={isActive}
                label={t('nav.goTo', { label: item.label })}
              >
                <DockIcon isActive={isActive}>
                  {sectionIcons[id] || <span className="text-xs font-medium">{item.label.slice(0, 2)}</span>}
                </DockIcon>
                <DockLabel forceVisible={isActive}>{item.label}</DockLabel>
              </DockItem>
            );
          })}

          <DockSeparator />

          {/* Atlas (overview) */}
          <DockItem mouseX={mouseX} onClick={() => setAtlasOpen(true)} label={t('atlas.title')}>
            <DockIcon>{mapIcon}</DockIcon>
            <DockLabel>{t('atlas.title')} · M</DockLabel>
          </DockItem>

          {/* Command palette */}
          <DockItem mouseX={mouseX} onClick={() => setPaletteOpen(true)} label={t('palette.label')}>
            <DockIcon>{commandIcon}</DockIcon>
            <DockLabel>{t('palette.label')} · ⌘K</DockLabel>
          </DockItem>
        </motion.nav>
      </motion.div>

      {/* ── Mobile: burger → Atlas ── */}
      <div className="md:hidden fixed top-4 right-4 z-[86]">
        <button
          onClick={() => setAtlasOpen(!atlasOpen)}
          className="flex flex-col gap-1.5 cursor-pointer p-3 rounded-xl"
          style={{
            background: 'rgba(10,10,10,0.75)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          aria-label={atlasOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={atlasOpen}
        >
          <motion.span animate={{ rotate: atlasOpen ? 45 : 0, y: atlasOpen ? 7 : 0 }} className="block w-5 h-px bg-[#999]" />
          <motion.span animate={{ opacity: atlasOpen ? 0 : 1 }} className="block w-5 h-px bg-[#999]" />
          <motion.span animate={{ rotate: atlasOpen ? -45 : 0, y: atlasOpen ? -7 : 0 }} className="block w-5 h-px bg-[#999]" />
        </button>
      </div>
    </>
  );
}
