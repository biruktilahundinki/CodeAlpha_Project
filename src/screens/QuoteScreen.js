import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Platform,
  Modal,
} from 'react-native';
import { theme } from '../styles/theme';
import { quotesData } from '../data/quotesData';
import { storage } from '../utils/storage';
import { speak } from '../utils/speech';

const FAVORITES_STORAGE_KEY = '@codealpha_quotes_favs_v1';

export default function QuoteScreen() {
  const [currentQuote, setCurrentQuote] = useState(quotesData[0]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [colorTheme, setColorTheme] = useState('minimal'); // 'minimal' | 'dark' | 'sunset' | 'indigo'

  // Load favorites on mount
  useEffect(() => {
    (async () => {
      const saved = await storage.getItem(FAVORITES_STORAGE_KEY, []);
      if (Array.isArray(saved)) {
        setFavorites(saved);
      }
    })();
    // Show a fresh random quote on load
    handleGetRandomQuote();
  }, []);

  const categories = ['All', 'Technology', 'Motivation', 'Philosophy', 'Wisdom', 'Success'];

  const getFilteredPool = (cat = selectedCategory) => {
    if (cat === 'All') return quotesData;
    return quotesData.filter((q) => q.category === cat);
  };

  const handleGetRandomQuote = (cat = selectedCategory) => {
    const pool = getFilteredPool(cat);
    if (!pool.length) return;
    // Pick different quote
    let nextQuote = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && currentQuote && nextQuote.id === currentQuote.id) {
      const altPool = pool.filter((q) => q.id !== currentQuote.id);
      nextQuote = altPool[Math.floor(Math.random() * altPool.length)];
    }
    setCurrentQuote(nextQuote);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    handleGetRandomQuote(cat);
  };

  // Toggle Favorite
  const isFavorite = favorites.some((f) => f.id === currentQuote?.id);

  const handleToggleFavorite = async () => {
    if (!currentQuote) return;
    let newFavs;
    if (isFavorite) {
      newFavs = favorites.filter((f) => f.id !== currentQuote.id);
    } else {
      newFavs = [...favorites, currentQuote];
    }
    setFavorites(newFavs);
    await storage.setItem(FAVORITES_STORAGE_KEY, newFavs);
  };

  // Copy to clipboard
  const handleCopyQuote = async () => {
    if (!currentQuote) return;
    const fullText = `"${currentQuote.text}" — ${currentQuote.author}`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    } catch (e) {
      console.warn('Clipboard copy error', e);
    }
  };

  // Share quote
  const handleShareQuote = async () => {
    if (!currentQuote) return;
    try {
      await Share.share({
        message: `"${currentQuote.text}" — ${currentQuote.author} (via CodeAlpha Quote Generator)`,
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  // Speak quote
  const handleSpeakQuote = () => {
    if (!currentQuote) return;
    speak(`${currentQuote.text}. By ${currentQuote.author}`, 'en-US');
  };

  // Theme styling helpers
  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'dark':
        return {
          cardBg: '#0F172A',
          textColor: '#F8FAFC',
          authorColor: '#94A3B8',
          quoteMark: '#334155',
          border: '#1E293B',
        };
      case 'sunset':
        return {
          cardBg: '#FFF7ED',
          textColor: '#7C2D12',
          authorColor: '#C2410C',
          quoteMark: '#FED7AA',
          border: '#FFEDD5',
        };
      case 'indigo':
        return {
          cardBg: '#EEF2FF',
          textColor: '#1E1B4B',
          authorColor: '#4F46E5',
          quoteMark: '#C7D2FE',
          border: '#E0E7FF',
        };
      default: // minimal
        return {
          cardBg: '#FFFFFF',
          textColor: '#0F172A',
          authorColor: '#475569',
          quoteMark: '#E2E8F0',
          border: '#E2E8F0',
        };
    }
  };

  const tStyles = getThemeStyles();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, isSelected && styles.categoryPillActive]}
              onPress={() => handleCategoryChange(cat)}
            >
              <Text style={[styles.categoryText, isSelected && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Toast Feedback */}
      {copiedToast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>✓ Copied to clipboard!</Text>
        </View>
      ) : null}

      {/* Main Quote Card */}
      <View
        style={[
          styles.quoteCard,
          { backgroundColor: tStyles.cardBg, borderColor: tStyles.border },
        ]}
      >
        <View style={styles.cardTopRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{currentQuote.category || 'Inspiration'}</Text>
          </View>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.favBtn} activeOpacity={0.7}>
            <Text style={styles.favBtnText}>{isFavorite ? '❤️ Saved' : '🤍 Save'}</Text>
          </TouchableOpacity>
        </View>

        {/* Big Quote Watermark */}
        <Text style={[styles.quoteWatermark, { color: tStyles.quoteMark }]}>“</Text>

        <Text style={[styles.quoteText, { color: tStyles.textColor }]}>
          {currentQuote.text}
        </Text>

        <View style={styles.authorContainer}>
          <View style={styles.authorLine} />
          <Text style={[styles.authorName, { color: tStyles.authorColor }]}>
            {currentQuote.author}
          </Text>
        </View>

        {/* Quick Actions (Audio, Copy, Share) */}
        <View style={styles.quoteToolbar}>
          <TouchableOpacity style={styles.toolBtn} onPress={handleSpeakQuote}>
            <Text style={styles.toolIcon}>🔊</Text>
            <Text style={styles.toolLabel}>Listen</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={handleCopyQuote}>
            <Text style={styles.toolIcon}>📋</Text>
            <Text style={styles.toolLabel}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolBtn} onPress={handleShareQuote}>
            <Text style={styles.toolIcon}>↗️</Text>
            <Text style={styles.toolLabel}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Quote Main Button */}
      <TouchableOpacity
        style={styles.newQuoteBtn}
        onPress={() => handleGetRandomQuote()}
        activeOpacity={0.8}
      >
        <Text style={styles.newQuoteBtnText}>✨ New Quote</Text>
      </TouchableOpacity>

      {/* Bottom Bar: Theme Selector & Favorites Drawer */}
      <View style={styles.bottomBar}>
        <View style={styles.themeSelector}>
          <Text style={styles.themeLabel}>Theme:</Text>
          {['minimal', 'dark', 'sunset', 'indigo'].map((thm) => (
            <TouchableOpacity
              key={thm}
              style={[styles.themeDot, colorTheme === thm && styles.themeDotActive]}
              onPress={() => setColorTheme(thm)}
            >
              <View
                style={[
                  styles.themeCircle,
                  thm === 'minimal' && { backgroundColor: '#FFFFFF' },
                  thm === 'dark' && { backgroundColor: '#0F172A' },
                  thm === 'sunset' && { backgroundColor: '#F97316' },
                  thm === 'indigo' && { backgroundColor: '#6366F1' },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.favoritesLink}
          onPress={() => setFavoritesModalVisible(true)}
        >
          <Text style={styles.favoritesLinkText}>⭐ Favorites ({favorites.length})</Text>
        </TouchableOpacity>
      </View>

      {/* Favorites Modal */}
      <Modal visible={favoritesModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Quotes ({favorites.length})</Text>
              <TouchableOpacity onPress={() => setFavoritesModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕ Close</Text>
              </TouchableOpacity>
            </View>

            {favorites.length === 0 ? (
              <View style={styles.emptyFavs}>
                <Text style={styles.emptyFavsText}>No favorite quotes saved yet.</Text>
                <Text style={styles.emptyFavsSub}>Tap "Save" on any quote to keep it here!</Text>
              </View>
            ) : (
              <ScrollView style={styles.favsList}>
                {favorites.map((fav) => (
                  <View key={fav.id} style={styles.favItem}>
                    <Text style={styles.favText}>"{fav.text}"</Text>
                    <Text style={styles.favAuthor}>— {fav.author}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
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
  categoryRow: {
    gap: 8,
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.task2,
    borderColor: theme.colors.task2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  toast: {
    backgroundColor: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  toastText: {
    color: '#34D399',
    fontWeight: '700',
    fontSize: 12,
  },
  quoteCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    minHeight: 320,
    justifyContent: 'space-between',
    borderWidth: 1,
    position: 'relative',
    ...theme.shadows.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
  },
  favBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  favBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quoteWatermark: {
    fontSize: 80,
    fontWeight: '900',
    position: 'absolute',
    top: 25,
    left: 20,
    opacity: 0.4,
  },
  quoteText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '600',
    lineHeight: 32,
    marginVertical: theme.spacing.lg,
    zIndex: 1,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorLine: {
    width: 24,
    height: 2,
    backgroundColor: theme.colors.task2,
  },
  authorName: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '700',
  },
  quoteToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    paddingTop: theme.spacing.md,
  },
  toolBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toolIcon: {
    fontSize: 14,
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  newQuoteBtn: {
    backgroundColor: theme.colors.task2,
    paddingVertical: 15,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    ...theme.shadows.md,
  },
  newQuoteBtnText: {
    color: theme.colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    paddingHorizontal: 4,
  },
  themeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  themeDot: {
    padding: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  themeDotActive: {
    borderColor: theme.colors.task2,
  },
  themeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  favoritesLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  favoritesLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.text,
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
    maxHeight: '80%',
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  emptyFavs: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyFavsText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  emptyFavsSub: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  favsList: {
    marginTop: 8,
  },
  favItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  favText: {
    fontSize: 13,
    color: theme.colors.text,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  favAuthor: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.task2,
    marginTop: 4,
  },
});
