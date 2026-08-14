import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCourseStore = create(
  persist(
    (set, get) => ({
      progress: {},
      completedSessions: [],

      setProgress(courseId, poseIndex) {
        set((state) => ({ progress: { ...state.progress, [courseId]: poseIndex } }))
      },

      getProgress(courseId) {
        return get().progress[courseId] ?? 0
      },

      completeSession(courseId, durationMinutes, calories) {
        set((state) => ({
          progress: { ...state.progress, [courseId]: 0 },
          completedSessions: [
            ...state.completedSessions,
            { courseId, durationMinutes, calories, completedAt: Date.now() },
          ],
        }))
      },
    }),
    {
      name: 'aathi-yoga-course-progress',
      partialize: (state) => ({ progress: state.progress, completedSessions: state.completedSessions }),
    },
  ),
)
