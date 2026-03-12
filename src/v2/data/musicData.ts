export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
}

export const tracks: Track[] = [
  {
    id: 'champagne-coast',
    title: 'Champagne Coast',
    artist: 'Blood Orange',
    genre: 'Indie R&B',
    coverUrl: '/music/covers/champagne-coast.webp',
    audioUrl: '/music/champagne-coast.mp3',
  },
  {
    id: 'in-my-zone',
    title: 'In My Zone',
    artist: 'bbno$ & VALORANT',
    genre: 'Hip House',
    coverUrl: '/music/covers/in-my-zone.webp',
    audioUrl: '/music/in-my-zone.mp3',
  },
  {
    id: 'touch-off',
    title: 'Touch Off',
    artist: 'UVERworld',
    genre: 'J-Rock',
    coverUrl: '/music/covers/touch-off.webp',
    audioUrl: '/music/touch-off.mp3',
  },
  {
    id: 'feel-good-inc',
    title: 'Feel Good Inc',
    artist: 'Gorillaz',
    genre: 'Alternative',
    coverUrl: '/music/covers/feel-good-inc.webp',
    audioUrl: '/music/feel-good-inc.mp3',
  },
  {
    id: 'usseewa',
    title: 'うっせぇわ (Usseewa)',
    artist: 'Ado',
    genre: 'J-Pop',
    coverUrl: '/music/covers/usseewa.webp',
    audioUrl: '/music/usseewa.mp3',
  },
  {
    id: 'glace',
    title: 'Glace',
    artist: 'Say',
    genre: 'TBD',
    coverUrl: '/music/covers/glace.webp',
    audioUrl: '/music/glace.mp3',
  },
  {
    id: 'dancing-with-myself',
    title: 'Dancing with Myself',
    artist: 'Billy Idol',
    genre: 'New Wave',
    coverUrl: '/music/covers/dancing-with-myself.webp',
    audioUrl: '/music/dancing-with-myself.mp3',
  },
  {
    id: 'naihishinsho',
    title: '内秘心書 (Naihishinsho)',
    artist: 'ONE OK ROCK',
    genre: 'J-Rock',
    coverUrl: '/music/covers/naihishinsho.webp',
    audioUrl: '/music/naihishinsho.mp3',
  },
  {
    id: 'une-vie-a-taimer',
    title: "Une vie à t'aimer",
    artist: 'Lorien Testard',
    genre: 'Game OST',
    coverUrl: '/music/covers/une-vie-a-taimer.webp',
    audioUrl: '/music/une-vie-a-taimer.mp3',
  },
  {
    id: 'malas-decisiones',
    title: 'Malas Decisiones',
    artist: 'Kenia Os',
    genre: 'Latin Pop',
    coverUrl: '/music/covers/malas-decisiones.webp',
    audioUrl: '/music/malas-decisiones.mp3',
  },
  {
    id: 'echec-et-mat',
    title: 'Échec et mat',
    artist: 'Miki',
    genre: 'Electronic Pop',
    coverUrl: '/music/covers/echec-et-mat.webp',
    audioUrl: '/music/echec-et-mat.mp3',
  },
];

/** Row 1: first 6 tracks, Row 2: last 5 + first track duplicate (6 each) */
export const row1Tracks = tracks.slice(0, 6);
export const row2Tracks = [...tracks.slice(6), tracks[0]];
