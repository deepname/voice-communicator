import './styles/main.scss';
import { CastManager } from './cast-manager';
import { AudioManager } from './audio-manager';
import { UIManager } from './ui-manager';
import { PWAManager } from './pwa-manager';

export class VoiceCommunicatorApp {
    private castManager: CastManager;
    private audioManager: AudioManager;
    private uiManager: UIManager;
    private pwaManager: PWAManager;

    private isConnecting: boolean = false;
    private isPlayingAudio: boolean = false;

    constructor() {
        this.castManager = new CastManager();
        this.audioManager = new AudioManager(
            (soundName) => this.handlePlay(soundName),
            (soundName) => this.handleEnded(soundName)
        );
        this.uiManager = new UIManager(
            this.castManager,
            (soundName) => this.playSound(soundName),
            () => this.handleGoogleConnect(),
            () => this.handleClose()
        );
        this.pwaManager = new PWAManager(
            (prompt) => this.uiManager.showInstallPrompt(prompt)
        );

        this.castManager.onStateChange(() => {
            setTimeout(() => this.uiManager.updateCastButtonState(), 500);
        });

        this.init();
    }

    private init(): void {
        document.addEventListener('DOMContentLoaded', () => {
            this.uiManager.initializeUI();
            this.pwaManager.setupPWA();
            this.setupGlobalEventListeners();
        });
    }

    private handlePlay(soundName: string): void {
        this.isPlayingAudio = true;
        this.uiManager.disableOtherButtons(soundName);
    }

    private handleEnded(soundName: string): void {
        this.isPlayingAudio = false;
        this.uiManager.enableAllButtons();
    }

    private async playSound(soundName: string): Promise<void> {
        if (this.isConnecting || (this.isPlayingAudio && this.audioManager.getAudioElement(soundName)?.paused === false)) {
             // Si se pulsa el mismo botón, el audio manager lo detiene
            if (this.isPlayingAudio && this.audioManager.getAudioElement(soundName)?.paused === false) {
                this.audioManager.stopAll();
                this.handleEnded(soundName);
            }
            return;
        }

        if (this.castManager.isConnected()) {
            try {
                const audio = this.audioManager.getAudioElement(soundName);
                if (!audio) return;

                const fullUrl = this.castManager.getFullAudioUrl(audio.src);
                const success = await this.castManager.playAudioOnCast(fullUrl, soundName);
                if (success) {
                    this.uiManager.disableOtherButtons(soundName);
                    setTimeout(() => this.uiManager.enableAllButtons(), 5000); 
                } else {
                    this.uiManager.showNotification('❌ Error al reproducir en Cast');
                }
            } catch (error) {
                console.error('Error al castear audio:', error);
                this.uiManager.showNotification('❌ Error al enviar audio a Cast');
            }
        } else {
            this.audioManager.playSound(soundName);
        }
    }

    private async handleGoogleConnect(): Promise<void> {
        if (this.isConnecting) return;
        this.isConnecting = true;
        this.uiManager.updateCastButtonState(); // Muestra estado conectando

        try {
            if (this.castManager.isConnected()) {
                await this.castManager.stopCasting();
                this.uiManager.showNotification('👋 Desconectado de Cast');
            } else {
                const connected = await this.castManager.startCasting();
                if (connected) {
                    const deviceName = this.castManager.getDeviceName();
                    this.uiManager.showNotification(`✅ Conectado a ${deviceName}`);
                } else {
                    this.uiManager.showNotification('ℹ️ No se seleccionó ningún dispositivo Cast');
                }
            }
        } catch (error) {
            console.error('Error conectando a Cast:', error);
            this.uiManager.showNotification('❌ Error al conectar con Google Cast');
        } finally {
            this.isConnecting = false;
            this.uiManager.updateCastButtonState();
        }
    }

    private handleClose(): void {
                if ((navigator as any).app && (navigator as any).app.exitApp) {
            (navigator as any).app.exitApp();
        } else {
            window.close();
            this.uiManager.showNotification('Para cerrar, usa el gestor de apps de tu dispositivo.');
        }
    }

    private setupGlobalEventListeners(): void {
        document.addEventListener('gesturestart', (e: Event) => e.preventDefault());

        window.addEventListener('orientationchange', () => {
            setTimeout(() => window.scrollTo(0, 0), 100);
        });
    }
}

new VoiceCommunicatorApp();
