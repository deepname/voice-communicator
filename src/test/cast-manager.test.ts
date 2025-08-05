import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CastManager } from '../cast-manager';

describe('CastManager - Tests Básicos', () => {
  let castManager: CastManager;

  beforeEach(() => {
    castManager = new CastManager();
  });

  describe('isConnected()', () => {
    it('debe devolver boolean', () => {
      const result = castManager.isConnected();
      expect(typeof result).toBe('boolean');
    });

    it('debe devolver false por defecto', () => {
      expect(castManager.isConnected()).toBe(false);
    });
  });

  describe('getDeviceName()', () => {
    it('debe devolver string', () => {
      const result = castManager.getDeviceName();
      expect(typeof result).toBe('string');
    });

    it('debe devolver string vacío si no hay sesión', () => {
      expect(castManager.getDeviceName()).toBe('');
    });
  });

  describe('getFullAudioUrl()', () => {
    it('debe devolver string con input válido', () => {
      const result = castManager.getFullAudioUrl('test.mp3');
      expect(typeof result).toBe('string');
    });

    it('debe contener el filename en la URL', () => {
      const filename = 'audio.wav';
      const result = castManager.getFullAudioUrl(filename);
      expect(result).toContain(filename);
    });

    it('debe manejar strings vacíos', () => {
      const result = castManager.getFullAudioUrl('');
      expect(typeof result).toBe('string');
    });
  });

  describe('onStateChange()', () => {
    it('debe aceptar función callback sin error', () => {
      const callback = vi.fn();
      expect(() => {
        castManager.onStateChange(callback);
      }).not.toThrow();
    });

    it('no debe llamar al callback inmediatamente', () => {
      const callback = vi.fn();
      castManager.onStateChange(callback);
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('areDevicesAvailable()', () => {
    it('debe devolver boolean', () => {
      const result = castManager.areDevicesAvailable();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getCastState()', () => {
    it('debe devolver un valor definido', () => {
      const result = castManager.getCastState();
      expect(result).toBeDefined();
    });
  });
});
