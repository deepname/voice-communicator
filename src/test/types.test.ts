import { describe, it, expect } from 'vitest';
import type { CastDevice, CastSession, MediaInfo } from '../cast-types';

describe('TypeScript Types', () => {
  it('should define CastDevice interface correctly', () => {
    const mockDevice: CastDevice = {
      deviceId: 'test-device-id',
      friendlyName: 'Test Device',
      capabilities: []
    };
    
    expect(mockDevice.deviceId).toBe('test-device-id');
    expect(mockDevice.friendlyName).toBe('Test Device');
    expect(Array.isArray(mockDevice.capabilities)).toBe(true);
  });

  it('should define MediaInfo interface correctly', () => {
    const mockMediaInfo: MediaInfo = {
      contentId: 'test-content-id',
      contentType: 'audio/mpeg',
      streamType: 'BUFFERED',
      metadata: {
        type: 0,
        metadataType: 0,
        title: 'Test Audio',
        subtitle: 'Test Subtitle'
      }
    };
    
    expect(mockMediaInfo.contentId).toBe('test-content-id');
    expect(mockMediaInfo.contentType).toBe('audio/mpeg');
    expect(mockMediaInfo.streamType).toBe('BUFFERED');
    expect(mockMediaInfo.metadata.title).toBe('Test Audio');
  });

  it('should handle sound file configuration type', () => {
    interface SoundFile {
      name: string;
      filename: string;
      color: string;
    }
    
    const mockSoundFile: SoundFile = {
      name: 'Test',
      filename: 'test.mp3',
      color: '#FF0000'
    };
    
    expect(mockSoundFile.name).toBe('Test');
    expect(mockSoundFile.filename).toBe('test.mp3');
    expect(mockSoundFile.color).toBe('#FF0000');
  });
});
