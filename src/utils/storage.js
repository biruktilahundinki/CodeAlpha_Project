// Universal resilient storage wrapper for Mobile (AsyncStorage), Web (localStorage), and In-Memory fallback

let asyncStorageModule = null;
try {
  asyncStorageModule = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  // AsyncStorage module not yet installed or running in pure web
}

const memoryStore = {};

export const storage = {
  async getItem(key, defaultValue = null) {
    try {
      if (asyncStorageModule) {
        const val = await asyncStorageModule.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      }
      return key in memoryStore ? memoryStore[key] : defaultValue;
    } catch (err) {
      console.warn(`Storage getItem error for ${key}:`, err);
      return defaultValue;
    }
  },

  async setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (asyncStorageModule) {
        await asyncStorageModule.setItem(key, serialized);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, serialized);
      }
      memoryStore[key] = value;
      return true;
    } catch (err) {
      console.warn(`Storage setItem error for ${key}:`, err);
      return false;
    }
  },

  async removeItem(key) {
    try {
      if (asyncStorageModule) {
        await asyncStorageModule.removeItem(key);
      }
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
      delete memoryStore[key];
      return true;
    } catch (err) {
      console.warn(`Storage removeItem error for ${key}:`, err);
      return false;
    }
  },
};
