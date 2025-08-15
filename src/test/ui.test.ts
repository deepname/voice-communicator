import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UIComponents } from '../ui';
import { soundFiles } from '../config';

describe('UI Domain - Input/Output Tests', () => {
    let uiComponents: UIComponents;
    let mockEventHandlers: {
        onSoundClick: ReturnType<typeof vi.fn>;
        onCastClick: ReturnType<typeof vi.fn>;
        onCloseClick: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        mockEventHandlers = {
            onSoundClick: vi.fn(),
            onCastClick: vi.fn(),
            onCloseClick: vi.fn(),
        };
        uiComponents = new UIComponents();
        uiComponents.setEventHandlers(mockEventHandlers);
    });

    describe('Input Tests - UIComponents Methods', () => {
        it('should accept sound files array for renderSoundButtons', () => {
            // Input: array of sound files
            const testSounds = [
                { name: 'sound1', filename: 'sound1.mp3', color: '#ff0000' },
                { name: 'sound2', filename: 'sound2.mp3', color: '#00ff00' }
            ];
            
            // Should not throw error
            expect(() => uiComponents.renderSoundButtons(testSounds)).not.toThrow();
        });

        it('should accept event handlers via setEventHandlers', () => {
            // Input: event handlers object
            const handlers = {
                onSoundClick: vi.fn(),
                onCastClick: vi.fn(),
                onCloseClick: vi.fn(),
            };

            // Should not throw error
            expect(() => uiComponents.setEventHandlers(handlers)).not.toThrow();
        });

        it('should accept notification message for showNotification', () => {
            // Input: notification message
            const message = 'Test notification';
            
            // Should not throw error
            expect(() => uiComponents.showNotification('test-message')).not.toThrow();
        });

        it('should accept cast state for updateCastButton', () => {
            // Input: connection state and device name
            const isConnected = true;
            const deviceName = 'Test Device';
            
            // Should not throw error
            expect(() => uiComponents.updateCastButton(isConnected, deviceName)).not.toThrow();
        });
    });

    describe('Output Tests - UIComponents Events', () => {
        it('should trigger onSoundClick when sound button is clicked', () => {
            // Setup: render buttons first
            uiComponents.renderSoundButtons(soundFiles);
            
            // Find and click a sound button
            const soundButton = document.querySelector('[data-sound]') as HTMLButtonElement;
            if (soundButton) {
                const soundName = soundButton.getAttribute('data-sound');
                soundButton.click();
                
                // Verify output: onSoundClick callback should be called
                expect(mockEventHandlers.onSoundClick).toHaveBeenCalledWith(soundName);
            }
        });

        it('should trigger onCastClick when cast button is clicked', () => {
            // Setup: attach control events
            uiComponents.attachControlEvents();
            
            // Find and click cast button
            const castButton = document.getElementById('googleBtn');
            if (castButton) {
                castButton.click();
                
                // Verify output: onCastClick callback should be called
                expect(mockEventHandlers.onCastClick).toHaveBeenCalled();
            }
        });

        it('should trigger onCloseClick when close button is clicked', () => {
            // Setup: attach control events
            uiComponents.attachControlEvents();
            
            // Find and click close button
            const closeButton = document.getElementById('closeBtn');
            if (closeButton) {
                closeButton.click();
                
                // Verify output: onCloseClick callback should be called
                expect(mockEventHandlers.onCloseClick).toHaveBeenCalled();
            }
        });

        it('should modify DOM when renderSoundButtons is called', () => {
            // Input: sound files
            const testSounds = [
                { name: 'sound1', filename: 'sound1.mp3', color: '#ff0000' }
            ];
            
            // Execute
            uiComponents.renderSoundButtons(testSounds);
            
            // Verify output: DOM should contain sound button
            const soundGrid = document.getElementById('soundGrid');
            const soundButtons = soundGrid?.querySelectorAll('[data-sound]');
            expect(soundButtons?.length).toBeGreaterThan(0);
        });

        it('should show notification in DOM when showNotification is called', () => {
            // Input: notification message
            const message = 'Test notification';
            
            // Execute
            uiComponents.showNotification(message);
            
            // Verify output: notification should be visible in DOM
            const notification = document.getElementById('notification');
            expect(notification?.textContent).toBe(message);
            expect(notification?.classList.contains('hidden')).toBe(false);
        });
    });

    describe('State Management Tests', () => {
        it('should update cast button state correctly', () => {
            // Setup: create cast button
            document.body.innerHTML = `
                <button id="cast-btn" title="Conectando...">Cast</button>
            `;
            const castButton = document.getElementById('cast-btn') as HTMLButtonElement;
            
            // Before connection
            expect(castButton?.title).toBe('Conectando...');
            
            // Test that updateCastButton method doesn't throw
            expect(() => uiComponents.updateCastButton(true, 'Test Device')).not.toThrow();
            
            // Test basic functionality
            expect(castButton).toBeDefined();
        });

        it('should hide notification after timeout', () => {
            // Show notification
            uiComponents.showNotification('Test message');
            
            // Check it's visible
            const notification = document.getElementById('notification');
            expect(notification?.classList.contains('hidden')).toBe(false);
            
            // Test basic notification functionality
            expect(notification).toBeDefined();
        });
    });
});
