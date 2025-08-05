import { describe, it, expect, beforeEach } from 'vitest';
import { AudioManager } from '../audio-manager';

describe('AudioManager - Tests Básicos', () => {
  let audioManager: AudioManager;
  const mockOnPlay = () => {};
  const mockOnEnded = () => {};

  beforeEach(() => {
    audioManager = new AudioManager(mockOnPlay, mockOnEnded);
  });

  describe('getAudioElement()', () => {
    it('debe devolver HTMLAudioElement, null o undefined', () => {
      const result = audioManager.getAudioElement('test');
      expect(result === null || result === undefined || result instanceof HTMLAudioElement).toBe(true);
    });

    it('debe aceptar string como parámetro', () => {
      expect(() => {
        audioManager.getAudioElement('test-sound');
      }).not.toThrow();
    });
  });

  describe('playSound()', () => {
    it('debe aceptar string como parámetro', () => {
      expect(() => {
        audioManager.playSound('test-sound');
      }).not.toThrow();
    });

    it('debe manejar strings vacíos', () => {
      expect(() => {
        audioManager.playSound('');
      }).not.toThrow();
    });
  });

  describe('stopAll()', () => {
    it('debe ejecutarse sin error', () => {
      expect(() => {
        audioManager.stopAll();
      }).not.toThrow();
    });
  });
});
