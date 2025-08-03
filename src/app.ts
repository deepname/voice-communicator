import './styles.scss';
import { CastManager } from './cast-manager';

// Interfaces y tipos
interface SoundFile {
    name: string;
    filename: string;
    color: string;
}

interface AudioObjects {
    [key: string]: HTMLAudioElement;
}

// Configuración de sonidos
const soundFiles: SoundFile[] = [
    { name: 'Cris', filename: 'Cris.mp3', color: '#FF6B6B' },
    { name: 'Ivan', filename: 'Ivan.mp3', color: '#4ECDC4' },
    { name: 'Josefina', filename: 'Josefina.mp3', color: '#45B7D1' },
    { name: 'Mimi', filename: 'Mimi.mp3', color: '#96CEB4' },
    { name: 'Rita', filename: 'Rita.mp3', color: '#FFEAA7' },
    { name: 'Valentina', filename: 'Valentina.mp3', color: '#DDA0DD' }
];

// Variables globales
let audioObjects: AudioObjects = {};
let isConnecting: boolean = false;
let deferredPrompt: any;
let isPlayingAudio: boolean = false;
let currentPlayingSound: string | null = null;

// Clase principal de la aplicación
class VoiceCommunicatorApp {
    private castManager: CastManager;
    
    constructor() {
        this.castManager = new CastManager();
        // Configurar callback para actualizar estado del botón cuando cambie Cast
        this.castManager.onStateChange(() => {
            // Dar tiempo para que el estado se actualice completamente
            setTimeout(() => this.updateCastButtonState(), 500);
        });
        this.init();
    }

