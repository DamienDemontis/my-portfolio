#!/usr/bin/env node
/**
 * Downloads audio (MP3), cover art (WebP), and synced lyrics (LRC) for all tracks.
 *
 * Requirements: yt-dlp, ffmpeg (both in PATH)
 * Uses: iTunes Search API (covers), lrclib.net (synced lyrics), yt-dlp (audio)
 *
 * Usage: node scripts/download-music.mjs
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import sharp from 'sharp';

// Resolve full paths for yt-dlp and ffmpeg (winget installs them outside default bash PATH)
const YTDLP = process.platform === 'win32'
  ? path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages/yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe/yt-dlp.exe')
  : 'yt-dlp';
const FFMPEG_DIR = process.platform === 'win32'
  ? path.join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin')
  : '';

const ROOT = path.resolve(import.meta.dirname, '..');
const MUSIC_DIR = path.join(ROOT, 'public', 'music');
const COVERS_DIR = path.join(MUSIC_DIR, 'covers');
const LYRICS_DIR = path.join(MUSIC_DIR, 'lyrics');

mkdirSync(COVERS_DIR, { recursive: true });
mkdirSync(LYRICS_DIR, { recursive: true });

// Track data with YouTube search queries
const tracks = [
  {
    id: 'champagne-coast',
    title: 'Champagne Coast',
    artist: 'Blood Orange',
    ytQuery: 'Blood Orange Champagne Coast official audio',
  },
  {
    id: 'in-my-zone',
    title: 'In My Zone',
    artist: 'bbno$',
    ytQuery: 'bbno$ VALORANT In My Zone official audio',
  },
  {
    id: 'touch-off',
    title: 'Touch Off',
    artist: 'UVERworld',
    ytQuery: 'UVERworld Touch Off official audio',
  },
  {
    id: 'feel-good-inc',
    title: 'Feel Good Inc',
    artist: 'Gorillaz',
    ytQuery: 'Gorillaz Feel Good Inc official audio',
  },
  {
    id: 'usseewa',
    title: 'うっせぇわ',
    artist: 'Ado',
    ytQuery: 'Ado うっせぇわ official',
    itunesQuery: 'Ado usseewa',
  },
  {
    id: 'glace',
    title: 'Glace',
    artist: 'Say',
    ytQuery: 'Say Glace music',
  },
  {
    id: 'dancing-with-myself',
    title: 'Dancing with Myself',
    artist: 'Billy Idol',
    ytQuery: 'Billy Idol Dancing with Myself official audio',
  },
  {
    id: 'naihishinsho',
    title: '内秘心書',
    artist: 'ONE OK ROCK',
    ytQuery: 'ONE OK ROCK 内秘心書 official',
    itunesQuery: 'ONE OK ROCK naihishinsho',
  },
  {
    id: 'une-vie-a-taimer',
    title: "Une vie à t'aimer",
    artist: 'Lorien Testard',
    ytQuery: "Lorien Testard Une vie à t'aimer",
  },
  {
    id: 'malas-decisiones',
    title: 'Malas Decisiones',
    artist: 'Kenia Os',
    ytQuery: 'Kenia Os Malas Decisiones official audio',
  },
  {
    id: 'echec-et-mat',
    title: 'Échec et mat',
    artist: 'Miki',
    ytQuery: 'Miki Échec et mat music',
  },
];

// ─── Helpers ───

function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'MusicDownloader/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetch(res.headers.location).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchJSON(url) {
  const buf = await fetch(url);
  return JSON.parse(buf.toString());
}

// ─── Cover Art (iTunes Search API → WebP) ───

async function downloadCover(track) {
  const outPath = path.join(COVERS_DIR, `${track.id}.webp`);
  if (existsSync(outPath)) {
    console.log(`  ✓ Cover already exists: ${track.id}.webp`);
    return;
  }

  const query = track.itunesQuery || `${track.artist} ${track.title}`;
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&limit=5`;

  try {
    const data = await fetchJSON(url);
    if (!data.results || data.results.length === 0) {
      console.log(`  ✗ No cover found for "${track.title}" — try manually`);
      return;
    }

    // Find best match (prefer exact artist match)
    const match =
      data.results.find((r) =>
        r.artistName.toLowerCase().includes(track.artist.toLowerCase())
      ) || data.results[0];

    // Get highest resolution (replace 100x100 with 600x600)
    const artUrl = match.artworkUrl100.replace('100x100', '600x600');
    console.log(`  ↓ Downloading cover: ${artUrl}`);

    const imgBuf = await fetch(artUrl);
    await sharp(imgBuf).resize(400, 400).webp({ quality: 85 }).toFile(outPath);

    console.log(`  ✓ Cover saved: ${track.id}.webp`);
  } catch (err) {
    console.log(`  ✗ Cover failed for "${track.title}": ${err.message}`);
  }
}

// ─── Lyrics (lrclib.net → LRC) ───

async function downloadLyrics(track) {
  const outPath = path.join(LYRICS_DIR, `${track.id}.lrc`);
  if (existsSync(outPath)) {
    console.log(`  ✓ Lyrics already exists: ${track.id}.lrc`);
    return;
  }

  const query = `${track.artist} ${track.title}`;
  const url = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;

  try {
    const data = await fetchJSON(url);
    if (!data || data.length === 0) {
      console.log(`  ✗ No lyrics found for "${track.title}"`);
      return;
    }

    // Prefer synced lyrics, fall back to plain
    const match =
      data.find(
        (r) =>
          r.syncedLyrics &&
          r.artistName?.toLowerCase().includes(track.artist.split(' ')[0].toLowerCase())
      ) ||
      data.find((r) => r.syncedLyrics) ||
      data[0];

    if (match.syncedLyrics) {
      writeFileSync(outPath, match.syncedLyrics, 'utf-8');
      console.log(`  ✓ Synced lyrics saved: ${track.id}.lrc`);
    } else if (match.plainLyrics) {
      writeFileSync(outPath, match.plainLyrics, 'utf-8');
      console.log(`  ✓ Plain lyrics saved: ${track.id}.lrc (no sync data)`);
    } else {
      console.log(`  ✗ No lyrics content for "${track.title}"`);
    }
  } catch (err) {
    console.log(`  ✗ Lyrics failed for "${track.title}": ${err.message}`);
  }
}

// ─── Audio (yt-dlp → MP3) ───

function downloadAudio(track) {
  const outPath = path.join(MUSIC_DIR, `${track.id}.mp3`);
  if (existsSync(outPath)) {
    console.log(`  ✓ Audio already exists: ${track.id}.mp3`);
    return;
  }

  const outTemplate = path.join(MUSIC_DIR, `${track.id}.%(ext)s`);

  try {
    console.log(`  ↓ Searching YouTube: "${track.ytQuery}"`);
    // Build env with ffmpeg in PATH
    const env = { ...process.env };
    if (FFMPEG_DIR) env.PATH = `${FFMPEG_DIR}${path.delimiter}${env.PATH}`;

    // Download best audio, convert to mp3
    execSync(
      `"${YTDLP}" --no-playlist -x --audio-format mp3 --audio-quality 0 ` +
        `--embed-thumbnail --embed-metadata ` +
        `--output "${outTemplate}" ` +
        `"ytsearch1:${track.ytQuery.replace(/"/g, '\\"')}"`,
      { stdio: 'pipe', timeout: 120000, env }
    );

    if (existsSync(outPath)) {
      console.log(`  ✓ Audio saved: ${track.id}.mp3`);
    } else {
      // yt-dlp might have saved with different extension, check
      const possibleWebm = path.join(MUSIC_DIR, `${track.id}.webm`);
      const possibleM4a = path.join(MUSIC_DIR, `${track.id}.m4a`);
      const ffmpegBin = FFMPEG_DIR ? path.join(FFMPEG_DIR, 'ffmpeg') : 'ffmpeg';
      if (existsSync(possibleWebm)) {
        execSync(`"${ffmpegBin}" -i "${possibleWebm}" -b:a 192k "${outPath}" -y`, { stdio: 'pipe' });
        unlinkSync(possibleWebm);
        console.log(`  ✓ Audio converted & saved: ${track.id}.mp3`);
      } else if (existsSync(possibleM4a)) {
        execSync(`"${ffmpegBin}" -i "${possibleM4a}" -b:a 192k "${outPath}" -y`, { stdio: 'pipe' });
        unlinkSync(possibleM4a);
        console.log(`  ✓ Audio converted & saved: ${track.id}.mp3`);
      } else {
        console.log(`  ✗ Audio download completed but file not found for ${track.id}`);
      }
    }
  } catch (err) {
    console.log(`  ✗ Audio failed for "${track.title}": ${err.message?.slice(0, 200)}`);
  }
}

// ─── Main ───

async function main() {
  console.log('🎵 Music Downloader\n');
  console.log(`Tracks: ${tracks.length}`);
  console.log(`Output: ${MUSIC_DIR}\n`);

  // Phase 1: Covers (parallel, fast)
  console.log('═══ Phase 1: Cover Art ═══\n');
  for (const track of tracks) {
    console.log(`[${track.id}]`);
    await downloadCover(track);
  }

  // Phase 2: Lyrics (parallel, fast)
  console.log('\n═══ Phase 2: Lyrics ═══\n');
  for (const track of tracks) {
    console.log(`[${track.id}]`);
    await downloadLyrics(track);
  }

  // Phase 3: Audio (sequential, slow — yt-dlp is heavy)
  console.log('\n═══ Phase 3: Audio (this takes a while) ═══\n');
  for (const track of tracks) {
    console.log(`[${track.id}]`);
    downloadAudio(track);
  }

  console.log('\n✅ Done! Check public/music/ for results.');
  console.log('   Covers: public/music/covers/*.webp');
  console.log('   Audio:  public/music/*.mp3');
  console.log('   Lyrics: public/music/lyrics/*.lrc');
}

main().catch(console.error);
