// Zustand is a lightweight state-management library for React.
// Normally, React's useState manages state inside a single component. Zustand lets multiple components access and update the same state.
import { create } from 'zustand'

// offline -> assembling -> online -> entering -> simulating
// any state -> skipped (Skip button or reduced motion)
export const useExperienceStore = create((set,get) => ({
    state:'offline',  //defines the initial state.
    
     initialize: () => {
    if (get().state === 'offline') set({ state: 'assembling' })
  },
  assemblyDone: () => set({ state: 'online' }),
  enterCore: () => set({ state: 'entering' }),
  entryDone: () => set({ state: 'simulating' }),
  skip: () => set({ state: 'skipped' }),
}))