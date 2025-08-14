import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ApplicationCoordinator, ApplicationLogic } from '../core';
import { soundFiles } from '../config';

describe('Core Domain - Input/Output Tests', () => {
    let applicationCoordinator: ApplicationCoordinator;
    let applicationLogic: ApplicationLogic;

    beforeEach(() => {
        applicationCoordinator = new ApplicationCoordinator();
        applicationLogic = new ApplicationLogic();
    });

    describe('ApplicationCoordinator Input Tests', () => {
        it('should accept sound name for playSound', async () => {
            // Input: valid sound name
            const soundName = 'test-sound';
            
            // Should not throw error
            expect(() => applicationCoordinator.playSound(soundName)).not.toThrow();
        });

        it('should accept initialization without parameters', () => {
            // Input: no parameters for initialization
            // Should not throw error during construction
            expect(() => new ApplicationCoordinator()).not.toThrow();
        });

        it('should accept cast connection request', async () => {
            // Input: cast connection request
            // Should not throw error
            expect(() => applicationCoordinator.connectToCast()).not.toThrow();
        });

        it('should accept close request', () => {
            // Input: close application request
            // Should not throw error
            expect(() => applicationCoordinator.handleClose()).not.toThrow();
        });
    });

    describe('ApplicationCoordinator Output Tests', () => {
        it('should return service instances via getters', () => {
            // Output: should return service instances
            expect(applicationCoordinator.getAudioService()).toBeDefined();
            expect(applicationCoordinator.getCastService()).toBeDefined();
            expect(applicationCoordinator.getPWAService()).toBeDefined();
            expect(applicationCoordinator.getApplicationLogic()).toBeDefined();
        });

        it('should return data repository instance', () => {
            // Output: should return data repository
            const dataRepo = applicationCoordinator.getDataRepository();
            expect(dataRepo).toBeDefined();
            expect(typeof dataRepo.saveAppData).toBe('function');
        });

        it('should trigger UI updates when state changes', async () => {
            // Setup: spy on UI methods
            const uiComponents = applicationCoordinator.getUIComponents();
            const showNotificationSpy = vi.spyOn(uiComponents, 'showNotification');
            
            // Execute: play a sound
            await applicationCoordinator.playSound('test-sound');
            
            // Verify output: UI should be updated
            expect(showNotificationSpy).toHaveBeenCalled();
        });

        it('should save data when state changes', async () => {
            // Setup: spy on data repository
            const dataRepo = applicationCoordinator.getDataRepository();
            const saveAppDataSpy = vi.spyOn(dataRepo, 'saveAppData');
            
            // Execute: change application state
            await applicationCoordinator.playSound('test-sound');
            
            // Verify output: data should be saved
            expect(saveAppDataSpy).toHaveBeenCalled();
        });
    });

    describe('ApplicationLogic Input Tests', () => {
        it('should accept sound name and files for validation', () => {
            // Input: sound name and sound files array
            const soundName = 'test-sound';
            const files = soundFiles;
            
            // Should not throw error
            expect(() => applicationLogic.validateSoundOperation(soundName, files)).not.toThrow();
        });

        it('should accept state updates', () => {
            // Input: state properties
            const isConnecting = true;
            const isPlaying = false;
            const currentSound = 'test-sound';
            
            // Should not throw error
            expect(() => applicationLogic.setConnecting(isConnecting)).not.toThrow();
            expect(() => applicationLogic.setPlayingAudio(isPlaying, currentSound)).not.toThrow();
        });

        it('should accept initialization flag', () => {
            // Input: initialization boolean
            const isInitialized = true;
            
            // Should not throw error
            expect(() => applicationLogic.setInitialized(isInitialized)).not.toThrow();
        });
    });

    describe('ApplicationLogic Output Tests', () => {
        it('should return validation result object', () => {
            // Input: sound name and files
            const soundName = 'test-sound';
            const files = soundFiles;
            
            // Execute
            const result = applicationLogic.validateSoundOperation(soundName, files);
            
            // Verify output: should return validation object
            expect(typeof result).toBe('object');
            expect(typeof result.isValid).toBe('boolean');
            expect(typeof result.message).toBe('string');
        });

        it('should return current state values', () => {
            // Output: should return state properties
            expect(typeof applicationLogic.isConnecting()).toBe('boolean');
            expect(typeof applicationLogic.isPlayingAudio()).toBe('boolean');
            expect(typeof applicationLogic.isInitialized()).toBe('boolean');
            
            const currentSound = applicationLogic.getCurrentSound();
            expect(currentSound === null || typeof currentSound === 'string').toBe(true);
        });

        it('should return application state object', () => {
            // Output: should return complete state
            const state = applicationLogic.getState();
            expect(typeof state).toBe('object');
            expect(typeof state.isConnecting).toBe('boolean');
            expect(typeof state.isPlayingAudio).toBe('boolean');
            expect(typeof state.isInitialized).toBe('boolean');
            expect(state.currentSound === null || typeof state.currentSound === 'string').toBe(true);
        });
    });

    describe('State Management Tests', () => {
        it('should maintain state consistency across operations', () => {
            // Initial state
            expect(applicationLogic.isPlayingAudio()).toBe(false);
            expect(applicationLogic.getCurrentSound()).toBe(null);
            
            // Set playing state
            applicationLogic.setPlayingAudio(true, 'test-sound');
            expect(applicationLogic.isPlayingAudio()).toBe(true);
            expect(applicationLogic.getCurrentSound()).toBe('test-sound');
            
            // Stop playing
            applicationLogic.setPlayingAudio(false, null);
            expect(applicationLogic.isPlayingAudio()).toBe(false);
            expect(applicationLogic.getCurrentSound()).toBe(null);
        });

        it('should validate sound operations correctly', () => {
            // Valid sound
            const validResult = applicationLogic.validateSoundOperation('Ivan', soundFiles);
            expect(validResult.isValid).toBe(true);
            
            // Invalid sound
            const invalidResult = applicationLogic.validateSoundOperation('nonexistent', soundFiles);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.message).toContain('no encontrado');
        });
    });

    describe('Integration Tests', () => {
        it('should coordinate between all domains correctly', async () => {
            // Setup: get all services
            const audioService = applicationCoordinator.getAudioService();
            const castService = applicationCoordinator.getCastService();
            const uiComponents = applicationCoordinator.getUIComponents();
            const dataRepo = applicationCoordinator.getDataRepository();
            
            // All services should be initialized
            expect(audioService).toBeDefined();
            expect(castService).toBeDefined();
            expect(uiComponents).toBeDefined();
            expect(dataRepo).toBeDefined();
        });

        it('should handle errors gracefully across domains', async () => {
            // Setup: mock console.error to capture error handling
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            // Execute: try to play invalid sound
            await applicationCoordinator.playSound('invalid-sound-name');
            
            // Verify: should handle error without throwing
            expect(consoleErrorSpy).toHaveBeenCalled();
            
            // Cleanup
            consoleErrorSpy.mockRestore();
        });
    });
});
