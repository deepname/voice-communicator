import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { UIManager } from '../ui-manager';
import { CastManager } from '../cast-manager';
import { soundFiles } from '../config';

describe('UIManager', () => {
  let uiManager: UIManager;
  let mockCastManager: any;
  const onPlaySound = vi.fn();
  const onGoogleConnect = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    // DOM con los IDs correctos
    document.body.innerHTML = 
      '<div id="soundGrid"></div>' +
      '<button id="googleBtn"></button>' +
      '<button id="closeBtn"></button>';

    // Mock completo de CastManager
    mockCastManager = {
      isConnected: vi.fn().mockReturnValue(false),
      areDevicesAvailable: vi.fn().mockReturnValue(true),
    };

    uiManager = new UIManager(
      mockCastManager as CastManager,
      onPlaySound,
      onGoogleConnect,
      onClose
    );
    
    // Inicializamos la UI para que se creen los botones y listeners
    uiManager.initializeUI();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = ''; // Limpiar el DOM
  });

  it('debería crear un botón para cada sonido en #soundGrid', () => {
    const buttons = document.querySelectorAll('#soundGrid .sound-button');
    expect(buttons.length).toBe(soundFiles.length);
  });

  it('debería llamar a onPlaySound con el nombre correcto al hacer clic', () => {
    const firstButton = document.querySelector('#soundGrid .sound-button') as HTMLButtonElement;
    expect(firstButton).not.toBeNull();
    firstButton.click();
    expect(onPlaySound).toHaveBeenCalledWith(soundFiles[0].name);
  });

  it('debería llamar a onGoogleConnect al hacer clic en #googleBtn', () => {
    const googleButton = document.getElementById('googleBtn');
    expect(googleButton).not.toBeNull();
    googleButton!.click();
    expect(onGoogleConnect).toHaveBeenCalledTimes(1);
  });

  it('debería llamar a onClose al hacer clic en #closeBtn', () => {
    const closeButton = document.getElementById('closeBtn');
    expect(closeButton).not.toBeNull();
    closeButton!.click();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('debería añadir la clase .connected si cast está conectado', () => {
    mockCastManager.isConnected.mockReturnValue(true);
    uiManager.updateCastButtonState();
    const googleButton = document.getElementById('googleBtn');
    expect(googleButton!.classList.contains('connected')).toBe(true);
  });

  it('debería deshabilitar el botón de cast si no hay dispositivos', () => {
    mockCastManager.areDevicesAvailable.mockReturnValue(false);
    uiManager.updateCastButtonState();
    const googleButton = document.getElementById('googleBtn') as HTMLButtonElement;
    expect(googleButton.disabled).toBe(true);
    expect(googleButton.classList.contains('no-devices')).toBe(true);
  });

  it('debería crear y mostrar un prompt de instalación', () => {
    const mockPromptEvent = { 
      prompt: vi.fn(), 
      userChoice: Promise.resolve({ outcome: 'accepted' }) 
    };
    uiManager.showInstallPrompt(mockPromptEvent);

    const installPrompt = document.querySelector('.install-prompt');
    expect(installPrompt).not.toBeNull();
    expect(installPrompt!.textContent).toBe('📱 Instalar aplicación');

    (installPrompt as HTMLElement).click();
    expect(mockPromptEvent.prompt).toHaveBeenCalled();
  });
});
