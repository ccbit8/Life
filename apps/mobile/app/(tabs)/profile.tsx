import { authActions } from "@/actions/auth";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await authActions.logout();
  };

  const handleLogin = () => {
    router.push("/login");
  };

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>我的</ThemedText>
          </View>

          {/* 未登录提示 */}
          <View
            style={[
              styles.notLoginContainer,
              { backgroundColor: isDark ? "#1f2937" : "#f9fafb" },
            ]}
          >
            <View style={styles.notLoginIconContainer}>
              <IconSymbol name="person.fill" size={64} color="#6ee7b7" />
            </View>
            <ThemedText style={styles.notLoginTitle}>未登录</ThemedText>
            <ThemedText style={styles.notLoginDesc}>
              登录后可以查看个人信息和训练数据
            </ThemedText>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.loginButtonText}>前往登录</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  // 已登录状态
  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>我的</ThemedText>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: isDark ? "#1f2937" : "#fff" },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: "#6ee7b7" }]}>
              <ThemedText style={styles.avatarText}>
                {user?.phoneNumber?.[0]?.toUpperCase() || "U"}
              </ThemedText>
            </View>
          </View>
          <ThemedText style={styles.userName}>
            {user?.phoneNumber || "用户"}
          </ThemedText>
          {user?.phoneNumber && (
            <ThemedText style={styles.userPhone}>
              +86{" "}
              {user.phoneNumber.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1****$3")}
            </ThemedText>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              { backgroundColor: isDark ? "#1f2937" : "#fff" },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <IconSymbol name="chart.bar.fill" size={20} color="#6ee7b7" />
              </View>
              <ThemedText style={styles.menuText}>训练数据</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              { backgroundColor: isDark ? "#1f2937" : "#fff" },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <IconSymbol name="target" size={20} color="#6ee7b7" />
              </View>
              <ThemedText style={styles.menuText}>我的目标</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              { backgroundColor: isDark ? "#1f2937" : "#fff" },
            ]}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <IconSymbol name="gearshape.fill" size={20} color="#6ee7b7" />
              </View>
              <ThemedText style={styles.menuText}>设置</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: isDark ? "#111827" : "#fff" },
          ]}
          onPress={handleLogout}
          activeOpacity={0.9}
        >
          <ThemedText style={styles.logoutText}>退出登录</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  // 未登录状态样式
  notLoginContainer: {
    marginHorizontal: 20,
    marginTop: 60,
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notLoginIconContainer: {
    marginBottom: 16,
  },
  notLoginTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  notLoginDesc: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  loginButton: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#6ee7b7",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  // 已登录状态样式
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "600",
    color: "#fff",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    opacity: 0.6,
  },
  menuSection: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 24,
    opacity: 0.3,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 15,
  },
});