    private init(): void {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeApp();
            this.setupEventListeners();
            this.setupPWA();
        });
    }

    private initializeApp(): void {
        this.preloadAudio();
        this.createSoundButtons();
        this.updateCastButtonState();
    }

    private updateCastButtonState(): void {
        const button = document.getElementById('googleBtn') as HTMLButtonElement;
        if (!button) return;

        // Verificar si hay dispositivos disponibles
        const devicesAvailable = this.castManager.areDevicesAvailable();
        
        if (devicesAvailable) {
            button.classList.remove('no-devices');
            button.disabled = false;
            button.title = 'Conectar a Google Cast';
        } else {
            button.classList.add('no-devices');
            button.disabled = true; // Deshabilitar completamente el botón
            button.title = 'No hay dispositivos Google Cast disponibles';
        }
        
        console.log('🔍 Estado botón Cast actualizado:', {
            devicesAvailable,
            disabled: button.disabled,
            classes: button.className
        });
    }

    private preloadAudio(): void {
        soundFiles.forEach((sound: SoundFile) => {
            const audio = new Audio();
            audio.preload = 'metadata';
            
            const audioSrc = `sound/${sound.filename}`;
            audio.src = audioSrc;
            
            audio.crossOrigin = 'anonymous';
            audio.load();
            
            audioObjects[sound.name] = audio;
            
            // Event listeners
            audio.addEventListener('error', (e: Event) => {
                console.error(`Error cargando audio: ${sound.filename}`, e);
                setTimeout(() => {
                    audio.load();
                }, 1000);
            });
            
            audio.addEventListener('canplaythrough', () => {
                console.log(`Audio listo: ${sound.filename}`);
            });
            
            audio.addEventListener('play', () => {
                isPlayingAudio = true;
                currentPlayingSound = sound.name;
                this.disableOtherButtons(sound.name);
            });
            
            audio.addEventListener('ended', () => {
                const button = document.querySelector(`[data-sound="${sound.name}"]`) as HTMLButtonElement;
                if (button) {
                    button.classList.remove('playing');
                }
                isPlayingAudio = false;
                currentPlayingSound = null;
                this.enableAllButtons();
            });
            
            audio.addEventListener('pause', () => {
                if (audio.currentTime === 0) {
                    isPlayingAudio = false;
                    currentPlayingSound = null;
                    this.enableAllButtons();
                }
            });
        });
    }

    private createSoundButtons(): void {
        const soundGrid = document.getElementById('soundGrid') as HTMLElement;
        
        soundFiles.forEach((sound: SoundFile) => {
            const button = document.createElement('button');
            button.className = 'sound-button';
            button.style.backgroundColor = sound.color;
            button.setAttribute('data-sound', sound.name);
            
            const span = document.createElement('span');
            span.className = 'sound-name';
            span.textContent = sound.name;
            
            button.appendChild(span);
            
            button.addEventListener('click', () => {
                this.enableAudioContext();
                this.playSound(sound.name);
            });
            
            soundGrid.appendChild(button);
        });
    }

    private async playSound(soundName: string): Promise<void> {
        if (isPlayingAudio) {
            console.log('Ya se está reproduciendo un sonido');
            return;
        }

        const audio = audioObjects[soundName];
        if (!audio) {
            console.error(`Audio no encontrado: ${soundName}`);
            return;
        }

        const button = document.querySelector(`[data-sound="${soundName}"]`) as HTMLButtonElement;
        if (!button) return;

        button.classList.add('playing');
        
        // Si hay conexión Cast, reproducir en el dispositivo Cast
        if (this.castManager.isConnected()) {
            try {
                const soundFile = soundFiles.find(s => s.name === soundName);
                if (soundFile) {
                    const audioUrl = this.castManager.getFullAudioUrl(soundFile.filename);
                    const success = await this.castManager.playAudioOnCast(audioUrl, soundName);
                    
                    if (success) {
                        console.log(`Reproduciendo en Cast: ${soundName}`);
                        // Simular duración para el bloqueo de botones
                        setTimeout(() => {
                            button.classList.remove('playing');
                            isPlayingAudio = false;
                            currentPlayingSound = null;
                            this.enableAllButtons();
                        }, 3000); // Duración estimada
                        return;
                    }
                }
            } catch (error) {
                console.error('Error reproduciendo en Cast:', error);
                this.showNotification('Error al reproducir en Google Cast');
            }
        }
        
        // Reproducción local (fallback o cuando no hay Cast)
        audio.currentTime = 0;
        
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log(`Reproduciendo localmente: ${soundName}`);
                })
                .catch((error: Error) => {
                    console.error('Error al reproducir:', error);
                    button.classList.remove('playing');
                    isPlayingAudio = false;
                    currentPlayingSound = null;
                    this.enableAllButtons();
                    
                    this.showNotification('Error al reproducir el sonido. Toca la pantalla primero.');
                });
        }
    }

    private setupEventListeners(): void {
        const closeBtn = document.getElementById('closeBtn') as HTMLButtonElement;
        const googleBtn = document.getElementById('googleBtn') as HTMLButtonElement;
        
        closeBtn?.addEventListener('click', () => this.handleClose());
        googleBtn?.addEventListener('click', () => this.handleGoogleConnect());
        
        // Habilitar contexto de audio en primera interacción
        document.addEventListener('click', () => this.enableAudioContext(), { once: true });
    }

    private enableAudioContext(): void {
        // Crear y reproducir un audio silencioso para habilitar el contexto
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=');
        silentAudio.play().catch(() => {});
    }

    private disableOtherButtons(currentSoundName: string): void {
        const allButtons = document.querySelectorAll('.sound-button') as NodeListOf<HTMLButtonElement>;
        allButtons.forEach((button: HTMLButtonElement) => {
            if (button.getAttribute('data-sound') !== currentSoundName) {
                button.classList.add('disabled');
            }
        });
    }

    private enableAllButtons(): void {
        const allButtons = document.querySelectorAll('.sound-button') as NodeListOf<HTMLButtonElement>;
        allButtons.forEach((button: HTMLButtonElement) => {
            button.classList.remove('disabled');
        });
    }

    private handleClose(): void {
        if (confirm('¿Estás seguro de que quieres cerrar la aplicación?')) {
            const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
            if (isStandalone) {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.ready.then(() => {
                        window.close();
                    });
                }
            } else {
                window.close();
            }
        }
    }

    private async handleGoogleConnect(): Promise<void> {
        if (isConnecting) return;
        
        const button = document.getElementById('googleBtn') as HTMLButtonElement;
        
        // Si el botón está deshabilitado, no hacer nada
        if (button && button.disabled) {
            console.log('🚫 Botón Google Cast deshabilitado - no hay dispositivos disponibles');
            return;
        }
        
        // Si ya está conectado, desconectar
        if (this.castManager.isConnected()) {
            this.castManager.stopCasting();
            button.textContent = '📡';
            button.classList.remove('connected');
            this.showNotification('Desconectado de Google Cast');
            return;
        }
        
        isConnecting = true;
        button.classList.add('connecting');
        button.textContent = '🔄';
        
        try {
            // Verificar si hay dispositivos disponibles antes de intentar conectar
            const devicesAvailable = this.castManager.areDevicesAvailable();
            console.log('🔍 Dispositivos Cast disponibles:', devicesAvailable);
            
            if (!devicesAvailable) {
                button.textContent = '📡';
                this.showNotification('⚠️ No se encontraron dispositivos Google Cast en la red');
                this.showNotification('📶 Verifica que tu Google Mini/Hub esté encendido y en la misma WiFi');
                // Actualizar estado visual del botón
                this.updateCastButtonState();
                return;
            }
            
            const connected = await this.castManager.startCasting();
            
            if (connected) {
                button.textContent = '📡';
                button.classList.add('connected');
                const deviceName = this.castManager.getDeviceName();
                this.showNotification(`✅ Conectado a ${deviceName}`);
            } else {
                button.textContent = '📡';
                // Verificar si es problema de entorno o usuario canceló
                if (window.location.protocol !== 'https:' && 
                    window.location.hostname !== 'localhost' && 
                    window.location.hostname !== '127.0.0.1') {
                    this.showNotification('⚠️ Google Cast requiere HTTPS para funcionar');
                } else if (!window.cast || !window.cast.framework) {
                    this.showNotification('⚠️ Google Cast SDK no disponible');
                } else {
                    this.showNotification('ℹ️ No se seleccionó ningún dispositivo Cast');
                }
            }
        } catch (error) {
            console.error('Error conectando a Cast:', error);
            button.textContent = '📡';
            this.showNotification('❌ Error al conectar con Google Cast');
        } finally {
            isConnecting = false;
            button.classList.remove('connecting');
        }
    }

    private showNotification(message: string): void {
        const notification = document.createElement('div');
        notification.className = 'install-prompt';
        notification.textContent = message;
        notification.style.bottom = '20px';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    private setupPWA(): void {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then((registration: ServiceWorkerRegistration) => {
                        console.log('SW registrado:', registration);
                    })
                    .catch((registrationError: Error) => {
                        console.log('SW falló:', registrationError);
                    });
            });
        }
        
        window.addEventListener('beforeinstallprompt', (e: Event) => {
            e.preventDefault();
            deferredPrompt = e;
            this.showInstallPrompt();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('PWA instalada');
            deferredPrompt = null;
        });
    }

    private showInstallPrompt(): void {
        const installPrompt = document.createElement('div');
        installPrompt.className = 'install-prompt';
        installPrompt.textContent = '📱 Instalar aplicación';
        
        installPrompt.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Resultado de instalación: ${outcome}`);
                deferredPrompt = null;
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

// Prevenir zoom en dispositivos móviles
document.addEventListener('gesturestart', (e: Event) => {
    e.preventDefault();
});

// Manejar orientación de pantalla
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Inicializar la aplicación
new VoiceCommunicatorApp();
