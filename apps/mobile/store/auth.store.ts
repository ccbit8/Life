import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

// Web 兼容的 storage
const webStorage: StateStorage = {
  getItem: async (name) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch {}
  },
  removeItem: async (name) => {
    try {
      localStorage.removeItem(name);
    } catch {}
  },
};

export interface User {
  id: string;
  phoneNumber: string;
  [key: string]: any;
}

export interface AuthState {
  // 状态
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  _hasHydrated: boolean;

  // 操作
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated });
      },

      login: async (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      restoreSession: async () => {
        // 持久化中间件会自动在应用启动时恢复状态
        const { token } = get();
        return !!token;
      },
    }),
    {
      name: "life.auth.session",
      storage: createJSONStorage(() =>
        Platform.OS === "web" ? webStorage : AsyncStorage,
      ),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
