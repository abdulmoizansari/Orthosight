import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingData } from '../types/onboarding';

interface OnboardingState {
  data: Partial<OnboardingData>;
  currentStep: number;
  isComplete: boolean;
  updateData: (partial: Partial<OnboardingData>) => void;
  setStep: (step: number) => void;
  reset: () => void;
  markComplete: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      data: {},
      currentStep: 0,
      isComplete: false,
      updateData: (partial) =>
        set((state) => ({ data: { ...state.data, ...partial } })),
      setStep: (step) => set({ currentStep: step }),
      reset: () => set({ data: {}, currentStep: 0, isComplete: false }),
      markComplete: () => set({ isComplete: true }),
    }),
    {
      name: 'orthosight-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
