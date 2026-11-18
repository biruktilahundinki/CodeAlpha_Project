import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { theme } from '../styles/theme';
import {
  availableLanguages,
  languageLessons,
  sampleQuizzes,
} from '../data/languageData';
import { storage } from '../utils/storage';
import { speak } from '../utils/speech';

const LANGUAGE_STORAGE_KEY = '@codealpha_language_progress_v1';

export default function LanguageScreen() {
  const [selectedLangId, setSelectedLangId] = useState('es');
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'quiz'
  const [learnedWords, setLearnedWords] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Load progress
  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && Array.isArray(saved.learned)) {
        setLearnedWords(saved.learned);
      }
    })();
  }, []);

  const persistProgress = async (newLearned) => {
    setLearnedWords(newLearned);
    await storage.setItem(LANGUAGE_STORAGE_KEY, { learned: newLearned });
  };

  const currentLang =
    availableLanguages.find((l) => l.id === selectedLangId) || availableLanguages[0];
  const allLessons = languageLessons[selectedLangId] || [];
  const quizList = sampleQuizzes[selectedLangId] || [];

  const categories = ['All', ...new Set(allLessons.map((l) => l.category))];
  const filteredLessons =
    selectedCategory === 'All'
      ? allLessons
      : allLessons.filter((l) => l.category === selectedCategory);

  // Toggle Learned
  const handleToggleLearned = (wordId) => {
    let updated;
    if (learnedWords.includes(wordId)) {
      updated = learnedWords.filter((id) => id !== wordId);
    } else {
      updated = [...learnedWords, wordId];
    }
    persistProgress(updated);
  };

  // Play Pronunciation
  const handlePronounce = (text) => {
    speak(text, currentLang.speechCode);
  };

  // Quiz Handlers
  const currentQuiz = quizList[currentQuizIndex];

  const handleSelectOption = (index) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    if (index === currentQuiz.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex + 1 < quizList.length) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setQuizScore(0);
    setQuizCompleted(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Language Selector Header */}
      <View style={styles.langSelectorRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
          {availableLanguages.map((lang) => {
            const isSelected = selectedLangId === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                style={[styles.langChip, isSelected && styles.langChipActive]}
                onPress={() => {
                  setSelectedLangId(lang.id);
                  handleRestartQuiz();
                }}
              >
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={[styles.langName, isSelected && styles.langNameActive]}>
                  {lang.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Progress & Streak Bar */}
      <View style={styles.statsBanner}>
        <View style={styles.statCol}>
          <Text style={styles.statEmoji}>🔥 5 Days</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statEmoji}>
            📚 {learnedWords.length} / {allLessons.length}
          </Text>
          <Text style={styles.statLabel}>Words Mastered</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statEmoji}>⭐ 280 XP</Text>
          <Text style={styles.statLabel}>Earned Points</Text>
        </View>
      </View>

      {/* Sub-Tabs: Lessons vs Quiz */}
      <View style={styles.subTabRow}>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'lessons' && styles.subTabActive]}
          onPress={() => setActiveTab('lessons')}
        >
          <Text
            style={[styles.subTabText, activeTab === 'lessons' && styles.subTabTextActive]}
          >
            📖 Daily Lessons & Flashcards
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.subTab, activeTab === 'quiz' && styles.subTabActive]}
          onPress={() => setActiveTab('quiz')}
        >
          <Text style={[styles.subTabText, activeTab === 'quiz' && styles.subTabTextActive]}>
            🎯 Practice Quiz ({quizList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'lessons' ? (
        <View>
          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catPill, isSelected && styles.catPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                >
                  <Text style={[styles.catText, isSelected && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Lesson Cards */}
          {filteredLessons.map((item) => {
            const isLearned = learnedWords.includes(item.id);
            return (
              <View key={item.id} style={styles.lessonCard}>
                <View style={styles.lessonHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.learnCheckBtn, isLearned && styles.learnCheckBtnActive]}
                    onPress={() => handleToggleLearned(item.id)}
                  >
                    <Text style={[styles.learnCheckText, isLearned && styles.learnCheckTextActive]}>
                      {isLearned ? '✓ Mastered' : '+ Mark Learned'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Main Foreign Word & Pronounce Button */}
                <View style={styles.wordRow}>
                  <View style={styles.wordInfo}>
                    <Text style={styles.foreignWord}>{item.word}</Text>
                    {item.phonetic ? (
                      <Text style={styles.phoneticText}>[{item.phonetic}]</Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    style={styles.speakerBtn}
                    onPress={() => handlePronounce(item.word)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.speakerIcon}>🔊</Text>
                  </TouchableOpacity>
                </View>

                {/* English Translation */}
                <View style={styles.translationBox}>
                  <Text style={styles.translationLabel}>ENGLISH TRANSLATION</Text>
                  <Text style={styles.translationText}>{item.translation}</Text>
                </View>

                {/* Example sentence */}
                {item.example ? (
                  <View style={styles.exampleBox}>
                    <Text style={styles.exampleOrigin}>“{item.example}”</Text>
                    <Text style={styles.exampleTrans}>“{item.exampleTranslation}”</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        /* QUIZ MODE */
        <View style={styles.quizContainer}>
          {quizList.length === 0 ? (
            <View style={styles.emptyQuiz}>
              <Text style={styles.emptyQuizTitle}>No quizzes for this language yet.</Text>
            </View>
          ) : !quizCompleted ? (
            <View style={styles.quizCard}>
              <View style={styles.quizProgressRow}>
                <Text style={styles.quizCounter}>
                  Question {currentQuizIndex + 1} of {quizList.length}
                </Text>
                <Text style={styles.quizScoreCounter}>Score: {quizScore}</Text>
              </View>

              <Text style={styles.quizQuestion}>{currentQuiz.question}</Text>

              {/* Options */}
              <View style={styles.optionsList}>
                {currentQuiz.options.map((opt, idx) => {
                  let optStyle = styles.optionItem;
                  let optTextStyle = styles.optionText;

                  if (hasAnswered) {
                    if (idx === currentQuiz.correctIndex) {
                      optStyle = [styles.optionItem, styles.optionCorrect];
                      optTextStyle = [styles.optionText, styles.optionTextCorrect];
                    } else if (idx === selectedOption) {
                      optStyle = [styles.optionItem, styles.optionWrong];
                      optTextStyle = [styles.optionText, styles.optionTextWrong];
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={optStyle}
                      onPress={() => handleSelectOption(idx)}
                      disabled={hasAnswered}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.optionIndex}>{String.fromCharCode(65 + idx)}.</Text>
                      <Text style={optTextStyle}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Feedback box */}
              {hasAnswered ? (
                <View
                  style={[
                    styles.feedbackBox,
                    selectedOption === currentQuiz.correctIndex
                      ? styles.feedbackCorrect
                      : styles.feedbackWrong,
                  ]}
                >
                  <Text style={styles.feedbackTitle}>
                    {selectedOption === currentQuiz.correctIndex
                      ? '🎉 Correct! Well done!'
                      : '❌ Incorrect'}
                  </Text>
                  <Text style={styles.feedbackExplanation}>{currentQuiz.explanation}</Text>
                </View>
              ) : null}

              {/* Next Question Button */}
              {hasAnswered ? (
                <TouchableOpacity style={styles.nextQuizBtn} onPress={handleNextQuiz}>
                  <Text style={styles.nextQuizBtnText}>
                    {currentQuizIndex + 1 === quizList.length ? 'Finish Quiz' : 'Next Question →'}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : (
            /* Quiz Completed Screen */
            <View style={styles.completedCard}>
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.completedTitle}>Quiz Completed!</Text>
              <Text style={styles.completedSubtitle}>
                You scored {quizScore} out of {quizList.length} questions correctly.
              </Text>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>
                  {Math.round((quizScore / quizList.length) * 100)}% Accuracy
                </Text>
              </View>
              <TouchableOpacity style={styles.retakeBtn} onPress={handleRestartQuiz}>
                <Text style={styles.retakeBtnText}>🔄 Practice Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
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
  langSelectorRow: {
    marginBottom: theme.spacing.md,
  },
  langList: {
    gap: 8,
  },
  langChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  langChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: theme.colors.task4,
  },
  langFlag: {
    fontSize: 16,
  },
  langName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  langNameActive: {
    color: theme.colors.task4,
    fontWeight: '800',
  },
  statsBanner: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  statCol: {
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: theme.colors.border,
  },
  subTabRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: theme.borderRadius.sm,
    padding: 3,
    marginBottom: theme.spacing.lg,
  },
  subTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  subTabActive: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  subTabTextActive: {
    color: theme.colors.task4,
    fontWeight: '800',
  },
  categoryScroll: {
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  catPillActive: {
    backgroundColor: theme.colors.task4,
    borderColor: theme.colors.task4,
  },
  catText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  catTextActive: {
    color: theme.colors.white,
  },
  lessonCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  lessonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.task4,
    textTransform: 'uppercase',
  },
  learnCheckBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  learnCheckBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
  },
  learnCheckText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  learnCheckTextActive: {
    color: '#059669',
    fontWeight: '700',
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  wordInfo: {
    flex: 1,
  },
  foreignWord: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '800',
    color: theme.colors.text,
  },
  phoneticText: {
    fontSize: 12,
    color: theme.colors.task4,
    fontWeight: '600',
    marginTop: 2,
  },
  speakerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerIcon: {
    fontSize: 18,
  },
  translationBox: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
  },
  translationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  translationText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  exampleBox: {
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.task4,
    paddingLeft: 8,
  },
  exampleOrigin: {
    fontSize: 12,
    fontStyle: 'italic',
    color: theme.colors.text,
  },
  exampleTrans: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  quizContainer: {},
  quizCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  quizProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  quizCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.task4,
  },
  quizScoreCounter: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.success,
  },
  quizQuestion: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  optionsList: {
    gap: 10,
    marginBottom: theme.spacing.lg,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    padding: 14,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#34D399',
  },
  optionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#F87171',
  },
  optionIndex: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textMuted,
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  optionTextCorrect: {
    color: '#065F46',
  },
  optionTextWrong: {
    color: '#991B1B',
  },
  feedbackBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
  },
  feedbackCorrect: {
    backgroundColor: '#ECFDF5',
  },
  feedbackWrong: {
    backgroundColor: '#FEF2F2',
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  feedbackExplanation: {
    fontSize: 12,
    color: theme.colors.text,
  },
  nextQuizBtn: {
    backgroundColor: theme.colors.task4,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  nextQuizBtnText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  emptyQuiz: {
    padding: 40,
    alignItems: 'center',
  },
  emptyQuizTitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  completedCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.md,
  },
  trophyIcon: {
    fontSize: 56,
    marginBottom: theme.spacing.md,
  },
  completedTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 6,
  },
  completedSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  scorePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.xl,
  },
  scorePillText: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 14,
  },
  retakeBtn: {
    backgroundColor: theme.colors.task4,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
  },
  retakeBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
