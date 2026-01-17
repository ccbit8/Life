import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';

const trainingPlans = [
  {
    id: '1',
    name: '初级训练计划',
    duration: '4周',
    level: '入门',
    description: '适合健身初学者，循序渐进提升体能',
    sessions: 3,
  },
  {
    id: '2',
    name: '增肌计划',
    duration: '8周',
    level: '中级',
    description: '专注于肌肉增长和力量提升',
    sessions: 4,
  },
  {
    id: '3',
    name: '减脂计划',
    duration: '12周',
    level: '高级',
    description: '高强度有氧和力量训练结合',
    sessions: 5,
  },
  {
    id: '4',
    name: '瑜伽柔韧性计划',
    duration: '6周',
    level: '中级',
    description: '提升身体柔韧性和心理平衡',
    sessions: 3,
  },
];

const weeklySchedule = [
  { day: '周一', workout: '胸部和三头肌' },
  { day: '周二', workout: '背部和二头肌' },
  { day: '周三', workout: '腿部训练' },
  { day: '周四', workout: '休息或拉伸' },
  { day: '周五', workout: '肩部和核心' },
  { day: '周六', workout: '有氧训练' },
  { day: '周日', workout: '休息' },
];

export default function PlanScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#6ee7b7', dark: '#2d5a4a' }}
      headerImage={
        <View style={styles.headerImage}>
          <IconSymbol
            size={120}
            color="#fff"
            name="calendar"
          />
        </View>
      }>
      <ThemedView style={styles.container}>
        {/* 标题部分 */}
        <View style={styles.titleSection}>
          <ThemedText style={styles.mainTitle}>我的训练计划</ThemedText>
          <ThemedText style={styles.subtitle}>选择适合您的训练课程</ThemedText>
        </View>

        {/* 训练计划卡片 */}
        <View style={styles.plansContainer}>
          {trainingPlans.map((plan) => (
            <TouchableOpacity key={plan.id} style={styles.planCard}>
              <LinearGradient
                colors={['#6ee7b7', '#5eead4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.planCardGradient}>
                <View style={styles.planHeader}>
                  <ThemedText style={styles.planName}>{plan.name}</ThemedText>
                  <View style={styles.levelBadge}>
                    <ThemedText style={styles.levelText}>{plan.level}</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.planDescription}>{plan.description}</ThemedText>
                <View style={styles.planFooter}>
                  <View style={styles.planInfo}>
                    <IconSymbol name="calendar" size={14} color="#fff" />
                    <ThemedText style={styles.planMeta}>{plan.duration}</ThemedText>
                  </View>
                  <View style={styles.planInfo}>
                    <IconSymbol name="dumbbell" size={14} color="#fff" />
                    <ThemedText style={styles.planMeta}>{plan.sessions}次/周</ThemedText>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* 周度计划 */}
        <View style={styles.scheduleSection}>
          <ThemedText style={styles.sectionTitle}>本周计划</ThemedText>
          <ScrollView 
            style={styles.scheduleContainer}
            showsVerticalScrollIndicator={false}>
            {weeklySchedule.map((item, index) => (
              <View key={index} style={[styles.scheduleItem, { backgroundColor: isDark ? '#374151' : '#f5f5f5' }]}>
                <View style={styles.dayBadge}>
                  <ThemedText style={styles.dayText}>{item.day}</ThemedText>
                </View>
                <View style={styles.workoutContent}>
                  <ThemedText style={[styles.workoutName, { color: isDark ? '#fff' : '#000' }]}>{item.workout}</ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={18} color={isDark ? '#5eead4' : '#6ee7b7'} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 快速开始按钮 */}
        <TouchableOpacity style={styles.startButton}>
          <LinearGradient
            colors={['#6ee7b7', '#5eead4']}
            style={styles.startButtonGradient}>
            <IconSymbol name="play.fill" size={20} color="#fff" />
            <ThemedText style={styles.startButtonText}>立即开始</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  headerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    lineHeight: 20,
  },
  plansContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  planCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  planCardGradient: {
    padding: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 24,
    flex: 1,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 16,
  },
  planDescription: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 18,
  },
  planFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  planMeta: {
    fontSize: 12,
    color: '#fff',
    lineHeight: 16,
  },
  scheduleSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 28,
  },
  scheduleContainer: {
    maxHeight: 300,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  dayBadge: {
    backgroundColor: '#6ee7b7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 16,
  },
  workoutContent: {
    flex: 1,
    marginLeft: 12,
  },
  workoutName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    lineHeight: 20,
  },
  startButton: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  startButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 22,
  },
});
