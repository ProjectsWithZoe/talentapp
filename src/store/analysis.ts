import { create } from "zustand";
import type { AnalysisResult } from "@/lib/analysis-schema";

interface AnalysisState {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  setResult: (result: AnalysisResult) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  result: null,
  isLoading: false,
  error: null,
  setResult: (result) => set({ result, isLoading: false, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set({ result: null, isLoading: false, error: null }),
}));
