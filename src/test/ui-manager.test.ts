import { describe, it, expect, beforeEach } from 'vitest';
import { UIManager } from '../ui-manager';

// Mock simple para CastManager
const mockCastManager = {
  areDevicesAvailable: () => false,
  isConnected: () => false
};

describe('UIManager - Tests Básicos', () => {
  let uiManager: UIManager;
  const mockOnPlaySound = () => Promise.resolve();
  const mockOnGoogleConnect = () => Promise.resolve();
  const mockOnClose = () => {};

  beforeEach(() => {
    uiManager = new UIManager(
      mockCastManager as any,
      mockOnPlaySound,
      mockOnGoogleConnect,
      mockOnClose
    );
  });

  describe('initializeUI()', () => {
    it('debe ejecutarse sin error', () => {
      expect(() => {
        uiManager.initializeUI();
      }).not.toThrow();
    });
  });

  describe('updateCastButtonState()', () => {
    it('debe ejecutarse sin error', () => {
      expect(() => {
        uiManager.updateCastButtonState();
      }).not.toThrow();
    });
  });

  describe('disableOtherButtons()', () => {
    it('debe aceptar string como parámetro', () => {
      expect(() => {
        uiManager.disableOtherButtons('test-sound');
      }).not.toThrow();
    });

    it('debe manejar strings vacíos', () => {
      expect(() => {
        uiManager.disableOtherButtons('');
      }).not.toThrow();
    });
  });

  describe('enableAllButtons()', () => {
    it('debe ejecutarse sin error', () => {
      expect(() => {
        uiManager.enableAllButtons();
      }).not.toThrow();
    });
  });

  describe('showNotification()', () => {
    it('debe aceptar string como parámetro', () => {
      expect(() => {
        uiManager.showNotification('Test message');
      }).not.toThrow();
    });

    it('debe manejar strings vacíos', () => {
      expect(() => {
        uiManager.showNotification('');
      }).not.toThrow();
    });
  });
});
