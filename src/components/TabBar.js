import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { theme } from '../styles/theme';

export default function TabBar({ currentTab, onSelectTab }) {
  const tabs = [
    { key: 'hub', label: 'Suite Hub', icon: '⚡', color: theme.colors.primary },
    { key: 'task1', label: 'Flashcards', icon: '🗂️', color: theme.colors.task1 },
    { key: 'task2', label: 'Quotes', icon: '💬', color: theme.colors.task2 },
    { key: 'task3', label: 'Fitness', icon: '🏃', color: theme.colors.task3 },
    { key: 'task4', label: 'Languages', icon: '🌐', color: theme.colors.task4 },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {tabs.map((tab) => {
          const isActive = currentTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => onSelectTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.icon, isActive && { transform: [{ scale: 1.1 }] }]}>{tab.icon}</Text>
              <Text
                style={[
                  styles.label,
                  isActive ? { color: tab.color, fontWeight: '700' } : { color: theme.colors.textMuted },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {isActive ? <View style={[styles.activeDot, { backgroundColor: tab.color }]} /> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    ...theme.shadows.md,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 12,
  },
  tabItemActive: {
    backgroundColor: '#F8FAFC',
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
  },
});
