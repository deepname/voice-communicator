// Test setup configuration
import { beforeEach, vi } from 'vitest';

// Mock DOM environment
beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
        <div id="app-container">
            <header>
                <button id="closeBtn">✕</button>
                <h1>Voice Communicator</h1>
                <button id="googleBtn">📡</button>
            </header>
            <main id="soundGrid" class="flex-grow p-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <!-- Los botones se generarán dinámicamente -->
            </main>
            <div id="install-prompt" class="hidden">
                <span>Instalar la aplicación para una mejor experiencia.</span>
                <button id="install-btn">Instalar</button>
            </div>
            <div id="notification" class="hidden">Notificación</div>
        </div>
    `;

    // Mock localStorage
    const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true,
    });

    // Mock Audio constructor
    global.Audio = vi.fn().mockImplementation(() => ({
        play: vi.fn().mockResolvedValue(undefined),
        pause: vi.fn(),
        load: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        currentTime: 0,
        duration: 0,
        paused: true,
        ended: false,
    }));

    // Mock Google Cast API
    (global as any).window = {
        ...global.window,
        location: {
            protocol: 'https:',
            hostname: 'localhost'
        },
        cast: {
            framework: {
                CastContext: {
                    getInstance: vi.fn().mockReturnValue({
                        setOptions: vi.fn(),
                        requestSession: vi.fn(),
                        getCurrentSession: vi.fn(),
                        addEventListener: vi.fn(),
                        removeEventListener: vi.fn(),
                    }),
                },
                CastContextEventType: {
                    CAST_STATE_CHANGED: 'caststatechanged'
                },
                CastState: {
                    NOT_CONNECTED: 'NOT_CONNECTED',
                    CONNECTED: 'CONNECTED'
                },
                SessionManager: vi.fn(),
                RemotePlayer: vi.fn(),
                RemotePlayerController: vi.fn(),
            },
        },
    };
    
    global.cast = (global as any).window.cast;
});
