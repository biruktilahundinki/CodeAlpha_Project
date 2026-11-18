// Cross-platform speech synthesis utility for Language Learning & Quotes

let expoSpeechModule = null;
try {
  expoSpeechModule = require('expo-speech');
} catch (e) {
  // Not installed or fallback
}

export const speak = (text, languageCode = 'en') => {
  if (!text) return;

  // 1. Try Expo Speech if native
  if (expoSpeechModule && expoSpeechModule.speak) {
    try {
      expoSpeechModule.speak(text, {
        language: languageCode,
        pitch: 1.0,
        rate: 0.9,
      });
      return;
    } catch (e) {
      console.warn('Expo speech failed:', e);
    }
  }

  // 2. Try Web Speech Synthesis API
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel(); // Stop prior audio
      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = languageCode;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      return;
    } catch (e) {
      console.warn('Web SpeechSynthesis error:', e);
    }
  }

  console.log(`[Audio Pronunciation]: "${text}" (${languageCode})`);
};
