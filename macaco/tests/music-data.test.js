import { TRACKS } from '../src/content/music.js'

test('la playlist compte 18 morceaux, ids uniques, un identifiant Deezer chacun', () => {
  // 18 lignes dans le brief du controleur (le plan en annoncait 19).
  expect(TRACKS).toHaveLength(18)
  expect(new Set(TRACKS.map(t => t.id)).size).toBe(TRACKS.length)
  for (const t of TRACKS) {
    expect(t.title).toBeTruthy()
    expect(t.artist).toBeTruthy()
    expect(t.genre).toBeTruthy()
    expect(t.deezer).toMatch(/^\d+$/)
  }
  expect(TRACKS[0].id).toBe('champagne-coast')
  expect(TRACKS.find(t => t.id === 'feel-good-inc').deezer).toBe('3129407')
})
