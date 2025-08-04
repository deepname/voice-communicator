import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CastManager } from '../cast-manager';
import { CastInitializer } from '../cast-initializer';
import { CastPlayer } from '../cast-player';
import { soundFiles } from '../config';

// Mockear módulos de los que dependemos
vi.mock('../cast-initializer');
vi.mock('../cast-player');

// Mock del objeto que devuelve CastInitializer
const mockCastContext = {
  setOptions: vi.fn(),
  addEventListener: vi.fn(),
  // Devolver 'CONNECTED' por defecto para que la lógica de reproducción funcione
  getCastState: vi.fn(() => 'CONNECTED'),
  getCurrentSession: vi.fn(() => null),
  requestSession: vi.fn(() => Promise.resolve()),
};

describe('CastManager', () => {
  let castManager: CastManager;
  let originalCast: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Simular window.location para getFullAudioUrl
    vi.stubGlobal('location', {
      origin: 'http://test.com',
      pathname: '/app/',
    });

    // Simular el objeto global 'cast' que usa el SDK
    originalCast = (global as any).cast;
    (global as any).cast = {
      framework: {
        CastContextEventType: { CAST_STATE_CHANGED: 'caststatechanged' },
        CastState: { 
          NO_DEVICES_AVAILABLE: 'NO_DEVICES_AVAILABLE',
          CONNECTED: 'CONNECTED',
        },
      },
    };

    // El mock de CastInitializer debe devolver una promesa que resuelve al mock context
    vi.mocked(CastInitializer).mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(mockCastContext),
      isCastSDKReady: vi.fn(() => true),
      setupCastContext: vi.fn(),
    } as any));

    
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (global as any).cast = originalCast;
  });

  it('debería inicializar y añadir listeners al llamar a initialize', async () => {
    await castManager.initialize();
    // Verifica que se intentó inicializar
    expect(CastInitializer).toHaveBeenCalledTimes(1);
    // Verifica que se añadió el listener de cambio de estado
    expect(mockCastContext.addEventListener).toHaveBeenCalledWith('caststatechanged', expect.any(Function));
  });

  it('debería llamar al callback onStateChange cuando el estado de cast cambia', async () => {
    const onStateChange = vi.fn();
    castManager.onStateChange(onStateChange);
    await castManager.initialize(); // Necesario para que se añada el listener

    // Extraer el listener del mock
    const stateChangeListener = mockCastContext.addEventListener.mock.calls[0][1];
    expect(stateChangeListener).toBeDefined();

    // Simular un evento de cambio de estado
    stateChangeListener({ castState: 'CONNECTED' });
    
    expect(onStateChange).toHaveBeenCalledWith('CONNECTED');
  });

  it('debería construir la URL completa del audio correctamente', () => {
    const url = castManager.getFullAudioUrl('test.mp3');
    // Comprueba que la URL se forma con origin, pathname y la ruta del sonido
    expect(url).toBe('http://test.com/app/sound/test.mp3');
  });

    beforeEach(() => {
    // Espiamos el prototipo ANTES de que se cree la instancia
    vi.spyOn(CastPlayer.prototype, 'playAudio').mockResolvedValue(true);
    castManager = new CastManager();
  });

  it('debería llamar a CastPlayer.playAudio si está conectado', async () => {
    
    const mockSession = { id: 'test-session' };
    vi.mocked(mockCastContext.getCurrentSession).mockReturnValue(mockSession as any);
    

    await castManager.initialize();

    const sound = soundFiles[0];
    const fullUrl = castManager.getFullAudioUrl(sound.filename);
    castManager.playAudioOnCast(fullUrl, sound.name);

    expect(CastPlayer.prototype.playAudio).toHaveBeenCalledWith(mockSession, fullUrl, sound.name);
  });
});
