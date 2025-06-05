'use client';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  return (
    <div className="aspect-video">
      <YouTube videoId={videoId} className="w-full h-full" iframeClassName="w-full h-full" />
    </div>
  );
}
