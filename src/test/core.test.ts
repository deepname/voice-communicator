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
        it('should provide access to audio service', () => {
            // Should provide access to audio service
            const audioService = applicationCoordinator.getAudioService();
            expect(audioService).toBeDefined();
            expect(typeof audioService.playSound).toBe('function');
        });

        it('should accept initialization without parameters', () => {
            // Input: no parameters for initialization
            // Should not throw error during construction
            expect(() => new ApplicationCoordinator()).not.toThrow();
        });

        it('should provide access to cast service', () => {
            // Should provide access to cast service
            const castService = applicationCoordinator.getCastService();
            expect(castService).toBeDefined();
            expect(typeof castService.initialize).toBe('function');
        });

        it('should provide access to application logic', () => {
            // Should provide access to application logic
            const appLogic = applicationCoordinator.getApplicationLogic();
            expect(appLogic).toBeDefined();
            expect(typeof appLogic.getState).toBe('function');
        });

        it('should provide access to all required services', () => {
            // Should provide access to all services
            expect(applicationCoordinator.getAudioService()).toBeDefined();
            expect(applicationCoordinator.getCastService()).toBeDefined();
            expect(applicationCoordinator.getUIComponents()).toBeDefined();
        });

        it('should initialize cast service properly', () => {
            // Cast service should be accessible and have required methods
            const castService = applicationCoordinator.getCastService();
            expect(typeof castService.initialize).toBe('function');
        });

        it('should provide PWA service access', () => {
            // PWA service should be accessible
            const pwaService = applicationCoordinator.getPWAService();
            expect(pwaService).toBeDefined();
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

        it('should provide data repository access', () => {
            // Should provide access to data repository
            const dataRepo = applicationCoordinator.getDataRepository();
            expect(dataRepo).toBeDefined();
            expect(typeof dataRepo.saveAppData).toBe('function');
            expect(typeof dataRepo.loadAppData).toBe('function');
        });

        it('should provide UI components access', () => {
            // UI components should be accessible
            const uiComponents = applicationCoordinator.getUIComponents();
            expect(uiComponents).toBeDefined();
            expect(typeof uiComponents.showNotification).toBe('function');
        });

        it('should provide complete service access', () => {
            // All services should be accessible and functional
            const dataRepo = applicationCoordinator.getDataRepository();
            const appLogic = applicationCoordinator.getApplicationLogic();
            
            // Test basic functionality without calling private methods
            expect(typeof dataRepo.saveAppData).toBe('function');
            expect(typeof appLogic.getState).toBe('function');
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
            // Input: sound name and available sounds
            const soundName = 'test-sound';
            const availableSounds = [{ name: 'test-sound', filename: 'test.mp3', color: '#ff0000' }];
            
            // Execute
            const result = applicationLogic.validateSoundOperation(soundName, availableSounds);
            
            // Verify output: should return validation object
            expect(typeof result).toBe('object');
            expect(typeof result.isValid).toBe('boolean');
            if (result.errorMessage) {
                expect(typeof result.errorMessage).toBe('string');
            }
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

        it('should validate sound operations correctly', () => {
            // Valid sound
            const validResult = applicationLogic.validateSoundOperation('test-sound', [{ name: 'test-sound', filename: 'test.mp3', color: '#ff0000' }]);
            expect(validResult.isValid).toBe(true);
            
            // Invalid sound
            const invalidResult = applicationLogic.validateSoundOperation('invalid-sound', [{ name: 'test-sound', filename: 'test.mp3', color: '#ff0000' }]);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errorMessage).toContain('invalid-sound');
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
            applicationLogic.setPlayingAudio(false);
            expect(applicationLogic.isPlayingAudio()).toBe(false);
            expect(applicationLogic.getCurrentSound()).toBe(null);
        });

        it('should validate sound operations correctly', () => {
            // Create test sound files
            const testSounds = [{ name: 'Ivan', filename: 'ivan.aac', color: '#ff0000' }];
            
            // Valid sound
            const validResult = applicationLogic.validateSoundOperation('Ivan', testSounds);
            expect(validResult.isValid).toBe(true);
            
            // Invalid sound
            const invalidResult = applicationLogic.validateSoundOperation('nonexistent', testSounds);
            expect(invalidResult.isValid).toBe(false);
            expect(invalidResult.errorMessage).toContain('nonexistent');
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

        it('should initialize all services without errors', () => {
            // All services should be initialized and accessible
            expect(() => {
                applicationCoordinator.getAudioService();
                applicationCoordinator.getCastService();
                applicationCoordinator.getUIComponents();
                applicationCoordinator.getDataRepository();
                applicationCoordinator.getApplicationLogic();
            }).not.toThrow();
        });

        it('should maintain service coordination', () => {
            // All services should work together without throwing errors
            expect(() => {
                const audioService = applicationCoordinator.getAudioService();
                const castService = applicationCoordinator.getCastService();
                const uiComponents = applicationCoordinator.getUIComponents();
                const dataRepo = applicationCoordinator.getDataRepository();
                const appLogic = applicationCoordinator.getApplicationLogic();
                
                // Basic state checks
                expect(audioService).toBeDefined();
                expect(castService).toBeDefined();
                expect(uiComponents).toBeDefined();
                expect(dataRepo).toBeDefined();
                expect(appLogic).toBeDefined();
            }).not.toThrow();
        });
    });
});
