export class AppLanguages {
  constructor(initialLanguage = 'en', initialTranslations = {}) {
    this.currentLanguage = initialLanguage;
    this.translations = initialTranslations;
    this.observers = new Set();
  }

  setLanguage(lang, translations) {
    if (translations && typeof translations === 'object' && translations[lang]) {
      this.currentLanguage = lang;
      this.translations = translations;
      this.notifyObservers();
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getTranslations() {
    return this.translations[this.currentLanguage] || {};
  }

  subscribe(observer) {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer(this.currentLanguage, this.getTranslations());
    }
  }
}