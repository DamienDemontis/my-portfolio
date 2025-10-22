// Real-time fish counter using Supabase (free, lightweight, real-time)
// Setup: https://supabase.com/docs/guides/realtime

import { createClient, RealtimeChannel } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let realtimeChannel: RealtimeChannel | null = null

export const fishCounterRealtimeService = {
  // Subscribe to real-time fish count updates
  subscribeToFishCount(callback: (count: number) => void) {
    if (realtimeChannel) {
      return // Already subscribed
    }

    realtimeChannel = supabase
      .channel('fish-counter-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fish_counter'
        },
        (payload) => {
          if (payload.new && 'count' in payload.new) {
            callback(payload.new.count as number)
          }
        }
      )
      .subscribe()

    return () => {
      realtimeChannel?.unsubscribe()
      realtimeChannel = null
    }
  },

  // Fetch current fish count
  async getFishCount(): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('fish_counter')
        .select('count')
        .single()

      if (error) throw error
      return data?.count || 0
    } catch (error) {
      console.error('Failed to fetch fish count:', error)
      // Fallback to localStorage
      const localCount = localStorage.getItem('globalCatFishCount')
      return localCount ? parseInt(localCount) : 0
    }
  },

  // Increment fish count
  async incrementFishCount(): Promise<number> {
    try {
      // Call Supabase RPC function for atomic increment
      const { data, error } = await supabase.rpc('increment_fish_count')

      if (error) throw error

      const newCount = data as number
      localStorage.setItem('globalCatFishCount', newCount.toString())
      return newCount
    } catch (error) {
      console.error('Failed to increment fish count:', error)
      // Fallback to localStorage
      const localCount = localStorage.getItem('globalCatFishCount')
      const newCount = (localCount ? parseInt(localCount) : 0) + 1
      localStorage.setItem('globalCatFishCount', newCount.toString())
      return newCount
    }
  },

  // Cleanup
  unsubscribe() {
    realtimeChannel?.unsubscribe()
    realtimeChannel = null
  }
}
