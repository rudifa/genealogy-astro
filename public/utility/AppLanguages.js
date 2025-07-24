/** @type {boolean} */
const verbose = false;
/** @constant {string} */
const LS_KEY = "app-language-storage-key";
/**
 * Simple Observer-based language manager for translations
 */

/**
 * @class
 * @classdesc Simple Observer-based language manager for translations
 */
export class AppLanguages {
  /**
   * Creates an instance of AppLanguages.
   * @constructor
   * @throws {Error} If called directly instead of using ensureOneExists()
   */
  constructor() {
    if (AppLanguages._instance) {
      throw new Error("Use AppLanguages.ensureOneExists()");
    }

    /** @type {string} */
    this.currentLanguage = this.#getOrInitLocalStorageLang(LS_KEY, "en");
    /** @type {Object|null} */
    this.allTranslations = null; // must be set later
    /** @type {Set<Function>} */
    this.subscribers = new Set();
  }

  /**
   * Private method for getting or initializing localStorage language
   * @private
   * @param {string} key - The localStorage key to use
   * @param {string} [defaultLang="en"] - The default language to use if none is stored
   * @returns {string} The language code
   */
  #getOrInitLocalStorageLang(key, defaultLang = "en") {
    if (typeof window !== "undefined" && window.localStorage) {
      let lang = window.localStorage.getItem(key);
      if (!lang) {
        lang = defaultLang;
        window.localStorage.setItem(key, lang);
      }
      return lang;
    }
    return defaultLang;
  }

  /**
   * Private method for setting localStorage language
   * @private
   * @param {string} key - The localStorage key to use
   * @param {string} lang - The language code to store
   */
  #setLocalStorageLang(key, lang) {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, lang);
    }
  }

  /**
   * Sets the current language
   * @param {string} lang - The language code to set
   */
  setLanguage(lang) {
    if (verbose) {
      console.log("§§ AppLanguages.setLanguage:", lang);
    }
    const availableLangs = Object.keys(this.allTranslations);
    if (!availableLangs.includes(lang)) {
      return;
    }
    if (this.currentLanguage !== lang) {
      this.currentLanguage = lang;
      this.#setLocalStorageLang(LS_KEY, lang);
      this.notify();
    }
  }

  /**
   * Ensures a single instance of AppLanguages exists
   * @param {boolean} [verbose=true] - Whether to log verbose output
   * @returns {AppLanguages} The singleton instance
   */
  static ensureOneExists(verbose = true) {
    if (!AppLanguages._instance) {
      AppLanguages._instance = new AppLanguages();
      if (verbose && typeof window !== "undefined") {
        window.appLanguages = AppLanguages._instance;
      }
      if (verbose) {
        console.log(
          "🌐 AppLanguages.ensureOneExists: instance created (uninitialized)"
        );
      }
    } else {
      if (verbose && typeof window !== "undefined") {
        window.appLanguages = AppLanguages._instance;
      }
      if (verbose) {
        console.log("🌍 AppLanguages.ensureOneExists: instance exists");
      }
    }
    return AppLanguages._instance;
  }

  /**
   * Sets the translations object
   * @param {Object} translations - The translations object
   */
  setAllTranslations(translations) {
    this.allTranslations = translations;

    if (verbose) {
      console.log(
        "🌍 AppLanguages.setTranslations: translations set",
        !!translations
      );
    }

    this.notify();
  }

  /**
   * Gets the list of available languages
   * @returns {string[]|undefined} Array of available language codes or undefined
   */
  getAvailableLanguages(caller = "") {
    if (!this.allTranslations) {
      console.warn(
        "AppLanguages: allTranslations is undefined in getAvailableLanguages()",
        caller
      );
      return undefined;
    }
    return Object.keys(this.allTranslations);
  }

  /**
   * Gets the current language
   * @returns {string|undefined} The current language code or undefined
   */
  getLanguage() {
    if (!this.currentLanguage) {
      console.error(
        "AppLanguages: currentLanguage is undefined in getLanguage()"
      );
      return undefined;
    }
    return this.currentLanguage;
  }

  /**
   * Gets the translations for the current language
   * @returns {Object|undefined} The translations object for the current language or undefined
   */
  getTranslations(caller = "") {
    if (!this.allTranslations) {
      console.warn(
        "AppLanguages: allTranslations is undefined in getTranslations()",
        caller
      );
      return undefined;
    }
    if (!this.currentLanguage) {
      console.error(
        "AppLanguages: currentLanguage is undefined in getTranslations()",
        caller
      );
      return undefined;
    }
    return (
      this.allTranslations[this.currentLanguage] ||
      this.allTranslations["en"] ||
      undefined
    );
  }

  /**
   * Gets all available translations
   * @returns {Object|undefined} The translations object for all languages or undefined
   */
  getAllTranslations(caller = "") {
    if (!this.allTranslations) {
      console.warn(
        "AppLanguages: allTranslations is undefined in getAllTranslations()",
        caller
      );
      return undefined;
    }
    return this.allTranslations;
  }

  /**
   * Subscribes a callback to language changes
   * @param {Function} callback - The callback function to subscribe
   * @returns {Function} A function to unsubscribe the callback
   */
  subscribe(callback, caller = "") {
    // caller is for debugging purposes
    this.subscribers.add(callback);
    const translations = this.getTranslations(caller);
    if (translations) {
      callback(translations);
    }
    return () => this.subscribers.delete(callback);
  }

  /**
   * Unsubscribes a callback from language changes
   * @param {Function} callback - The callback function to unsubscribe
   */
  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  /**
   * Notifies all subscribers of a language change
   * @description Calls each subscriber's callback with the currentTranslations,
   * allowing subscribers to update their UI texts with the new translations.
   */
  notify() {
    const currentTranslations = this.getTranslations();
    if (!currentTranslations) {
      return;
    }
    for (const cb of this.subscribers) {
      cb(currentTranslations);
    }
  }
}
