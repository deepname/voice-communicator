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

        soundFiles.forEach((sound: SoundFile) => {
            const button = document.createElement('button');
            button.className = 'sound-button';
            button.textContent = sound.name;
            button.style.backgroundColor = sound.color;
            button.dataset.sound = sound.name;

            button.addEventListener('click', () => this.onPlaySound(sound.name));

            container.appendChild(button);
        });
    }

    private setupEventListeners(): void {
        const googleBtn = document.getElementById('googleBtn');
        const closeBtn = document.getElementById('closeBtn');

        if (googleBtn) {
            googleBtn.addEventListener('click', () => this.onGoogleConnect());
        }

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
                button.classList.add('disabled');
            } else {
                button.classList.add('playing');
            }
        });
    }

    public enableAllButtons(): void {
        const buttons = document.querySelectorAll('.sound-button');
        buttons.forEach((btn: Element) => {
            const button = btn as HTMLButtonElement;
            button.disabled = false;
            button.classList.remove('disabled', 'playing');
        });
    }

    public showNotification(message: string): void {
        const notification = document.createElement('div');
        notification.className = 'install-prompt'; // Reusing style
        notification.textContent = message;
        notification.style.bottom = '20px';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    public showInstallPrompt(deferredPrompt: any): void {
        const installPrompt = document.createElement('div');
        installPrompt.className = 'install-prompt';
        installPrompt.textContent = '📱 Instalar aplicación';
        
        installPrompt.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Resultado de instalación: ${outcome}`);
                installPrompt.remove();
            }
        });
        
        document.body.appendChild(installPrompt);
        
        setTimeout(() => {
            if (installPrompt.parentNode) {
                installPrompt.remove();
            }
        }, 10000);
    }
}
