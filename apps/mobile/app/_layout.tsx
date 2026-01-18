import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      // 等待 Zustand 持久化状态恢复
      const rehydrate = (useAuthStore as any).persist?.rehydrate;
      if (rehydrate) {
        await rehydrate();
      }
      const { token, isAuthenticated: authed } = useAuthStore.getState();
      setAuthenticated(authed && !!token);
      setReady(true);
    };

    bootstrap();
  }, []);

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  if (!ready) {
    return (
      <ThemeProvider value={theme}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <Stack initialRouteName={isAuthenticated ? "(tabs)" : "login"}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
