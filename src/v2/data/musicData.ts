export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  audioUrl: string;
  lyricsOffset?: number; // seconds to add to audio currentTime before matching LRC timestamps
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
    lyricsOffset: -1.5,
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
    id: 'dancing-with-myself',
    title: 'Dancing with Myself',
    artist: 'Billy Idol',
    genre: 'New Wave',
    coverUrl: '/music/covers/dancing-with-myself.webp',
    audioUrl: '/music/dancing-with-myself.mp3',
    lyricsOffset: -0.5,
  },
  {
    id: 'naihishinsho',
    title: '内秘心書 (Naihishinsho)',
    artist: 'ONE OK ROCK',
    genre: 'J-Rock',
    coverUrl: '/music/covers/naihishinsho.webp',
    audioUrl: '/music/naihishinsho.mp3',
    lyricsOffset: -1.5,
  },
  {
    id: 'une-vie-a-taimer',
    title: "Une vie à t'aimer",
    artist: 'Lorien Testard',
    genre: 'Game OST',
    coverUrl: '/music/covers/une-vie-a-taimer.webp',
    audioUrl: '/music/une-vie-a-taimer.mp3',
    lyricsOffset: 1.5,
  },
  {
    id: 'malas-decisiones',
    title: 'Malas Decisiones',
    artist: 'Kenia Os',
    genre: 'Latin Pop',
    coverUrl: '/music/covers/malas-decisiones.webp',
    audioUrl: '/music/malas-decisiones.mp3',
    lyricsOffset: -17,
  },
  {
    id: 'echec-et-mat',
    title: 'Échec et mat',
    artist: 'Miki',
    genre: 'Electronic Pop',
    coverUrl: '/music/covers/echec-et-mat.webp',
    audioUrl: '/music/echec-et-mat.mp3',
    lyricsOffset: -2,
  },
  {
    id: 'sotto-casa',
    title: 'Sotto casa',
    artist: 'Max Gazzè',
    genre: 'Italian Pop',
    coverUrl: '/music/covers/sotto-casa.webp',
    audioUrl: '/music/sotto-casa.mp3',
  },
  {
    id: 'everything-in-its-right-place',
    title: 'Everything in Its Right Place',
    artist: 'Radiohead',
    genre: 'Art Rock',
    coverUrl: '/music/covers/everything-in-its-right-place.webp',
    audioUrl: '/music/everything-in-its-right-place.mp3',
  },
  {
    id: 'big-bang-theory-theme',
    title: 'The History of Everything',
    artist: 'Barenaked Ladies',
    genre: 'Pop Rock',
    coverUrl: '/music/covers/big-bang-theory-theme.webp',
    audioUrl: '/music/big-bang-theory-theme.mp3',
  },
  {
    id: 'incense-and-iron',
    title: 'Incense & Iron',
    artist: 'Powerwolf',
    genre: 'Power Metal',
    coverUrl: '/music/covers/incense-and-iron.webp',
    audioUrl: '/music/incense-and-iron.mp3',
  },
  {
    id: 'next-semester',
    title: 'Next Semester',
    artist: 'Twenty One Pilots',
    genre: 'Alt Rock',
    coverUrl: '/music/covers/next-semester.webp',
    audioUrl: '/music/next-semester.mp3',
  },
  {
    id: 'rat',
    title: 'Rät',
    artist: 'Penelope Scott',
    genre: 'Indie Pop',
    coverUrl: '/music/covers/rat.webp',
    audioUrl: '/music/rat.mp3',
  },
  {
    id: 'il-solito-sesso',
    title: 'Il solito sesso',
    artist: 'Max Gazzè',
    genre: 'Italian Pop',
    coverUrl: '/music/covers/il-solito-sesso.webp',
    audioUrl: '/music/il-solito-sesso.mp3',
  },
  {
    id: 'red-birthmark',
    title: 'red:birthmark',
    artist: 'AINA the end',
    genre: 'J-Rock',
    coverUrl: '/music/covers/red-birthmark.webp',
    audioUrl: '/music/red-birthmark.mp3',
  },
];

/** Row 1: first half, Row 2: second half */
const half = Math.ceil(tracks.length / 2);
export const row1Tracks = tracks.slice(0, half);
export const row2Tracks = tracks.slice(half);
