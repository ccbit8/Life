import { create } from "zustand";

export interface AppState {
  // 状态
  isAppReady: boolean;
  networkConnected: boolean;
  theme: "light" | "dark" | "auto";

  // 操作
  setAppReady: (ready: boolean) => void;
  setNetworkConnected: (connected: boolean) => void;
  setTheme: (theme: "light" | "dark" | "auto") => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAppReady: false,
  networkConnected: true,
  theme: "auto",

  setAppReady: (ready) => {
    set({ isAppReady: ready });
  },

  setNetworkConnected: (connected) => {
    set({ networkConnected: connected });
  },

  setTheme: (theme) => {
    set({ theme });
  },
}));
