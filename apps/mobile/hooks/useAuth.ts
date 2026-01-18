import { useAuthStore } from "@/store";
import { useCallback } from "react";

/**
 * 使用认证状态和操作的 Hook（默认导出）
 */
function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    setLoading,
    login,
    logout,
    restoreSession,
  } = useAuthStore();

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  }, [logout, setLoading]);

  const handleLogin = useCallback(
    async (user: unknown, token: unknown) => {
      setLoading(true);
      try {
        await login(user as any, token as any);
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading],
  );

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    setUser,
    setToken,
    login: handleLogin,
    logout: handleLogout,
    restoreSession,
  };
}

export default useAuth;
export { useAuth };

