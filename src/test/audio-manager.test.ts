import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioManager } from '../audio-manager';
import { soundFiles } from '../config';

// Función que crea una nueva instancia de mock para Audio
const createMockAudio = () => ({
  play: vi.fn(() => Promise.resolve()),
  pause: vi.fn(),
  load: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  currentTime: 0,
  src: '',
  preload: '',
  crossOrigin: '',
  paused: true, // Por defecto, el audio está pausado
});

// Mock del constructor de Audio que devuelve una nueva instancia cada vez
const AudioMock = vi.fn(createMockAudio);

describe('AudioManager', () => {
  let audioManager: AudioManager;
  const onPlay = vi.fn();
  const onEnded = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Reemplazar la clase Audio global con nuestro mock
    vi.stubGlobal('Audio', AudioMock);

    audioManager = new AudioManager(onPlay, onEnded);
    // ¡Clave! La precarga ocurre aquí, creando los objetos Audio
    audioManager.preloadAudio();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('debería crear un objeto Audio único para cada fichero de sonido', () => {
    expect(AudioMock).toHaveBeenCalledTimes(soundFiles.length);
    const audioObjects = audioManager.getAudioObjects();
    expect(Object.keys(audioObjects).length).toBe(soundFiles.length);

    // Verificar que cada objeto de audio tiene la fuente correcta y es una instancia única
    const firstAudio = audioObjects[soundFiles[0].name];
    const secondAudio = audioObjects[soundFiles[1].name];

    expect(firstAudio.src).toContain(soundFiles[0].filename);
    expect(secondAudio.src).toContain(soundFiles[1].filename);
    expect(firstAudio).not.toBe(secondAudio);
  });

  it('debería reproducir un sonido y llamar al callback onPlay', () => {
    const soundName = soundFiles[0].name;
    audioManager.playSound(soundName);
    
    const audioObject = audioManager.getAudioElement(soundName);
    expect(audioObject).toBeDefined();
    expect(audioObject!.play).toHaveBeenCalledTimes(1);

    // Simular el disparo del evento 'play'
    const playListener = (audioObject!.addEventListener as any).mock.calls.find(
      (call: any) => call[0] === 'play'
    );
    expect(playListener).toBeDefined();
    playListener[1](); // Disparar el callback
    expect(onPlay).toHaveBeenCalledWith(soundName);
  });

  it('debería llamar al callback onEnded cuando un sonido termina', () => {
    const soundName = soundFiles[1].name;
    const audioObject = audioManager.getAudioElement(soundName);
    expect(audioObject).toBeDefined();

    // Simular el disparo del evento 'ended'
    const endedListener = (audioObject!.addEventListener as any).mock.calls.find(
      (call: any) => call[0] === 'ended'
    );
    expect(endedListener).toBeDefined();
    endedListener[1](); // Disparar el callback
    expect(onEnded).toHaveBeenCalledWith(soundName);
  });

  it('debería detener todos los sonidos', () => {
    // Simular que un audio se está reproduciendo
    const audioObject = audioManager.getAudioElement(soundFiles[0].name);
    Object.defineProperty(audioObject, 'paused', { value: false });

    audioManager.stopAll();

    expect(audioObject!.pause).toHaveBeenCalled();
    expect(audioObject!.currentTime).toBe(0);
  });
});
