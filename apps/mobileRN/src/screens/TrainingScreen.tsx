import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { MainTabParamList } from '../navigation/types';

type Props = BottomTabScreenProps<MainTabParamList, 'Training'>;

export default function TrainingScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>训练</Text>
        <Text style={styles.subtitle}>开始你的训练计划</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>训练计划</Text>

          <TouchableOpacity style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>力量训练</Text>
              <Text style={styles.planBadge}>进行中</Text>
            </View>
            <Text style={styles.planDescription}>增强核心力量和肌肉耐力</Text>
            <Text style={styles.planMeta}>本周完成 3/5 次</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.planCard}>
            <View style={styles.planHeader}>
              <Text style={styles.planTitle}>有氧运动</Text>
              <Text style={[styles.planBadge, styles.planBadgeInactive]}>
                未开始
              </Text>
            </View>
            <Text style={styles.planDescription}>提升心肺功能和耐力水平</Text>
            <Text style={styles.planMeta}>本周完成 0/3 次</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  planBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  planBadgeInactive: {
    backgroundColor: '#9E9E9E',
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  planMeta: {
    fontSize: 13,
    color: '#999',
  },
});
