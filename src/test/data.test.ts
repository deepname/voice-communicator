import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DataRepository, DataAdapters } from '../data';

describe('Data Domain - Input/Output Tests', () => {
    let dataRepository: DataRepository;

    beforeEach(() => {
        dataRepository = new DataRepository();
        // Clear localStorage before each test
        localStorage.clear();
    });

    describe('Input Tests - DataRepository Methods', () => {
        it('should accept app data for saveAppData', () => {
            // Input: app data object
            const appData = {
                isInitialized: true,
                lastUsed: new Date().toISOString(),
                settings: { volume: 0.8 }
            };
            
            // Should not throw error
            expect(() => dataRepository.saveAppData(appData)).not.toThrow();
        });

        it('should accept cast data for saveCastData', () => {
            // Input: cast data object
            const castData = {
                lastConnectedDevice: 'Living Room Speaker',
                isConnected: false,
                connectionHistory: ['Device1', 'Device2']
            };
            
            // Should not throw error
            expect(() => dataRepository.saveCastData(castData)).not.toThrow();
        });

        it('should accept sound data for saveSoundData', () => {
            // Input: sound data object
            const soundData = {
                lastPlayed: 'test-sound',
                playCount: { 'test-sound': 5, 'another-sound': 3 },
                favorites: ['test-sound']
            };
            
            // Should not throw error
            expect(() => dataRepository.saveSoundData(soundData)).not.toThrow();
        });

        it('should accept key for data removal', () => {
            // Input: storage key
            const key = 'test-key';
            
            // Should not throw error
            expect(() => dataRepository.removeData(key)).not.toThrow();
        });
    });

    describe('Output Tests - DataRepository Methods', () => {
        it('should return app data object from loadAppData', () => {
            // Setup: save some data first
            const testData = {
                isInitialized: true,
                lastUsed: new Date().toISOString(),
                settings: { volume: 0.8 }
            };
            dataRepository.saveAppData(testData);
            
            // Execute and verify output
            const result = dataRepository.loadAppData();
            expect(result).toEqual(testData);
            expect(typeof result.isInitialized).toBe('boolean');
            expect(typeof result.lastUsed).toBe('string');
            expect(typeof result.settings).toBe('object');
        });

        it('should return cast data object from loadCastData', () => {
            // Setup: save some data first
            const testData = {
                lastConnectedDevice: 'Test Device',
                isConnected: false,
                connectionHistory: ['Device1']
            };
            dataRepository.saveCastData(testData);
            
            // Execute and verify output
            const result = dataRepository.loadCastData();
            expect(result).toEqual(testData);
            expect(typeof result.lastConnectedDevice).toBe('string');
            expect(typeof result.isConnected).toBe('boolean');
            expect(Array.isArray(result.connectionHistory)).toBe(true);
        });

        it('should return sound data object from loadSoundData', () => {
            // Setup: save some data first
            const testData = {
                lastPlayed: 'test-sound',
                playCount: { 'test-sound': 5 },
                favorites: ['test-sound']
            };
            dataRepository.saveSoundData(testData);
            
            // Execute and verify output
            const result = dataRepository.loadSoundData();
            expect(result).toEqual(testData);
            expect(typeof result.lastPlayed).toBe('string');
            expect(typeof result.playCount).toBe('object');
            expect(Array.isArray(result.favorites)).toBe(true);
        });

        it('should return null for non-existent data', () => {
            // Execute: try to load non-existent data
            const result = dataRepository.loadAppData();
            
            // Verify output: should return null or default values
            expect(result === null || typeof result === 'object').toBe(true);
        });

        it('should return boolean for hasData', () => {
            // Input: storage key
            const key = 'app-data';
            
            // Output: should return boolean
            const result = dataRepository.hasData(key);
            expect(typeof result).toBe('boolean');
        });
    });

    describe('DataAdapters Tests', () => {
        it('should convert internal data to storage format', () => {
            // Input: internal app data
            const internalData = {
                isInitialized: true,
                lastUsed: new Date(),
                settings: { volume: 0.8 }
            };
            
            // Execute
            const storageData = DataAdapters.toStorage(internalData);
            
            // Verify output: should be serializable
            expect(typeof storageData).toBe('string');
            expect(() => JSON.parse(storageData)).not.toThrow();
        });

        it('should convert storage data to internal format', () => {
            // Input: storage data string
            const storageData = JSON.stringify({
                isInitialized: true,
                lastUsed: '2023-01-01T00:00:00.000Z',
                settings: { volume: 0.8 }
            });
            
            // Execute
            const internalData = DataAdapters.fromStorage(storageData);
            
            // Verify output: should be proper object
            expect(typeof internalData).toBe('object');
            expect(internalData.isInitialized).toBe(true);
            expect(typeof internalData.settings).toBe('object');
        });

        it('should handle invalid storage data gracefully', () => {
            // Input: invalid JSON string
            const invalidData = 'invalid-json-string';
            
            // Execute and verify: should not throw error
            expect(() => DataAdapters.fromStorage(invalidData)).not.toThrow();
            
            // Should return null or default value
            const result = DataAdapters.fromStorage(invalidData);
            expect(result === null || typeof result === 'object').toBe(true);
        });
    });

    describe('Persistence Tests', () => {
        it('should persist data across repository instances', () => {
            // Setup: save data with first instance
            const testData = { isInitialized: true, lastUsed: new Date().toISOString() };
            dataRepository.saveAppData(testData);
            
            // Create new instance
            const newRepository = new DataRepository();
            
            // Verify: data should be available in new instance
            const loadedData = newRepository.loadAppData();
            expect(loadedData).toEqual(testData);
        });

        it('should handle localStorage quota exceeded', () => {
            // Mock localStorage to throw quota exceeded error
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = vi.fn().mockImplementation(() => {
                throw new Error('QuotaExceededError');
            });
            
            // Should handle error gracefully
            expect(() => {
                dataRepository.saveAppData({ isInitialized: true, lastUsed: new Date().toISOString() });
            }).not.toThrow();
            
            // Restore original method
            localStorage.setItem = originalSetItem;
        });
    });
});
