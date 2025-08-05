import { describe, it, expect, beforeEach } from 'vitest';
import { PWAManager } from '../pwa-manager';

describe('PWAManager - Tests Básicos', () => {
  let pwaManager: PWAManager;
  const mockOnShowInstallPrompt = () => {};

  beforeEach(() => {
    pwaManager = new PWAManager(mockOnShowInstallPrompt);
  });

  describe('setupPWA()', () => {
    it('debe ejecutarse sin error', () => {
      expect(() => {
        pwaManager.setupPWA();
      }).not.toThrow();
    });
  });
});
