import { AppData } from './AppData.js';
import { AppLanguages } from './AppLanguages.js';
import { UIState } from './UIState.js';

/**
 * The main App container class.
 *
 * This class acts as a singleton entry point for all application state.
 * It creates and holds instances of the different state "slices":
 * - app.data: Manages genealogy data (from AppData)
 * - app.translations: Manages languages and translations (from AppLanguages)
 * - app.uiState: Manages transient UI state like dialogs and notifications (from UIState)
 *
 * Components should get the single instance of this class via `App.ensureAppExists()`
 * and then subscribe to the specific state slices they need.
 */
export class App {
  static instance = null;

  /**
   * Ensures that only one instance of the App class exists.
   * @returns {App} The single instance of the App class.
   */
  static ensureAppExists() {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  constructor() {
    this.data = AppData.ensureOneExists();
    this.translations = AppLanguages.ensureOneExists();
    this.uiState = new UIState();
  }
}
