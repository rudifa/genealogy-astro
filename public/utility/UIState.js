/**
 * UIState Class
 *
 * Manages the transient state of the user interface. This includes things like
 * which dialog is currently open, loading indicators, and notifications.
 *
 * It follows the observer pattern, allowing different components to subscribe
 * to UI state changes and react accordingly.
 */
export class UIState {
  constructor() {
    this.state = {
      /** @type {boolean} - True if a long-running process like graph rendering is active. */
      isRendering: false,

      /** @type {{name: string, data: any} | null} - The currently active dialog. */
      activeDialog: null, // e.g., { name: 'editPerson', data: { name: 'John Doe' } }

      /** @type {{message: string, type: 'info'|'error'|'success', duration: number} | null} - The current notification to display. */
      notification: null, // e.g., { message: 'Person saved!', type: 'success' }
    };

    /** @type {Map<string, Function>} */
    this.subscribers = new Map();
  }

  subscribe(callback, id) {
    if (!id) {
      throw new Error("UIState subscriber must have a unique ID.");
    }
    this.subscribers.set(id, callback);
    callback(this.state); // Immediately notify with the current state
    return () => this.subscribers.delete(id);
  }

  notify() {
    for (const callback of this.subscribers.values()) {
      callback(this.state);
    }
  }

  getState() {
    return this.state;
  }

  // --- Action Methods ---

  setRendering(isRendering) {
    if (this.state.isRendering !== isRendering) {
      this.state.isRendering = isRendering;
      this.notify();
    }
  }

  openDialog(name, data = {}) {
    this.state.activeDialog = {name, data};
    this.notify();
  }

  closeDialog() {
    if (this.state.activeDialog) {
      this.state.activeDialog = null;
      this.notify();
    }
  }

  /**
   * Sets a notification to be displayed to the user.
   * The notification will be automatically cleared after its duration.
   * @param {string} message - The message to display.
   * @param {'info'|'error'|'success'} [type='info'] - The type of notification.
   * @param {number} [duration=3000] - The duration in milliseconds to show the notification.
   */
  showNotification(message, type = "info", duration = 3000) {
    this.state.notification = {message, type, duration};
    this.notify();

    // Automatically clear the notification after its duration
    setTimeout(() => {
      // Only clear if it's still the same notification
      if (this.state.notification?.message === message) {
        this.state.notification = null;
        this.notify();
      }
    }, duration);
  }
}
