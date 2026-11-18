import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

export default function Header({ title, subtitle, badge, rightAction, rightActionText }) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.badgeRow}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeText}>CODEALPHA</Text>
          </View>
          {badge ? (
            <View style={styles.taskBadge}>
              <Text style={styles.taskBadgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightAction ? (
        <TouchableOpacity style={styles.actionBtn} onPress={rightAction} activeOpacity={0.7}>
          <Text style={styles.actionBtnText}>{rightActionText || 'Action'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  brandBadge: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  brandBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  taskBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  taskBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionBtnText: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text,
  },
});
