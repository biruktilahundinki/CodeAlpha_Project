import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { theme } from '../styles/theme';
import {
  initialFitnessGoals,
  workoutTypes,
  initialFitnessState,
} from '../data/fitnessData';
import { storage } from '../utils/storage';

const FITNESS_STORAGE_KEY = '@codealpha_fitness_data_v1';

export default function FitnessScreen() {
  const [goals, setGoals] = useState(initialFitnessGoals);
  const [fitnessData, setFitnessData] = useState(initialFitnessState);
  const [logModalVisible, setLogModalVisible] = useState(false);
  const [stepModalVisible, setStepModalVisible] = useState(false);

  // Form State for Workout Log
  const [selectedWorkoutType, setSelectedWorkoutType] = useState(workoutTypes[0].id);
  const [workoutDuration, setWorkoutDuration] = useState('30');
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutCalories, setWorkoutCalories] = useState('');

  // Form State for Steps
  const [addStepsInput, setAddStepsInput] = useState('1000');

  // Load from Storage
  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(FITNESS_STORAGE_KEY);
      if (saved && saved.today) {
        setFitnessData(saved);
      }
    })();
  }, []);

  const persistFitness = async (newData) => {
    setFitnessData(newData);
    await storage.setItem(FITNESS_STORAGE_KEY, newData);
  };

  // Recalculate auto-calories based on duration and workout type
  const handleDurationChange = (text) => {
    setWorkoutDuration(text);
    const mins = parseInt(text, 10);
    const typeObj = workoutTypes.find((w) => w.id === selectedWorkoutType);
    if (!isNaN(mins) && typeObj) {
      const estimated = Math.round((mins / 60) * typeObj.calPerHour);
      setWorkoutCalories(estimated.toString());
    }
  };

  const handleSelectWorkoutType = (typeId) => {
    setSelectedWorkoutType(typeId);
    const mins = parseInt(workoutDuration, 10);
    const typeObj = workoutTypes.find((w) => w.id === typeId);
    if (!isNaN(mins) && typeObj) {
      const estimated = Math.round((mins / 60) * typeObj.calPerHour);
      setWorkoutCalories(estimated.toString());
    }
  };

  // Log Workout Save
  const handleSaveWorkout = () => {
    const mins = parseInt(workoutDuration, 10);
    const cals = parseInt(workoutCalories, 10);

    if (isNaN(mins) || mins <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a valid workout duration.');
      } else {
        Alert.alert('Invalid Duration', 'Please enter workout duration in minutes.');
      }
      return;
    }

    const typeObj = workoutTypes.find((w) => w.id === selectedWorkoutType);
    const newWorkout = {
      id: `w-${Date.now()}`,
      type: selectedWorkoutType,
      title: workoutTitle.trim() || `${typeObj?.name || 'Workout'} Session`,
      durationMinutes: mins,
      caloriesBurned: !isNaN(cals) ? cals : Math.round((mins / 60) * 400),
      timestamp: 'Just now',
    };

    const updated = {
      ...fitnessData,
      today: {
        ...fitnessData.today,
        caloriesBurned: fitnessData.today.caloriesBurned + newWorkout.caloriesBurned,
        activeMinutes: fitnessData.today.activeMinutes + newWorkout.durationMinutes,
      },
      recentWorkouts: [newWorkout, ...fitnessData.recentWorkouts],
    };

    persistFitness(updated);
    setLogModalVisible(false);
    setWorkoutTitle('');
    setWorkoutDuration('30');
  };

  // Delete Workout
  const handleDeleteWorkout = (id) => {
    const workoutToDelete = fitnessData.recentWorkouts.find((w) => w.id === id);
    const updated = {
      ...fitnessData,
      today: {
        ...fitnessData.today,
        caloriesBurned: Math.max(
          0,
          fitnessData.today.caloriesBurned - (workoutToDelete?.caloriesBurned || 0)
        ),
        activeMinutes: Math.max(
          0,
          fitnessData.today.activeMinutes - (workoutToDelete?.durationMinutes || 0)
        ),
      },
      recentWorkouts: fitnessData.recentWorkouts.filter((w) => w.id !== id),
    };
    persistFitness(updated);
  };

  // Water Hydration Tracker
  const handleUpdateWater = (delta) => {
    const newGlasses = Math.max(0, fitnessData.today.waterGlasses + delta);
    const updated = {
      ...fitnessData,
      today: {
        ...fitnessData.today,
        waterGlasses: newGlasses,
      },
    };
    persistFitness(updated);
  };

  // Add Steps
  const handleAddSteps = () => {
    const stepsToAdd = parseInt(addStepsInput, 10);
    if (!isNaN(stepsToAdd) && stepsToAdd > 0) {
      const updated = {
        ...fitnessData,
        today: {
          ...fitnessData.today,
          steps: fitnessData.today.steps + stepsToAdd,
        },
      };
      persistFitness(updated);
      setStepModalVisible(false);
      setAddStepsInput('1000');
    }
  };

  // Percentages for Progress Bars
  const stepsPercent = Math.min(
    100,
    Math.round((fitnessData.today.steps / goals.dailyStepsGoal) * 100)
  );
  const caloriesPercent = Math.min(
    100,
    Math.round((fitnessData.today.caloriesBurned / goals.dailyCaloriesGoal) * 100)
  );
  const minutesPercent = Math.min(
    100,
    Math.round((fitnessData.today.activeMinutes / goals.dailyActiveMinutesGoal) * 100)
  );
  const waterPercent = Math.min(
    100,
    Math.round((fitnessData.today.waterGlasses / goals.dailyWaterGlassesGoal) * 100)
  );

  // Highest weekly calories for chart scaling
  const maxWeeklyCal = Math.max(...fitnessData.weeklySummary.map((d) => d.calories), 700);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Action Header */}
      <View style={styles.topActionRow}>
        <View>
          <Text style={styles.dateLabel}>TODAY'S OVERVIEW</Text>
          <Text style={styles.headerTitle}>Daily Fitness Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.primaryLogBtn}
          onPress={() => setLogModalVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryLogBtnText}>+ Log Workout</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Cards Grid */}
      <View style={styles.grid}>
        {/* Steps Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricIcon}>👟</Text>
            <TouchableOpacity onPress={() => setStepModalVisible(true)}>
              <Text style={styles.quickAddText}>+ Add Steps</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.metricValue}>
            {fitnessData.today.steps.toLocaleString()}
          </Text>
          <Text style={styles.metricGoal}>Goal: {goals.dailyStepsGoal.toLocaleString()}</Text>
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${stepsPercent}%`, backgroundColor: '#3B82F6' },
              ]}
            />
          </View>
          <Text style={styles.progressPercentText}>{stepsPercent}% completed</Text>
        </View>

        {/* Calories Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricIcon}>🔥</Text>
            <Text style={styles.metricSub}>Active Burn</Text>
          </View>
          <Text style={styles.metricValue}>{fitnessData.today.caloriesBurned} kcal</Text>
          <Text style={styles.metricGoal}>Goal: {goals.dailyCaloriesGoal} kcal</Text>
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${caloriesPercent}%`, backgroundColor: '#EF4444' },
              ]}
            />
          </View>
          <Text style={styles.progressPercentText}>{caloriesPercent}% completed</Text>
        </View>

        {/* Active Minutes Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricIcon}>⏱️</Text>
            <Text style={styles.metricSub}>Exercise</Text>
          </View>
          <Text style={styles.metricValue}>{fitnessData.today.activeMinutes} min</Text>
          <Text style={styles.metricGoal}>Goal: {goals.dailyActiveMinutesGoal} min</Text>
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${minutesPercent}%`, backgroundColor: '#10B981' },
              ]}
            />
          </View>
          <Text style={styles.progressPercentText}>{minutesPercent}% completed</Text>
        </View>

        {/* Water Hydration Card */}
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricIcon}>💧</Text>
            <View style={styles.waterControls}>
              <TouchableOpacity
                style={styles.waterBtn}
                onPress={() => handleUpdateWater(-1)}
              >
                <Text style={styles.waterBtnText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.waterBtn}
                onPress={() => handleUpdateWater(1)}
              >
                <Text style={styles.waterBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.metricValue}>{fitnessData.today.waterGlasses} glasses</Text>
          <Text style={styles.metricGoal}>Goal: {goals.dailyWaterGlassesGoal} glasses</Text>
          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${waterPercent}%`, backgroundColor: '#06B6D4' },
              ]}
            />
          </View>
          <Text style={styles.progressPercentText}>{waterPercent}% completed</Text>
        </View>
      </View>

      {/* Weekly Progress Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Weekly Calorie Burn Progress</Text>
          <Text style={styles.chartSubtitle}>Daily expenditure (kcal)</Text>
        </View>

        <View style={styles.barChartContainer}>
          {fitnessData.weeklySummary.map((dayItem, idx) => {
            const barHeight = Math.max(15, Math.round((dayItem.calories / maxWeeklyCal) * 110));
            const isToday = dayItem.day === 'Sun';
            return (
              <View key={idx} style={styles.barCol}>
                <Text style={styles.barValueText}>{dayItem.calories}</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: barHeight },
                      isToday ? styles.barFillActive : styles.barFillRegular,
                    ]}
                  />
                </View>
                <Text style={[styles.barDayText, isToday && styles.barDayTextActive]}>
                  {dayItem.day}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Recent Workouts Log */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Recent Activity Logs</Text>
        <Text style={styles.sectionCount}>
          {fitnessData.recentWorkouts.length} logged
        </Text>
      </View>

      {fitnessData.recentWorkouts.map((workout) => {
        const typeObj = workoutTypes.find((w) => w.id === workout.type);
        return (
          <View key={workout.id} style={styles.workoutItem}>
            <View style={[styles.workoutIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Text style={styles.workoutEmoji}>{typeObj?.icon || '🏃'}</Text>
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutTitle}>{workout.title}</Text>
              <Text style={styles.workoutMeta}>
                {workout.durationMinutes} mins • {workout.caloriesBurned} kcal • {workout.timestamp}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteWorkout(workout.id)}
              style={styles.deleteWorkoutBtn}
            >
              <Text style={styles.deleteWorkoutText}>✕</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* Log Workout Modal */}
      <Modal visible={logModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Fitness Workout</Text>

            <Text style={styles.inputLabel}>Select Exercise Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.workoutTypeScroll}
            >
              {workoutTypes.map((type) => {
                const isSelected = selectedWorkoutType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.typeSelectPill, isSelected && styles.typeSelectPillActive]}
                    onPress={() => handleSelectWorkoutType(type.id)}
                  >
                    <Text style={styles.typeEmoji}>{type.icon}</Text>
                    <Text style={[styles.typeSelectName, isSelected && styles.typeSelectNameActive]}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.inputLabel}>Session Title (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Evening Speed Run, Leg Day"
              value={workoutTitle}
              onChangeText={setWorkoutTitle}
            />

            <View style={styles.rowInputs}>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>Duration (Minutes)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={workoutDuration}
                  onChangeText={handleDurationChange}
                />
              </View>
              <View style={styles.flex1}>
                <Text style={styles.inputLabel}>Calories Burned (kcal)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={workoutCalories}
                  onChangeText={setWorkoutCalories}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setLogModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveWorkout}>
                <Text style={styles.modalSaveText}>Save Activity</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Steps Modal */}
      <Modal visible={stepModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Step Count</Text>
            <Text style={styles.inputLabel}>Steps to add</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={addStepsInput}
              onChangeText={setAddStepsInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setStepModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleAddSteps}>
                <Text style={styles.modalSaveText}>Add Steps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  topActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.task3,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    marginTop: 2,
  },
  primaryLogBtn: {
    backgroundColor: theme.colors.task3,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadows.sm,
  },
  primaryLogBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: theme.spacing.xl,
  },
  metricCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricIcon: {
    fontSize: 22,
  },
  metricSub: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  quickAddText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.task3,
  },
  metricValue: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '800',
    color: theme.colors.text,
    marginVertical: 2,
  },
  metricGoal: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
    fontWeight: '600',
  },
  waterControls: {
    flexDirection: 'row',
    gap: 4,
  },
  waterBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284C7',
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.sm,
  },
  chartHeader: {
    marginBottom: theme.spacing.lg,
  },
  chartTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '800',
    color: theme.colors.text,
  },
  chartSubtitle: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barValueText: {
    fontSize: 9,
    color: theme.colors.textMuted,
    fontWeight: '600',
    marginBottom: 4,
  },
  barTrack: {
    height: 110,
    width: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barFillRegular: {
    backgroundColor: '#94A3B8',
  },
  barFillActive: {
    backgroundColor: theme.colors.task3,
  },
  barDayText: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 6,
    fontWeight: '600',
  },
  barDayTextActive: {
    color: theme.colors.task3,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sectionCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  workoutIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutEmoji: {
    fontSize: 20,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  workoutMeta: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  deleteWorkoutBtn: {
    padding: 8,
  },
  deleteWorkoutText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    ...theme.shadows.lg,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  workoutTypeScroll: {
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  typeSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeSelectPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: theme.colors.task3,
  },
  typeEmoji: {
    fontSize: 16,
  },
  typeSelectName: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  typeSelectNameActive: {
    color: '#065F46',
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    fontSize: 14,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: theme.spacing.md,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalCancelText: {
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  modalSaveBtn: {
    backgroundColor: theme.colors.task3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    color: theme.colors.white,
    fontWeight: '700',
  },
});
