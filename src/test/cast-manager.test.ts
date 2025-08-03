import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CastManager } from '../cast-manager';

describe('CastManager', () => {
  let castManager: CastManager;

  beforeEach(() => {
    vi.clearAllMocks();
    castManager = new CastManager();
  });

  it('should create CastManager instance', () => {
    expect(castManager).toBeInstanceOf(CastManager);
  });

  it('should return false when not connected initially', () => {
    expect(castManager.isConnected()).toBe(false);
  });

  it('should generate correct audio URL', () => {
    const filename = 'test.mp3';
    const url = castManager.getFullAudioUrl(filename);
    
    expect(url).toContain('sound/test.mp3');
    expect(url).toMatch(/^https?:\/\//);
  });

  it('should return empty device name when not connected', () => {
    const deviceName = castManager.getDeviceName();
    expect(deviceName).toBe('');
  });

  it('should handle state change callback', () => {
    const mockCallback = vi.fn();
    castManager.onStateChange(mockCallback);
    
    // Callback should be registered without errors
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
