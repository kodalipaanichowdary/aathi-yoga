import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT = 4

/**
 * Recent search terms, newest first, so the search field can offer them back on
 * focus. Persisted because "what did I look for last time" is only useful
 * across sessions.
 */
export const useSearchStore = create(
  persist(
    (set) => ({
      recent: [],
      remember(term) {
        const clean = term.trim()
        if (!clean) return
        set((state) => ({
          recent: [clean, ...state.recent.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(
            0,
            MAX_RECENT,
          ),
        }))
      },
      clear() {
        set({ recent: [] })
      },
    }),
    { name: 'aathi-yoga-recent-searches' },
  ),
)
