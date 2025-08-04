import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { VoiceCommunicatorApp } from '../app';
import { CastManager } from '../cast-manager';
import { AudioManager } from '../audio-manager';
import { UIManager } from '../ui-manager';
import { PWAManager } from '../pwa-manager';

// Mock de los módulos gestores
vi.mock('../cast-manager');
vi.mock('../audio-manager');
vi.mock('../ui-manager');
vi.mock('../pwa-manager');

describe('VoiceCommunicatorApp', () => {
  let domContentLoadedCallback: EventListener = () => {};

  beforeEach(() => {
    // Capturamos el callback de DOMContentLoaded en lugar de dispararlo inmediatamente
    vi.spyOn(document, 'addEventListener').mockImplementation((event, callback) => {
      if (event === 'DOMContentLoaded') {
        domContentLoadedCallback = callback as EventListener;
      }
    });
    
    // Limpiamos los mocks antes de cada test para evitar contadores acumulados
    vi.clearAllMocks();
    
    new VoiceCommunicatorApp();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería instanciar todos los gestores en el constructor', () => {
    expect(CastManager).toHaveBeenCalledTimes(1);
    expect(AudioManager).toHaveBeenCalledTimes(1);
    expect(UIManager).toHaveBeenCalledTimes(1);
    expect(PWAManager).toHaveBeenCalledTimes(1);
  });

  it('debería inicializar todos los gestores cuando el DOM esté cargado', () => {
    // Disparamos manualmente el evento para este test
    domContentLoadedCallback(new Event('DOMContentLoaded'));

    const audioManagerInstance = (AudioManager as any).mock.instances[0];
    const uiManagerInstance = (UIManager as any).mock.instances[0];
    const pwaManagerInstance = (PWAManager as any).mock.instances[0];

    expect(audioManagerInstance.preloadAudio).toHaveBeenCalledTimes(1);
    expect(uiManagerInstance.initializeUI).toHaveBeenCalledTimes(1);
    expect(pwaManagerInstance.setupPWA).toHaveBeenCalledTimes(1);
  });
});
