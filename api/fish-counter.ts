import type { VercelRequest, VercelResponse } from '@vercel/node'

// Simple in-memory storage for demo (resets on cold start)
// For production, use Vercel KV, Upstash Redis, or any database
let fishCount = 0

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
      // Return current count
      return res.status(200).json({ count: fishCount, success: true })
    }

    if (req.method === 'POST') {
      // Increment count
      fishCount += 1
      return res.status(200).json({ count: fishCount, success: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Fish counter error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
