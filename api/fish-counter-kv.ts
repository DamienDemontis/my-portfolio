import type { VercelRequest, VercelResponse } from '@vercel/node'
import { kv } from '@vercel/kv'

const FISH_COUNT_KEY = 'cat-fish-count'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    if (req.method === 'GET') {
      // Get current count from Vercel KV
      const count = (await kv.get<number>(FISH_COUNT_KEY)) || 0
      return res.status(200).json({ count, success: true })
    }

    if (req.method === 'POST') {
      // Increment count atomically
      const newCount = await kv.incr(FISH_COUNT_KEY)
      return res.status(200).json({ count: newCount, success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Fish counter error:', error)
    // Fallback to local storage on error
    return res.status(500).json({ error: 'Internal server error', count: 0 })
  }
}
