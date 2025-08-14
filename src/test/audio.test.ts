import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AudioService } from '../audio';

describe('Audio Domain - Input/Output Tests', () => {
    let audioService: AudioService;
    let mockCallbacks: {
        onPlay: ReturnType<typeof vi.fn>;
        onEnded: ReturnType<typeof vi.fn>;
        onError: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockCallbacks = {
            onPlay: vi.fn(),
            onEnded: vi.fn(),
            onError: vi.fn(),
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
                onPlay: vi.fn(),
                onEnded: vi.fn(),
                onError: vi.fn(),
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
        it('should trigger onPlay callback when sound plays', async () => {
            // Setup
            const soundName = 'test-sound';
            
            // Execute
            await audioService.playSound(soundName);
            
            // Verify output: onPlay callback should be called
            expect(mockCallbacks.onPlay).toHaveBeenCalledWith(soundName);
        });

        it('should trigger onEnded callback when sound ends', () => {
            // Setup
            const soundName = 'test-sound';
            
            // Simulate sound ending
            audioService.handleSoundEnded(soundName);
            
            // Verify output: onEnded callback should be called
            expect(mockCallbacks.onEnded).toHaveBeenCalledWith(soundName);
        });

        it('should trigger onError callback when sound fails', () => {
            // Setup
            const soundName = 'test-sound';
            const error = new Error('Audio load failed');
            
            // Simulate error
            audioService.handleSoundError(soundName, error);
            
            // Verify output: onError callback should be called
            expect(mockCallbacks.onError).toHaveBeenCalledWith(soundName, error);
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
        it('should maintain internal state correctly', async () => {
            const soundName = 'test-sound';
            
            // Initially not playing
            expect(audioService.isPlaying(soundName)).toBe(false);
            
            // After play, should be playing
            await audioService.playSound(soundName);
            expect(audioService.isPlaying(soundName)).toBe(true);
            
            // After stop, should not be playing
            audioService.stopSound(soundName);
            expect(audioService.isPlaying(soundName)).toBe(false);
        });
    });
});
