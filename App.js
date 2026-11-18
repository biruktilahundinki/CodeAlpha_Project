import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import HubScreen from './src/screens/HubScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import QuoteScreen from './src/screens/QuoteScreen';
import FitnessScreen from './src/screens/FitnessScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import { theme } from './src/styles/theme';

export default function App() {
  const [currentTab, setCurrentTab] = useState('hub'); // 'hub' | 'task1' | 'task2' | 'task3' | 'task4'
  const [isStandalone, setIsStandalone] = useState(false);

  // Tab metadata
  const getHeaderInfo = () => {
    switch (currentTab) {
      case 'task1':
        return {
          title: 'Flashcard Quiz',
          subtitle: 'Interactive Study Tool',
          badge: 'TASK 1',
        };
      case 'task2':
        return {
          title: 'Quote Generator',
          subtitle: 'Daily Inspiration & Wisdom',
          badge: 'TASK 2',
        };
      case 'task3':
        return {
          title: 'Fitness Tracker',
          subtitle: 'Activity & Progress Dashboard',
          badge: 'TASK 3',
        };
      case 'task4':
        return {
          title: 'Language Learning',
          subtitle: 'Vocabulary & Practice Quizzes',
          badge: 'TASK 4',
        };
      default:
        return {
          title: 'CodeAlpha Suite',
          subtitle: 'Mobile App Internship Portfolio',
          badge: '4 TASKS',
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* CodeAlpha Header */}
      <Header
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        badge={headerInfo.badge}
        rightAction={
          currentTab !== 'hub'
            ? () => setIsStandalone((prev) => !prev)
            : undefined
        }
        rightActionText={
          currentTab !== 'hub'
            ? isStandalone
              ? 'Exit Fullscreen'
              : 'Fullscreen'
            : undefined
        }
      />

      {/* Screen Body */}
      <View style={styles.body}>
        {currentTab === 'hub' && <HubScreen onNavigate={(t) => setCurrentTab(t)} />}
        {currentTab === 'task1' && <FlashcardScreen />}
        {currentTab === 'task2' && <QuoteScreen />}
        {currentTab === 'task3' && <FitnessScreen />}
        {currentTab === 'task4' && <LanguageScreen />}
      </View>

      {/* Bottom Navigation Bar (Hidden in standalone mode for dedicated app testing) */}
      {!isStandalone ? (
        <TabBar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  body: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
