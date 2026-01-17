import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 模拟数据
const workoutData = [
  {
    id: '1',
    title: '标准深蹲训练',
    image: require('@/assets/images/partial-react-logo.png'),
    level: '中级难度',
    duration: '12 分钟',
    tag: 'AI DETECT',
  },
  {
    id: '2',
    title: '标准俯卧撑',
    image: require('@/assets/images/partial-react-logo.png'),
    level: '入门',
    duration: '8 分钟',
    tag: 'AI COUNTING',
  },
  {
    id: '3',
    title: '流瑜伽：战士二式',
    image: require('@/assets/images/partial-react-logo.png'),
    level: '瑜伽',
    duration: '20 分钟',
    tag: null,
  },
];

const categories = ['全部', '深蹲', '俯卧撑', '瑜伽'];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderWorkoutCard = ({ item }: { item: typeof workoutData[0] }) => (
    <TouchableOpacity style={[styles.workoutCard, { backgroundColor: isDark ? '#1f2937' : '#fff' }]} activeOpacity={0.9}>
      <View style={styles.cardImageContainer}>
        {item.tag && (
          <View style={[styles.aiTag, { backgroundColor: isDark ? '#374151' : '#fff' }]}>
            <IconSymbol name="sparkles" size={14} color="#6ee7b7" />
            <ThemedText style={[styles.aiTagText, { color: isDark ? '#e5e7eb' : '#333' }]}> {item.tag}</ThemedText>
          </View>
        )}
        <Image source={item.image} style={styles.cardImage} contentFit="cover" />
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardInfo}>
          <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>{item.title}</ThemedText>
          <View style={styles.cardMeta}>
            <View style={[styles.levelBadge, { backgroundColor: '#6ee7b7' }]}>
              <ThemedText style={styles.levelText}>{item.level}</ThemedText>
            </View>
            <View style={styles.durationContainer}>
              <IconSymbol name="clock" size={12} color={isDark ? '#999' : '#666'} />
              <ThemedText style={[styles.durationText, { color: isDark ? '#999' : '#666' }]}> {item.duration}</ThemedText>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.playButton}>
          <LinearGradient
            colors={['#6ee7b7', '#5eead4']}
            style={styles.playButtonGradient}>
            <IconSymbol name="play.fill" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>健身动作选择</ThemedText>
        <TouchableOpacity style={styles.profileButton}>
          <View style={[styles.profileCircle, { backgroundColor: '#6ee7b7' }]}>
            <ThemedText style={styles.profileText}>9</ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1f2937' : '#f9fafb' }]}>
        <IconSymbol name="magnifyingglass" size={18} color={isDark ? '#888' : '#999'} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
          placeholder="查找动作、课程或教练..."
          placeholderTextColor={isDark ? '#888' : '#999'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category ? styles.categoryTabActive : { backgroundColor: isDark ? '#374151' : '#f0f0f0' },
            ]}
            onPress={() => setSelectedCategory(category)}>
            <ThemedText
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
                selectedCategory !== category && { color: isDark ? '#aaa' : '#666' },
              ]}>
              {category}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <ThemedText style={styles.sectionTitle}>为你推荐</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>基于您的运动习惯</ThemedText>
        </View>
        <TouchableOpacity>
          <ThemedText style={[styles.viewAllText, { color: isDark ? '#5eead4' : '#6ee7b7' }]}>查看全部 →</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Workout List */}
      <FlatList
        data={workoutData}
        renderItem={renderWorkoutCard}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient colors={['#6ee7b7', '#5eead4']} style={styles.fabGradient}>
          <IconSymbol name="camera.fill" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  profileButton: {
    padding: 4,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  categoryScroll: {
    marginBottom: 20,
    height: 38,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 20,
    // paddingVertical: 6,
    borderRadius: 20,
    // minHeight: 22,
    justifyContent: 'center',
  },
  categoryTabActive: {
    backgroundColor: '#6ee7b7',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    lineHeight: 20,
  },
  categoryTextActive: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 28,
  },
  sectionSubtitle: {
    fontSize: 13,
    opacity: 0.5,
    lineHeight: 18,
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: '#6ee7b7',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  workoutCard: {
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    height: 200,
  },
  aiTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    lineHeight: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
    lineHeight: 22,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#fff',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    lineHeight: 16,
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    marginLeft: 12,
  },
  playButtonGradient: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 20,
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 28,
  },
});
