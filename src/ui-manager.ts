import { CastManager } from './cast-manager';
import { soundFiles, SoundFile } from './config';

export class UIManager {
    private castManager: CastManager;
    private onPlaySound: (soundName: string) => void;
    private onGoogleConnect: () => Promise<void>;
    private onClose: () => void;

    constructor(
        castManager: CastManager,
        onPlaySound: (soundName: string) => void,
        onGoogleConnect: () => Promise<void>,
        onClose: () => void
    ) {
        this.castManager = castManager;
        this.onPlaySound = onPlaySound;
        this.onGoogleConnect = onGoogleConnect;
        this.onClose = onClose;
    }

    public initializeUI(): void {
        this.createSoundButtons();
        this.setupEventListeners();
        this.updateCastButtonState();
    }

    private createSoundButtons(): void {
        const container = document.getElementById('soundGrid');
        if (!container) return;

        const fragment = document.createDocumentFragment();
        soundFiles.forEach((sound: SoundFile) => {
            const button = document.createElement('button');
            button.className = 'sound-button text-white font-bold py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50';
            button.textContent = sound.name;
            button.style.backgroundColor = sound.color;
            button.style.setProperty('--tw-ring-color', sound.color);
            button.dataset.sound = sound.name;
            button.setAttribute('aria-label', `Reproducir sonido ${sound.name}`);
            button.style.willChange = 'transform, opacity'; // Optimización de animación
            fragment.appendChild(button);
        });
        container.appendChild(fragment);
    }

    private setupEventListeners(): void {
        const soundGrid = document.getElementById('soundGrid');
        if (soundGrid) {
            soundGrid.addEventListener('click', (e: Event) => {
                const target = e.target as HTMLElement;
                if (target.classList.contains('sound-button') && target.dataset.sound) {
                    this.onPlaySound(target.dataset.sound);
                }
            });
        }

        const googleBtn = document.getElementById('googleBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.onGoogleConnect());
        }

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.onClose());
        }
    }
    
    public updateCastButtonState(): void {
        const button = document.getElementById('googleBtn') as HTMLButtonElement;
        if (!button) return;

        const devicesAvailable = this.castManager.areDevicesAvailable();
        
        if (devicesAvailable) {
            button.classList.remove('no-devices');
            button.disabled = false;
            button.title = 'Conectar a Google Cast';
        } else {
            button.classList.add('no-devices');
            button.disabled = true;
            button.title = 'No hay dispositivos Google Cast disponibles';
        }
        
        if (this.castManager.isConnected()) {
            button.textContent = '📡';
            button.classList.add('connected');
        } else {
            button.textContent = '📡';
            button.classList.remove('connected');
        }
    }

    public disableOtherButtons(currentSoundName: string): void {
        const buttons = document.querySelectorAll('.sound-button');
        buttons.forEach((btn: Element) => {
            const button = btn as HTMLButtonElement;
            if (button.dataset.sound !== currentSoundName) {
                button.disabled = true;
                button.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                button.classList.add('ring-4', 'scale-110');
            }
        });
    }

    public enableAllButtons(): void {
        const buttons = document.querySelectorAll('.sound-button');
        buttons.forEach((btn: Element) => {
            const button = btn as HTMLButtonElement;
            button.disabled = false;
            button.classList.remove('opacity-50', 'cursor-not-allowed', 'ring-4', 'scale-110');
        });
    }

    public showNotification(message: string): void {
        const notificationEl = document.getElementById('notification');
        if (!notificationEl) return;

        notificationEl.textContent = message;
        notificationEl.classList.remove('hidden');

        setTimeout(() => {
            notificationEl.classList.add('hidden');
        }, 3000);
    }

    public showInstallPrompt(deferredPrompt: any): void {
        const installPromptEl = document.getElementById('install-prompt');
        const installBtn = document.getElementById('install-btn');
        if (!installPromptEl || !installBtn) return;

        installPromptEl.classList.remove('hidden');

        installBtn.onclick = async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Resultado de instalación: ${outcome}`);
                installPromptEl.classList.add('hidden');
            }
        };
    }
}
