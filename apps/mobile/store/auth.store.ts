import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

  // 操作
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
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

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setToken: (token) => {
        set({ token });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
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
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
