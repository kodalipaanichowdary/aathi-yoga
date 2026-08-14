import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useModeStore = create(
  persist(
    (set) => ({
      mode: 'yoga',
      setMode(mode) {
        set({ mode })
      },
    }),
    { name: 'aathi-yoga-mode' },
  ),
)
