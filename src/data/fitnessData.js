export const initialFitnessGoals = {
  dailyStepsGoal: 10000,
  dailyCaloriesGoal: 650,
  dailyActiveMinutesGoal: 45,
  dailyWaterGlassesGoal: 8,
};

export const workoutTypes = [
  { id: 'running', name: 'Running', icon: '🏃', calPerHour: 600, color: '#EF4444' },
  { id: 'cycling', name: 'Cycling', icon: '🚴', calPerHour: 500, color: '#F97316' },
  { id: 'walking', name: 'Walking', icon: '🚶', calPerHour: 250, color: '#10B981' },
  { id: 'gym', name: 'Strength Training', icon: '🏋️', calPerHour: 400, color: '#8B5CF6' },
  { id: 'hiit', name: 'HIIT / Cardio', icon: '⚡', calPerHour: 550, color: '#EC4899' },
  { id: 'yoga', name: 'Yoga & Stretch', icon: '🧘', calPerHour: 200, color: '#06B6D4' },
  { id: 'swimming', name: 'Swimming', icon: '🏊', calPerHour: 520, color: '#3B82F6' },
];

export const initialFitnessState = {
  today: {
    steps: 7420,
    caloriesBurned: 510,
    activeMinutes: 38,
    waterGlasses: 6,
  },
  recentWorkouts: [
    {
      id: 'w-1',
      type: 'running',
      title: 'Morning Park Run',
      durationMinutes: 30,
      caloriesBurned: 300,
      timestamp: 'Today, 7:30 AM',
    },
    {
      id: 'w-2',
      type: 'gym',
      title: 'Upper Body Workout',
      durationMinutes: 45,
      caloriesBurned: 210,
      timestamp: 'Yesterday, 6:00 PM',
    },
    {
      id: 'w-3',
      type: 'cycling',
      title: 'Evening Bike Ride',
      durationMinutes: 25,
      caloriesBurned: 195,
      timestamp: '2 days ago',
    },
  ],
  weeklySummary: [
    { day: 'Mon', calories: 480, steps: 8200, minutes: 40 },
    { day: 'Tue', calories: 620, steps: 10400, minutes: 55 },
    { day: 'Wed', calories: 390, steps: 6900, minutes: 30 },
    { day: 'Thu', calories: 710, steps: 11200, minutes: 60 },
    { day: 'Fri', calories: 540, steps: 8900, minutes: 45 },
    { day: 'Sat', calories: 650, steps: 10100, minutes: 50 },
    { day: 'Sun', calories: 510, steps: 7420, minutes: 38 },
  ],
};
