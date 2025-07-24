// src/i18n/LanguageManager.js

// Simple Observer-based language manager for translations
class LanguageManager {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = {};
    this.subscribers = new Set();
  }

  setTranslations(translations) {
    this.translations = translations;
  }

  setLanguage(lang) {
    if (this.currentLanguage !== lang) {
      this.currentLanguage = lang;
      this.notify();
    }
  }

  getLanguage() {
    return this.currentLanguage;
  }

  getTranslations() {
    return (
      this.translations[this.currentLanguage] ||
      this.translations['en'] ||
      {}
    );
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    // Immediately call with current state
    callback(this.getLanguage(), this.getTranslations());
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  notify() {
    for (const cb of this.subscribers) {
      cb(this.getLanguage(), this.getTranslations());
    }
  }
}

// Singleton instance
export const languageManager = new LanguageManager();
