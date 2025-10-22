// Fish counter service using Vercel API routes
// No external dependencies needed - uses your own API

const API_ENDPOINT = '/api/fish-counter'

interface FishCounterResponse {
  count: number
  success: boolean
}

export const fishCounterService = {
  // Fetch current fish count from Vercel API
  async getFishCount(): Promise<number> {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch fish count')
      }

      const data: FishCounterResponse = await response.json()
      return data.count || 0
    } catch (error) {
      console.error('Failed to fetch fish count:', error)
      // Fallback to localStorage
      const localCount = localStorage.getItem('globalCatFishCount')
      return localCount ? parseInt(localCount) : 0
    }
  },

  // Increment fish count via Vercel API
  async incrementFishCount(currentCount: number): Promise<number> {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to increment fish count')
      }

      const data: FishCounterResponse = await response.json()
      const newCount = data.count

      // Update localStorage as cache
      localStorage.setItem('globalCatFishCount', newCount.toString())

      return newCount
    } catch (error) {
      console.error('Failed to increment fish count:', error)
      // Fallback to local increment
      const newCount = currentCount + 1
      localStorage.setItem('globalCatFishCount', newCount.toString())
      return newCount
    }
  }
}
