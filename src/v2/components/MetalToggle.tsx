import { motion } from 'framer-motion';

interface MetalToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function MetalToggle({
  checked = false,
  onChange,
  label,
  disabled = false,
}: MetalToggleProps) {
  return (
    <label className={`inline-flex items-center gap-3 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors duration-300 border"
        style={{
          background: checked
            ? 'linear-gradient(135deg, #333, #222)'
            : '#0a0a0a',
          borderColor: checked
            ? 'rgba(255,255,255,0.15)'
            : 'rgba(255,255,255,0.08)',
          boxShadow: checked
            ? '0 0 12px rgba(255,255,255,0.05), inset 0 1px 3px rgba(0,0,0,0.3)'
            : 'inset 0 1px 3px rgba(0,0,0,0.4)',
        }}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-[2px] w-[18px] h-[18px] rounded-full"
          style={{
            background: checked
              ? 'linear-gradient(135deg, #eee, #999)'
              : 'linear-gradient(135deg, #555, #333)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}
        />
      </button>
      {label && (
        <span className="text-sm text-[#888] select-none">{label}</span>
      )}
    </label>
  );
}
