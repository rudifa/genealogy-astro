import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {UIState} from "../public/utility/UIState.js";

describe("UIState", () => {
  let uiState;

  beforeEach(() => {
    uiState = new UIState();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with the correct default state", () => {
      const state = uiState.getState();
      expect(state.isRendering).toBe(false);
      expect(state.activeDialog).toBe(null);
      expect(state.notification).toBe(null);
    });
  });

  describe("Subscription and Notification", () => {
    it("should allow a component to subscribe and receive the initial state immediately", () => {
      const subscriber = vi.fn();
      uiState.subscribe(subscriber, "test-component");

      expect(subscriber).toHaveBeenCalledTimes(1);
      expect(subscriber).toHaveBeenCalledWith(uiState.getState());
    });

    it("should notify all subscribers when state changes", () => {
      const subscriber1 = vi.fn();
      const subscriber2 = vi.fn();

      uiState.subscribe(subscriber1, "comp1");
      uiState.subscribe(subscriber2, "comp2");

      // Reset mocks to ignore initial calls
      subscriber1.mockClear();
      subscriber2.mockClear();

      uiState.setRendering(true);

      expect(subscriber1).toHaveBeenCalledTimes(1);
      expect(subscriber2).toHaveBeenCalledTimes(1);
      const expectedState = {
        isRendering: true,
        activeDialog: null,
        notification: null,
      };
      expect(subscriber1).toHaveBeenCalledWith(expectedState);
      expect(subscriber2).toHaveBeenCalledWith(expectedState);
    });

    it("should allow a component to unsubscribe", () => {
      const subscriber = vi.fn();
      const unsubscribe = uiState.subscribe(subscriber, "test-comp");

      subscriber.mockClear(); // Ignore initial call

      unsubscribe();

      uiState.setRendering(true);

      expect(subscriber).not.toHaveBeenCalled();
    });

    it("should throw an error if a subscriber does not provide an ID", () => {
      expect(() => uiState.subscribe(() => {}, null)).toThrow(
        "UIState subscriber must have a unique ID."
      );
    });
  });

  describe("Action Methods", () => {
    it("setRendering should update state and notify", () => {
      const subscriber = vi.fn();
      uiState.subscribe(subscriber, "test");
      subscriber.mockClear();

      uiState.setRendering(true);

      expect(uiState.getState().isRendering).toBe(true);
      expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("setRendering should not notify if the state is the same", () => {
      uiState.setRendering(true); // Set initial state
      const subscriber = vi.fn();
      uiState.subscribe(subscriber, "test");
      subscriber.mockClear();

      uiState.setRendering(true); // Call with same value

      expect(subscriber).not.toHaveBeenCalled();
    });

    it("openDialog and closeDialog should update state and notify", () => {
      const subscriber = vi.fn();
      uiState.subscribe(subscriber, "test");
      subscriber.mockClear();

      const dialogData = {id: 1, name: "Test"};
      uiState.openDialog("editPerson", dialogData);

      expect(uiState.getState().activeDialog).toEqual({
        name: "editPerson",
        data: dialogData,
      });
      expect(subscriber).toHaveBeenCalledTimes(1);

      uiState.closeDialog();
      expect(uiState.getState().activeDialog).toBe(null);
      expect(subscriber).toHaveBeenCalledTimes(2);
    });

    it("showNotification should update state and clear it after a duration", () => {
      vi.useFakeTimers();
      const subscriber = vi.fn();
      uiState.subscribe(subscriber, "test");
      subscriber.mockClear();

      uiState.showNotification("Success!", "success", 5000);

      expect(uiState.getState().notification).toEqual({
        message: "Success!",
        type: "success",
        duration: 5000,
      });
      expect(subscriber).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(5000);

      expect(uiState.getState().notification).toBe(null);
      expect(subscriber).toHaveBeenCalledTimes(2);

      vi.useRealTimers();
    });
  });
});
