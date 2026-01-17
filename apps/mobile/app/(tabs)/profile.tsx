import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>我的</ThemedText>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: '#6ee7b7' }]}>
              <ThemedText style={styles.avatarText}>U</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.userName}>用户名</ThemedText>
          <ThemedText style={styles.userPhone}>+86 138****8888</ThemedText>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <IconSymbol name="chart.bar.fill" size={20} color="#6ee7b7" />
              </View>
              <ThemedText style={styles.menuText}>训练数据</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <IconSymbol name="target" size={20} color="#6ee7b7" />
              </View>
              <ThemedText style={styles.menuText}>我的目标</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}>
            <View style={styles.menuItemLeft}>
              <View style={styles.iconContainer}>
                <IconSymbol name="gearshape.fill" size={20} color="#6ee7b7" />
              </View>
              <ThemedText style={styles.menuText}>设置</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={20} color="#999" />
          </TouchableOpacity>
        </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 24,
    opacity: 0.3,
  },
});
