'use client';
import { videos } from '@/data/videos';
import VideoPlayer from './VideoPlayer';

export default function VideoList() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {videos.map((v) => (
        <VideoPlayer key={v.id} videoId={v.id} />
      ))}
    </div>
  );
}
