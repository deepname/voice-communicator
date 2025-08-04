import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PWAManager } from '../pwa-manager';

// Mock del serviceWorker en el navigator
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn(() => Promise.resolve('ServiceWorkerRegistration successful')),
  },
  configurable: true,
});

// Mock genérico para eventos de window
const eventListeners: { [key: string]: ((event: any) => void)[] } = {};

window.addEventListener = vi.fn((event, callback) => {
  const eventName = event as string;
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(callback as any);
});

describe('PWAManager', () => {
  let pwaManager: PWAManager;
  const onInstallPromptCallback = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Limpiar listeners para cada test
    for (const key in eventListeners) {
      delete eventListeners[key];
    }
    pwaManager = new PWAManager(onInstallPromptCallback);
  });

  it('debería registrar el service worker en el evento load', () => {
    pwaManager.setupPWA();

    // Simular que el evento 'load' se dispara
    expect(eventListeners['load']).toBeDefined();
    eventListeners['load'][0]({}); // Disparar el callback

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith('./sw.js');
  });

  it('debería manejar el evento beforeinstallprompt y llamar al callback', () => {
    pwaManager.setupPWA();
    
    const mockInstallPromptEvent = { preventDefault: vi.fn() };
    // Simular que el evento 'beforeinstallprompt' se dispara
    expect(eventListeners['beforeinstallprompt']).toBeDefined();
    eventListeners['beforeinstallprompt'][0](mockInstallPromptEvent); 

    expect(onInstallPromptCallback).toHaveBeenCalledWith(mockInstallPromptEvent);
  });
});
