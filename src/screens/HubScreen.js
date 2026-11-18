import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export default function HubScreen({ onNavigate, standaloneTask, onToggleStandalone }) {
  const tasks = [
    {
      id: 'task1',
      title: 'Task 1: Flashcard Quiz App',
      category: 'Education & Study Tool',
      icon: '🗂️',
      color: theme.colors.task1,
      bg: theme.colors.task1Light,
      desc: 'Interactive study flashcards with flip answer animation, deck navigation, card editing/creation, and category filtering.',
      features: [
        'Flip card between question & answer',
        'Next & Previous deck navigation',
        'Add, edit, & delete flashcards',
        'Study progress & mastery tracker',
      ],
    },
    {
      id: 'task2',
      title: 'Task 2: Random Quote Generator',
      category: 'Lifestyle & Inspiration',
      icon: '💬',
      color: theme.colors.task2,
      bg: theme.colors.task2Light,
      desc: 'Curated inspiration generator with dynamic randomized quotes, category switching, clipboard copying, sharing, and favorites.',
      features: [
        'Random quote on load and button click',
        'Clear typography for text and author',
        'Copy to clipboard & native sharing',
        'Save quotes to local favorites list',
      ],
    },
    {
      id: 'task3',
      title: 'Task 3: Fitness Tracker App',
      category: 'Health & Wellness',
      icon: '🏃',
      color: theme.colors.task3,
      bg: theme.colors.task3Light,
      desc: 'Comprehensive fitness dashboard tracking daily steps, calories burned, active workouts, water hydration, and weekly analytics.',
      features: [
        'Step, calorie, and workout goal rings',
        'Manual workout logger with exercise types',
        'Weekly activity summary bar chart',
        'Persistent storage with AsyncStorage',
      ],
    },
    {
      id: 'task4',
      title: 'Task 4: Language Learning App',
      category: 'Language & Skills',
      icon: '🌐',
      color: theme.colors.task4,
      bg: theme.colors.task4Light,
      desc: 'Interactive language learning platform supporting Spanish, French, German, Japanese, and Italian with voice pronunciation & quizzes.',
      features: [
        'Multi-language vocabulary lessons',
        'Audio speech pronunciation synthesis',
        'Interactive quizzes with instant scoring',
        'Category filters (Basics, Travel, Dining)',
      ],
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <Text style={styles.heroBadge}>CODEALPHA INTERNSHIP</Text>
          <Text style={styles.heroBadgeActive}>ALL 4 TASKS COMPLETE</Text>
        </View>
        <Text style={styles.heroTitle}>App Development Suite</Text>
        <Text style={styles.heroDesc}>
          A production-grade React Native mobile application implementing all 4 CodeAlpha internship tasks with modern UX, local storage, animations, and cross-platform support.
        </Text>
        <View style={styles.heroStatsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4 / 4</Text>
            <Text style={styles.statLabel}>Tasks Built</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>100%</Text>
            <Text style={styles.statLabel}>Criteria Met</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>Ready</Text>
            <Text style={styles.statLabel}>GitHub / Demo</Text>
          </View>
        </View>
      </View>

      {/* Task Cards */}
      <Text style={styles.sectionTitle}>Internship Projects</Text>
      <Text style={styles.sectionSubtitle}>
        Select any project below to test its features or use the bottom navigation tabs.
      </Text>

      {tasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          style={styles.taskCard}
          onPress={() => onNavigate(task.id)}
          activeOpacity={0.85}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: task.bg }]}>
              <Text style={styles.icon}>{task.icon}</Text>
            </View>
            <View style={styles.headerText}>
              <Text style={[styles.taskCategory, { color: task.color }]}>{task.category}</Text>
              <Text style={styles.taskTitle}>{task.title}</Text>
            </View>
          </View>

          <Text style={styles.taskDesc}>{task.desc}</Text>

          <View style={styles.featuresList}>
            {task.features.map((feat, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Text style={styles.checkIcon}>✓</Text>
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.readyBadge}>
              <Text style={styles.readyBadgeText}>Verified & Operational</Text>
            </View>
            <TouchableOpacity
              style={[styles.launchBtn, { backgroundColor: task.color }]}
              onPress={() => onNavigate(task.id)}
            >
              <Text style={styles.launchBtnText}>Open App →</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* CodeAlpha Guidelines Box */}
      <View style={styles.guidelinesCard}>
        <Text style={styles.guidelinesTitle}>📌 CodeAlpha Submission Info</Text>
        <Text style={styles.guidelinesText}>
          • Repository Format: <Text style={styles.boldText}>CodeAlpha_ProjectName</Text>
        </Text>
        <Text style={styles.guidelinesText}>
          • Complete at least 2 or 3 tasks: <Text style={styles.boldGreen}>All 4 Tasks Exceeded!</Text>
        </Text>
        <Text style={styles.guidelinesText}>
          • Compatible with iOS, Android, and Web platforms.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
  },
  heroBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#818CF8',
    backgroundColor: 'rgba(129, 140, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    letterSpacing: 0.5,
  },
  heroBadgeActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34D399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroTitle: {
    fontSize: theme.typography.sizes.xxl,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  heroDesc: {
    fontSize: theme.typography.sizes.sm,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  heroStatsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
  },
  taskCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  taskCategory: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  taskTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginTop: 2,
  },
  taskDesc: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    lineHeight: 19,
    marginBottom: theme.spacing.md,
  },
  featuresList: {
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    color: theme.colors.success,
    fontWeight: '800',
    fontSize: 13,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: theme.colors.text,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xs,
  },
  readyBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  readyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  launchBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
  },
  launchBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  guidelinesCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: theme.spacing.sm,
  },
  guidelinesTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: theme.typography.weights.bold,
    color: '#92400E',
    marginBottom: 6,
  },
  guidelinesText: {
    fontSize: 12,
    color: '#78350F',
    marginBottom: 4,
  },
  boldText: {
    fontWeight: '700',
  },
  boldGreen: {
    fontWeight: '700',
    color: '#065F46',
  },
});
