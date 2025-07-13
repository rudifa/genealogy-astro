import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { AppLanguages } from '../public/utility/AppLanguage.js';
import { translations, getTranslations, supportedLanguages } from '../dist/i18n/index.js';
// const translations = { en, fr, de };

describe('AppLanguages', () => {
  let appLanguages;

  beforeEach(() => {
    appLanguages = new AppLanguages('en', translations);
  });

  it('should initialize with the correct language and translations', () => {
    assert.strictEqual(appLanguages.getCurrentLanguage(), 'en');
    assert.deepStrictEqual(appLanguages.getTranslations(), translations.en);
  });

  it('should change language and translations when setLanguage is called', () => {
    appLanguages.setLanguage('fr', translations);
    assert.strictEqual(appLanguages.getCurrentLanguage(), 'fr');
    assert.deepStrictEqual(appLanguages.getTranslations(), translations.fr);
  });

  it('should change to German and get correct translation', () => {
    appLanguages.setLanguage('de', translations);
    assert.strictEqual(appLanguages.getCurrentLanguage(), 'de');
    assert.deepStrictEqual(appLanguages.getTranslations(), translations.de);
    assert.strictEqual(appLanguages.getTranslations().addPerson, 'Person Hinzufügen');
  });

  it('should not change language if translations are invalid', () => {
    appLanguages.setLanguage('it', null);
    assert.strictEqual(appLanguages.getCurrentLanguage(), 'en');
    assert.deepStrictEqual(appLanguages.getTranslations(), translations.en);
  });

  it('should notify observers when language changes', () => {
    let notified = false;
    appLanguages.subscribe((lang, currentTranslations) => {
      notified = true;
      assert.strictEqual(lang, 'fr');
      assert.deepStrictEqual(currentTranslations, translations.fr);
    });
    appLanguages.setLanguage('fr', translations);
    assert.strictEqual(notified, true);
  });

  it('should allow unsubscribing observers', () => {
    let callCount = 0;
    const unsubscribe = appLanguages.subscribe(() => {
      callCount++;
    });
    appLanguages.setLanguage('fr', translations);
    assert.strictEqual(callCount, 1);

    unsubscribe();
    appLanguages.setLanguage('en', translations);
    assert.strictEqual(callCount, 1); // Should not have increased
  });
});
