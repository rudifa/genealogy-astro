// src/types/global.d.ts
export {};

declare global {
  interface Window {
    showNotification?: (message: string, type?: string) => void;
    hideNotification?: () => void;
    // Add other custom window properties as needed
  }
}
