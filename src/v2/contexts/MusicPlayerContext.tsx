import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Track } from '../data/musicData';

interface MusicPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
}

interface MusicPlayerActions {
  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  seek: (progress: number) => void;
  stop: () => void;
}

interface MusicPlayerContextValue extends MusicPlayerState, MusicPlayerActions {
  amplitudeRef: React.MutableRefObject<number>;
  analyserRef: React.RefObject<AnalyserNode | null>;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const amplitudeRef = useRef(0);
  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Use refs for current state to keep stable callback identities
  const currentTrackRef = useRef<Track | null>(null);
  const isPlayingRef = useRef(false);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync refs with state
  useEffect(() => { currentTrackRef.current = currentTrack; }, [currentTrack]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // Initialize Web Audio API on first interaction
  const ensureAudioContext = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.6;

      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch {
      console.warn('Web Audio API unavailable');
    }
  }, []);

  // RAF loop for amplitude — only runs during playback
  const startAmplitudeLoop = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      amplitudeRef.current = sum / dataArray.length / 255;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopAmplitudeLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    amplitudeRef.current = 0;
  }, []);

  const play = useCallback(
    (track: Track) => {
      const audio = audioRef.current;
      if (!audio) return;
      ensureAudioContext();

      // If same track and paused, just resume
      if (currentTrackRef.current?.id === track.id && !isPlayingRef.current && audio.src.includes(track.audioUrl)) {
        audio.play();
        setIsPlaying(true);
        startAmplitudeLoop();
        return;
      }

      // New track
      audio.pause();
      stopAmplitudeLoop();
      setIsLoading(true);
      setProgress(0);
      setCurrentTrack(track);
      setIsPlaying(false);

      audio.src = track.audioUrl;
      audio.load();

      const onCanPlay = () => {
        audio.play().then(() => {
          setIsLoading(false);
          setIsPlaying(true);
          startAmplitudeLoop();
        }).catch(() => {
          setIsLoading(false);
        });
      };

      const onError = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        setIsLoading(false);
        console.error('Failed to load audio:', track.audioUrl);
      };

      audio.addEventListener('canplaythrough', onCanPlay, { once: true });
      audio.addEventListener('error', onError, { once: true });
    },
    [ensureAudioContext, startAmplitudeLoop, stopAmplitudeLoop]
  );

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
    stopAmplitudeLoop();
  }, [stopAmplitudeLoop]);

  const resume = useCallback(() => {
    audioRef.current?.play();
    setIsPlaying(true);
    startAmplitudeLoop();
  }, [startAmplitudeLoop]);

  const seek = useCallback((prog: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = prog * audio.duration;
      setProgress(prog);
    }
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
    stopAmplitudeLoop();
  }, [stopAmplitudeLoop]);

  // Progress tracking via timeupdate
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      stopAmplitudeLoop();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, [stopAmplitudeLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
      sourceNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        progress,
        amplitudeRef,
        analyserRef,
        play,
        pause,
        resume,
        seek,
        stop,
      }}
    >
      <audio ref={audioRef} preload="none" />
      {children}
    </MusicPlayerContext.Provider>
  );
}
