import { useEffect, useRef, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  revealDirection?: 'start' | 'end' | 'center';
  characters?: string;
  parentClassName?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function DecryptedText({
  text,
  speed = 50,
  className = '',
  revealDirection = 'start',
  characters = DEFAULT_CHARS,
  parentClassName = '',
  as: Tag = 'span',
}: DecryptedTextProps) {
  const [displayed, setDisplayed] = useState(text);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const { ref, inView } = useInView({ threshold: 0.5, triggerOnce: true });
  const hasTriggered = useRef(false);

  const decrypt = useCallback(() => {
    if (isDecrypting) return;
    setIsDecrypting(true);
    let iteration = 0;
    const totalLength = text.length;

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplayed(() => {
        const revealed = Math.floor(iteration);
        return text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';

            let isRevealed = false;
            if (revealDirection === 'start') isRevealed = i < revealed;
            else if (revealDirection === 'end') isRevealed = i >= totalLength - revealed;
            else isRevealed = Math.abs(i - totalLength / 2) < revealed / 2;

            if (isRevealed) return char;
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      iteration += 0.5;

      if (iteration > totalLength + 2) {
        clearInterval(intervalRef.current);
        setDisplayed(text);
        setIsDecrypting(false);
      }
    }, speed);
  }, [text, speed, revealDirection, characters, isDecrypting]);

  useEffect(() => {
    if (inView && !hasTriggered.current) {
      hasTriggered.current = true;
      setDisplayed(text.replace(/\S/g, () => characters[Math.floor(Math.random() * characters.length)]));
      const timer = setTimeout(decrypt, 200);
      return () => clearTimeout(timer);
    }
  }, [inView, decrypt, text, characters]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <span ref={ref} className={parentClassName}>
      <Tag className={className} aria-label={text}>
        {displayed}
      </Tag>
    </span>
  );
}
