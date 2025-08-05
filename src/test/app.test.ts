import { describe, it, expect, beforeEach } from 'vitest';
import { VoiceCommunicatorApp } from '../app';

describe('VoiceCommunicatorApp - Tests Básicos', () => {
  let app: VoiceCommunicatorApp;

  beforeEach(() => {
    app = new VoiceCommunicatorApp();
  });

  describe('constructor', () => {
    it('debe crear instancia sin error', () => {
      expect(() => {
        new VoiceCommunicatorApp();
      }).not.toThrow();
    });

    it('debe tener propiedades definidas', () => {
      expect(app.castManager).toBeDefined();
      expect(app.audioManager).toBeDefined();
      expect(app.uiManager).toBeDefined();
      expect(app.pwaManager).toBeDefined();
    });
  });

  describe('métodos públicos', () => {
    it('handlePlay debe aceptar string como parámetro', () => {
      expect(() => {
        app.handlePlay('test-sound');
      }).not.toThrow();
    });

    it('handleEnded debe aceptar string como parámetro', () => {
      expect(() => {
        app.handleEnded('test-sound');
      }).not.toThrow();
    });

    it('handleClose debe ejecutarse sin error', () => {
      expect(() => {
        app.handleClose();
      }).not.toThrow();
    });

    it('setupGlobalEventListeners debe ejecutarse sin error', () => {
      expect(() => {
        app.setupGlobalEventListeners();
      }).not.toThrow();
    });
  });
});
