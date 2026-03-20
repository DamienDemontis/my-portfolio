// Real-time fish counter using Supabase (free, lightweight, real-time)
// Falls back to localStorage when Supabase is not configured.

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const isSupabaseConfigured = !!(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL.startsWith('http')
)

let supabase: SupabaseClient | null = null
if (isSupabaseConfigured) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

let realtimeChannel: RealtimeChannel | null = null

function getLocalCount(): number {
  const localCount = localStorage.getItem('globalCatFishCount')
  return localCount ? parseInt(localCount) : 0
}

export const fishCounterRealtimeService = {
  subscribeToFishCount(callback: (count: number) => void) {
    if (!supabase || realtimeChannel) return

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

  async getFishCount(): Promise<number> {
    if (!supabase) return getLocalCount()

    try {
      const { data, error } = await supabase
        .from('fish_counter')
        .select('count')
        .single()

      if (error) throw error
      return data?.count || 0
    } catch {
      return getLocalCount()
    }
  },

  async incrementFishCount(): Promise<number> {
    if (!supabase) {
      const newCount = getLocalCount() + 1
      localStorage.setItem('globalCatFishCount', newCount.toString())
      return newCount
    }

    try {
      const { data, error } = await supabase.rpc('increment_fish_count')

      if (error) throw error

      const newCount = data as number
      localStorage.setItem('globalCatFishCount', newCount.toString())
      return newCount
    } catch {
      const newCount = getLocalCount() + 1
      localStorage.setItem('globalCatFishCount', newCount.toString())
      return newCount
    }
  },

  unsubscribe() {
    realtimeChannel?.unsubscribe()
    realtimeChannel = null
  }
}
