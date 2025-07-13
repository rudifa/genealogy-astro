import { describe, it, beforeEach, expect } from 'vitest';
import { AppLanguages } from '../public/utility/AppLanguage.js';
import { translations, getTranslations, supportedLanguages } from '../src/i18n/index.ts';

describe('AppLanguages', () => {
  let appLanguages;

  beforeEach(() => {
    appLanguages = new AppLanguages('en', translations);
  });

  it('should initialize with the correct language and translations', () => {
    expect(appLanguages.getCurrentLanguage()).toBe('en');
    expect(appLanguages.getTranslations()).toEqual(translations.en);
  });

  it('should change language and translations when setLanguage is called', () => {
    appLanguages.setLanguage('fr', translations);
    expect(appLanguages.getCurrentLanguage()).toBe('fr');
    expect(appLanguages.getTranslations()).toEqual(translations.fr);
  });

  it('should change to German and get correct translation', () => {
    appLanguages.setLanguage('de', translations);
    expect(appLanguages.getCurrentLanguage()).toBe('de');
    expect(appLanguages.getTranslations()).toEqual(translations.de);
    expect(appLanguages.getTranslations().addPerson).toBe('Person Hinzufügen');
  });

  it('should not change language if translations are invalid', () => {
    appLanguages.setLanguage('it', null);
    expect(appLanguages.getCurrentLanguage()).toBe('en');
    expect(appLanguages.getTranslations()).toEqual(translations.en);
  });

  it('should notify observers when language changes', () => {
    let notified = false;
    appLanguages.subscribe((lang, currentTranslations) => {
      notified = true;
      expect(lang).toBe('fr');
      expect(currentTranslations).toEqual(translations.fr);
    });
    appLanguages.setLanguage('fr', translations);
    expect(notified).toBe(true);
  });

  it('should allow unsubscribing observers', () => {
    let callCount = 0;
    const unsubscribe = appLanguages.subscribe(() => {
      callCount++;
    });
    appLanguages.setLanguage('fr', translations);
    expect(callCount).toBe(1);

    unsubscribe();
    appLanguages.setLanguage('en', translations);
    expect(callCount).toBe(1); // Should not have increased
  });
});
