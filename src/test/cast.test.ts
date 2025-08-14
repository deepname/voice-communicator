import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CastService } from '../cast';

describe('Cast Domain - Input/Output Tests', () => {
    let castService: CastService;
    let mockCallbacks: {
        onStateChange: ReturnType<typeof vi.fn>;
        onError: ReturnType<typeof vi.fn>;
        onDeviceFound: ReturnType<typeof vi.fn>;
        onDevicesAvailable: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockCallbacks = {
            onStateChange: vi.fn(),
            onError: vi.fn(),
            onDeviceFound: vi.fn(),
            onDevicesAvailable: vi.fn(),
        };
        castService = new CastService();
        castService.setEventHandlers(mockCallbacks);
    });

    describe('Input Tests - CastService Methods', () => {
        it('should accept initialization without parameters', async () => {
            // Input: no parameters
            // Should not throw error
            expect(() => castService.initialize()).not.toThrow();
        });

        it('should accept event handlers via setEventHandlers', () => {
            // Input: event handlers object
            const handlers = {
                onStateChange: vi.fn(),
                onError: vi.fn(),
                onDeviceFound: vi.fn(),
                onDevicesAvailable: vi.fn(),
            };

            // Should not throw error
            expect(() => castService.setEventHandlers(handlers)).not.toThrow();
        });

        it('should accept sound data for castSound', async () => {
            // Input: sound name and URL
            const soundName = 'test-sound';
            const soundUrl = 'https://example.com/sound.mp3';
            
            // Should not throw error
            expect(() => castService.castSound(soundName, soundUrl)).not.toThrow();
        });

        it('should accept disconnect request', () => {
            // Input: disconnect request
            // Should not throw error
            expect(() => castService.disconnect()).not.toThrow();
        });
    });

    describe('Output Tests - CastService Events', () => {
        it('should trigger onStateChange callback when connection state changes', () => {
            // Setup
            const isConnected = true;
            const deviceName = 'Living Room Speaker';
            
            // Simulate state change
            castService.handleStateChange(isConnected, deviceName);
            
            // Verify output: onStateChange callback should be called
            expect(mockCallbacks.onStateChange).toHaveBeenCalledWith(isConnected, deviceName);
        });

        it('should trigger onError callback when Cast error occurs', () => {
            // Setup
            const error = new Error('Cast connection failed');
            
            // Simulate error
            castService.handleError(error);
            
            // Verify output: onError callback should be called
            expect(mockCallbacks.onError).toHaveBeenCalledWith(error);
        });

        it('should trigger onDeviceFound callback when device is discovered', () => {
            // Setup
            const deviceName = 'Bedroom Speaker';
            
            // Simulate device found
            castService.handleDeviceFound(deviceName);
            
            // Verify output: onDeviceFound callback should be called
            expect(mockCallbacks.onDeviceFound).toHaveBeenCalledWith(deviceName);
        });

        it('should return boolean for isConnected', () => {
            // Output: should return boolean
            const result = castService.isConnected();
            expect(typeof result).toBe('boolean');
        });

        it('should return string or null for getCurrentDevice', () => {
            // Output: should return device name or null
            const result = castService.getCurrentDevice();
            expect(result === null || typeof result === 'string').toBe(true);
        });

        it('should return array for getAvailableDevices', () => {
            // Output: should return array of device names
            const result = castService.getAvailableDevices();
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('State Management Tests', () => {
        it('should maintain connection state correctly', () => {
            // Initially not connected
            expect(castService.isConnected()).toBe(false);
            
            // After connection, should be connected
            castService.handleStateChange(true, 'Test Device');
            expect(castService.isConnected()).toBe(true);
            expect(castService.getCurrentDevice()).toBe('Test Device');
            
            // After disconnect, should not be connected
            castService.handleStateChange(false);
            expect(castService.isConnected()).toBe(false);
            expect(castService.getCurrentDevice()).toBe(null);
        });
    });
});
