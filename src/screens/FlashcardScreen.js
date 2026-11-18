import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { theme } from '../styles/theme';
import { initialFlashcards } from '../data/initialFlashcards';
import { storage } from '../utils/storage';

const STORAGE_KEY = '@codealpha_flashcards_v1';

export default function FlashcardScreen() {
  const [cards, setCards] = useState(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State for Add / Edit
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [inputQuestion, setInputQuestion] = useState('');
  const [inputAnswer, setInputAnswer] = useState('');
  const [inputCategory, setInputCategory] = useState('General');

  // Load from Storage
  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(STORAGE_KEY);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        setCards(saved);
      }
    })();
  }, []);

  // Save to Storage
  const persistCards = async (newCards) => {
    setCards(newCards);
    await storage.setItem(STORAGE_KEY, newCards);
  };

  // Filter cards by category
  const categories = ['All', ...new Set(cards.map((c) => c.category || 'General'))];
  const filteredCards = selectedCategory === 'All'
    ? cards
    : cards.filter((c) => c.category === selectedCategory);

  const activeCard = filteredCards[currentIndex] || filteredCards[0] || null;

  // Handlers for Navigation
  const handleNext = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (filteredCards.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    }
  };

  const handleToggleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    persistCards(shuffled);
    setCurrentIndex(0);
  };

  const handleToggleMastered = (cardId) => {
    const updated = cards.map((c) => (c.id === cardId ? { ...c, mastered: !c.mastered } : c));
    persistCards(updated);
  };

  // Add / Edit Handlers
  const handleOpenAdd = () => {
    setEditingCardId(null);
    setInputQuestion('');
    setInputAnswer('');
    setInputCategory(selectedCategory === 'All' ? 'General' : selectedCategory);
    setModalVisible(true);
  };

  const handleOpenEdit = (card) => {
    if (!card) return;
    setEditingCardId(card.id);
    setInputQuestion(card.question);
    setInputAnswer(card.answer);
    setInputCategory(card.category || 'General');
    setModalVisible(true);
  };

  const handleSaveCard = () => {
    if (!inputQuestion.trim() || !inputAnswer.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please provide both question and answer.');
      } else {
        Alert.alert('Missing Fields', 'Please provide both question and answer.');
      }
      return;
    }

    if (editingCardId) {
      // Update
      const updated = cards.map((c) =>
        c.id === editingCardId
          ? {
              ...c,
              question: inputQuestion.trim(),
              answer: inputAnswer.trim(),
              category: inputCategory.trim() || 'General',
            }
          : c
      );
      persistCards(updated);
    } else {
      // Create new
      const newCard = {
        id: `fc-${Date.now()}`,
        question: inputQuestion.trim(),
        answer: inputAnswer.trim(),
        category: inputCategory.trim() || 'General',
        mastered: false,
      };
      persistCards([...cards, newCard]);
      setCurrentIndex(filteredCards.length);
    }

    setModalVisible(false);
  };

  const handleDeleteCard = (cardId) => {
    const performDelete = () => {
      const updated = cards.filter((c) => c.id !== cardId);
      persistCards(updated);
      setIsFlipped(false);
      if (currentIndex >= updated.length && updated.length > 0) {
        setCurrentIndex(updated.length - 1);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this flashcard?')) {
        performDelete();
      }
    } else {
      Alert.alert('Delete Flashcard', 'Are you sure you want to delete this card?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete },
      ]);
    }
  };

  const handleResetDefaults = () => {
    persistCards(initialFlashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSelectedCategory('All');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Category Filter Horizontal Pills */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
              >
                <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Progress & Deck Stats */}
      <View style={styles.progressRow}>
        <Text style={styles.counterText}>
          {filteredCards.length > 0
            ? `Card ${currentIndex + 1} of ${filteredCards.length}`
            : 'No cards in this category'}
        </Text>
        <View style={styles.deckActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={handleShuffle} title="Shuffle">
            <Text style={styles.iconBtnText}>🔀 Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.addBtn]} onPress={handleOpenAdd}>
            <Text style={styles.addBtnText}>+ Add Card</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Flashcard Container */}
      {activeCard ? (
        <View style={styles.cardArea}>
          <View style={[styles.flashcard, isFlipped ? styles.flashcardBack : styles.flashcardFront]}>
            {/* Top Card Meta */}
            <View style={styles.cardMetaRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeCard.category || 'General'}</Text>
              </View>
              <TouchableOpacity
                style={[styles.masteredBadge, activeCard.mastered && styles.masteredBadgeActive]}
                onPress={() => handleToggleMastered(activeCard.id)}
              >
                <Text style={styles.masteredBadgeText}>
                  {activeCard.mastered ? '★ Mastered' : '☆ Study'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Card Content Area */}
            <View style={styles.cardBody}>
              <Text style={styles.sideLabel}>{isFlipped ? 'ANSWER' : 'QUESTION'}</Text>
              <Text style={[styles.cardText, isFlipped && styles.answerText]}>
                {isFlipped ? activeCard.answer : activeCard.question}
              </Text>
            </View>

            {/* Card Flip Button */}
            <TouchableOpacity style={styles.showAnswerBtn} onPress={handleToggleFlip} activeOpacity={0.8}>
              <Text style={styles.showAnswerBtnText}>
                {isFlipped ? '🔄 Show Question' : '💡 Show Answer'}
              </Text>
            </TouchableOpacity>

            {/* Card Action Row: Edit & Delete */}
            <View style={styles.cardBottomRow}>
              <TouchableOpacity
                style={styles.cardSubAction}
                onPress={() => handleOpenEdit(activeCard)}
              >
                <Text style={styles.cardSubActionText}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cardSubAction, styles.deleteSubAction]}
                onPress={() => handleDeleteCard(activeCard.id)}
              >
                <Text style={[styles.cardSubActionText, styles.deleteText]}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Navigation Controls: Previous & Next */}
          <View style={styles.navControls}>
            <TouchableOpacity
              style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
              onPress={handlePrev}
              disabled={currentIndex === 0 && filteredCards.length <= 1}
            >
              <Text style={styles.navBtnText}>← Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
              <Text style={styles.navBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No Flashcards Found</Text>
          <Text style={styles.emptySubtitle}>Add a new card or reset to default deck.</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={handleResetDefaults}>
            <Text style={styles.resetBtnText}>Reset Sample Deck</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCardId ? 'Edit Flashcard' : 'Create New Flashcard'}
            </Text>

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. React Native, Biology, History"
              value={inputCategory}
              onChangeText={setInputCategory}
            />

            <Text style={styles.inputLabel}>Question (Front)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter flashcard question..."
              multiline
              numberOfLines={3}
              value={inputQuestion}
              onChangeText={setInputQuestion}
            />

            <Text style={styles.inputLabel}>Answer (Back)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter flashcard answer..."
              multiline
              numberOfLines={4}
              value={inputAnswer}
              onChangeText={setInputAnswer}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveCard}>
                <Text style={styles.modalSaveText}>Save Card</Text>
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
  categoryContainer: {
    marginBottom: theme.spacing.md,
  },
  categoryList: {
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryPillActive: {
    backgroundColor: theme.colors.task1,
    borderColor: theme.colors.task1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  counterText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  deckActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  addBtn: {
    backgroundColor: theme.colors.task1,
    borderColor: theme.colors.task1,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.white,
  },
  cardArea: {
    alignItems: 'center',
  },
  flashcard: {
    width: '100%',
    minHeight: 280,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 2,
    borderColor: '#EDE9FE',
    justifyContent: 'space-between',
    ...theme.shadows.md,
  },
  flashcardFront: {
    borderColor: '#DDD6FE',
  },
  flashcardBack: {
    backgroundColor: '#FAF5FF',
    borderColor: '#C4B5FD',
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.task1,
  },
  masteredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  masteredBadgeActive: {
    backgroundColor: '#FEF3C7',
  },
  masteredBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#D97706',
  },
  cardBody: {
    marginVertical: theme.spacing.xl,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sideLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.textMuted,
    marginBottom: 10,
  },
  cardText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  answerText: {
    color: '#5B21B6',
    fontWeight: '500',
  },
  showAnswerBtn: {
    backgroundColor: theme.colors.task1,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
  },
  showAnswerBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingTop: theme.spacing.xs,
  },
  cardSubAction: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardSubActionText: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  deleteSubAction: {},
  deleteText: {
    color: theme.colors.danger,
  },
  navControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing.lg,
    gap: 12,
  },
  navBtn: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  navBtnText: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '700',
    color: theme.colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.text,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    marginTop: 4,
    marginBottom: theme.spacing.lg,
  },
  resetBtn: {
    backgroundColor: theme.colors.task1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
  },
  resetBtnText: {
    color: theme.colors.white,
    fontWeight: '700',
  },
  // Modal Styles
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
    marginBottom: 4,
    textTransform: 'uppercase',
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
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
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
    backgroundColor: theme.colors.task1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSaveText: {
    color: theme.colors.white,
    fontWeight: '700',
  },
});
