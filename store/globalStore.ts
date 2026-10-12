// Example store using Zustand for global state management in a Next.js application
// Only use in small applications or exams

import { create } from "zustand";

// Define the shape of the global state
type GlobalStateData = {
  theme: "light" | "dark";
  // Kirakati bemutató: az oldal magától görget és kibontja a záródolgozatokat
  showcase: boolean;
  // A Portfolio éppen kibontott munkájának indexe (null = mind csukva)
  expandedProject: number | null;
};

type GlobalStore = {
  gs: GlobalStateData;
  set: <K extends keyof GlobalStateData>(key: K, value: GlobalStateData[K]) => void;
};

export const useGlobalStore = create<GlobalStore>()((set) => ({
  // Initialize the global state:
  gs: {
    // Az oldal alapértelmezetten sötét témával indul
    theme: "dark",
    showcase: false,
    expandedProject: null,
  },

  set: (key, value) =>
    set((state) => ({
      gs: {
        ...state.gs,
        [key]: value,
      },
    })),
}));
