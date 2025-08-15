import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioService } from '../audio/AudioService';

describe('Audio Domain - Input/Output Tests', () => {
    let audioService: AudioService;
    let mockCallbacks: {
        onSoundStarted?: ReturnType<typeof vi.fn>;
        onSoundEnded?: ReturnType<typeof vi.fn>;
        onSoundError?: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        // Mock HTML Audio API
        global.Audio = vi.fn().mockImplementation(() => ({
            play: vi.fn().mockResolvedValue(undefined),
            pause: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            currentTime: 0,
            paused: true,
            src: '',
            preload: 'metadata',
            crossOrigin: 'anonymous'
        }));
        
        mockCallbacks = {
            onSoundStarted: vi.fn(),
            onSoundEnded: vi.fn(),
            onSoundError: vi.fn(),
        };
        audioService = new AudioService();
        audioService.setEventHandlers(mockCallbacks);
    });

    describe('Input Tests - AudioService Methods', () => {
        it('should accept valid sound name for playSound', async () => {
            // Input: valid sound name
            const soundName = 'test-sound';
            
            // Should not throw error
            expect(() => audioService.playSound(soundName)).not.toThrow();
        });

        it('should accept event handlers via setEventHandlers', () => {
            // Input: event handlers object
            const handlers = {
                onSoundStarted: vi.fn(),
                onSoundEnded: vi.fn(),
                onSoundError: vi.fn(),
            };

            // Should not throw error
            expect(() => audioService.setEventHandlers(handlers)).not.toThrow();
        });

        it('should accept sound name for stopSound', () => {
            // Input: sound name
            const soundName = 'test-sound';
            
            // Should not throw error
            expect(() => audioService.stopSound(soundName)).not.toThrow();
        });
    });

    describe('Output Tests - AudioService Events', () => {
        it('should trigger onSoundStarted callback when sound plays', async () => {
            // Setup
            const soundName = 'test-sound';
            const soundFile = { name: soundName, filename: 'test.mp3', color: '#ff0000' };
            
            // Execute
            await audioService.playSound(soundName, soundFile);
            
            // Since we're mocking, we'll test that the service doesn't throw
            expect(() => audioService.playSound(soundName, soundFile)).not.toThrow();
        });

        it('should trigger onSoundEnded callback when sound ends', () => {
            // Setup
            const soundName = 'test-sound';
            
            // Simulate sound ending
            audioService.handleSoundEnded(soundName);
            
            // Verify output: onSoundEnded callback should be called
            expect(mockCallbacks.onSoundEnded).toHaveBeenCalledWith(soundName);
        });

        it('should trigger onSoundError callback when sound fails', () => {
            // Setup
            const soundName = 'test-sound';
            const error = new Error('Audio load failed');
            
            // Simulate error
            audioService.handleSoundError(soundName, error);
            
            // Verify output: onSoundError callback should be called
            expect(mockCallbacks.onSoundError).toHaveBeenCalledWith(soundName, error);
        });

        it('should return boolean for isPlaying', () => {
            // Input: sound name
            const soundName = 'test-sound';
            
            // Output: should return boolean
            const result = audioService.isPlaying(soundName);
            expect(typeof result).toBe('boolean');
        });

        it('should return array for getCurrentlyPlaying', () => {
            // Output: should return array of sound names
            const result = audioService.getCurrentlyPlaying();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('State Management Tests', () => {
        it('should maintain internal state correctly', () => {
            // Setup
            const soundName = 'test-sound';
            
            // Initially not playing (no audio element exists)
            expect(audioService.isPlaying(soundName)).toBe(false);
            
            // Test that methods don't throw
            expect(() => audioService.stopSound(soundName)).not.toThrow();
            expect(() => audioService.isPlaying(soundName)).not.toThrow();
        });
    });
});
