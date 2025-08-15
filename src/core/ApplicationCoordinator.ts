import '../styles/main.scss';

// Dominios
import { UIComponents, UIEventHandlers } from '../ui';
import { ApplicationLogic } from './ApplicationLogic';
import { AudioService, AudioServiceEvents } from '../audio';
import { CastService, CastServiceEvents } from '../cast';
import { PWAService, PWAServiceEvents } from '../pwa';
import { DataRepository, DataAdapters, AppData, CastData, SoundData } from '../data/DataModels';

// Configuración
import { soundFiles } from '../config';

export class ApplicationCoordinator {
    // Capas de la aplicación
    private uiComponents: UIComponents;
    private applicationLogic: ApplicationLogic;
    private audioService!: AudioService;
    private castService!: CastService;
    private pwaService!: PWAService;
    private dataRepository: DataRepository;

    // Estado de instalación PWA
    private deferredPrompt: any = null;

    constructor() {
        this.dataRepository = new DataRepository();
        this.applicationLogic = new ApplicationLogic();
        this.uiComponents = new UIComponents();
        
        this.initializeLayerServices();
        this.setupEventHandlers();
        this.initializeApplication();
    }

    private initializeLayerServices(): void {
        // Configurar eventos del servicio de audio
        const audioEvents: AudioServiceEvents = {
            onSoundStarted: (soundName: string) => this.handleAudioPlay(soundName),
            onSoundEnded: (soundName: string) => this.handleAudioEnded(soundName),
            onSoundError: (soundName: string, error: any) => this.handleAudioError(soundName, error)
        };
        this.audioService = new AudioService(audioEvents);

        // Configurar eventos del servicio de Cast
        const castEvents: CastServiceEvents = {
            onStateChange: (isConnected: boolean, deviceName?: string) => this.handleCastStateChange(isConnected, deviceName),
            onDevicesAvailable: (available: boolean) => this.handleCastDevicesAvailable(available),
            onError: (error: any) => this.handleCastError(error)
        };
        this.castService = new CastService(castEvents);

        // Configurar eventos del servicio PWA
        const pwaEvents: PWAServiceEvents = {
            onInstallPrompt: (deferredPrompt: any) => this.handleInstallPrompt(deferredPrompt),
            onInstallSuccess: () => this.handleInstallSuccess(),
            onInstallError: (error: any) => this.handleInstallError(error)
        };
        this.pwaService = new PWAService(pwaEvents);
    }

    private setupEventHandlers(): void {
        // Configurar eventos de la UI
        const uiHandlers: UIEventHandlers = {
            onSoundClick: (soundName: string) => this.handleSoundClick(soundName),
            onCastClick: () => this.handleCastClick(),
            onCloseClick: () => this.handleCloseClick()
        };
        this.uiComponents.setEventHandlers(uiHandlers);

        // Suscribirse a cambios de estado de la lógica de negocio
        this.applicationLogic.onStateChange((state) => {
            this.updateUI(state);
        });
    }

    private async initializeApplication(): Promise<void> {
        // Verificar si el DOM ya está cargado o esperar a que se cargue
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startApplication());
        } else {
            // El DOM ya está cargado, inicializar inmediatamente
            this.startApplication();
        }
    }

    private async startApplication(): Promise<void> {
        try {
            // Cargar datos persistidos
            this.loadPersistedData();

            // Inicializar UI
            this.uiComponents.renderSoundButtons(soundFiles);
            this.uiComponents.attachControlEvents();

            // Inicializar servicios
            await this.initializeAppServices();

            // Configurar eventos globales
            this.setupGlobalEventListeners();

            // Marcar como inicializado
            this.applicationLogic.setInitialized(true);
            this.saveAppData();

            console.log('✅ Aplicación inicializada correctamente con arquitectura por capas');

        } catch (error) {
            console.error('Error durante la inicialización:', error);
            this.uiComponents.showNotification('Error en la inicialización de la aplicación');
        }
    }

    private async initializeAppServices(): Promise<void> {
        // Inicializar PWA
        this.pwaService.setupPWA();

        // Intentar inicializar Cast (no bloquear si falla)
        try {
            await this.castService.initialize();
        } catch (error) {
            console.warn('Cast no disponible, continuando sin Cast');
        }
    }

    // Manejadores de eventos de audio
    private handleAudioPlay(soundName: string): void {
        this.applicationLogic.setPlayingAudio(true, soundName);
        this.updateSoundPlayTime(soundName);
    }

    private handleAudioEnded(soundName: string): void {
        this.applicationLogic.setPlayingAudio(false);
    }

    private handleAudioError(soundName: string, error: any): void {
        this.uiComponents.showNotification(
            this.applicationLogic.getPlayErrorMessage(soundName)
        );
    }

    // Manejadores de eventos de Cast
    private handleCastStateChange(isConnected: boolean, deviceName?: string): void {
        const castData: CastData = {
            isConnected,
            deviceName: deviceName || null,
            sessionId: null, // Se podría obtener del CastManager si es necesario
            devicesAvailable: this.castService.areDevicesAvailable(),
            lastConnectionTime: isConnected ? new Date() : undefined
        };
        this.dataRepository.saveCastData(castData);

        // Actualizar UI
        this.uiComponents.updateCastButton(
            isConnected,
            this.applicationLogic.isConnecting(),
            deviceName,
            this.castService.areDevicesAvailable()
        );
    }

    private handleCastDevicesAvailable(available: boolean): void {
        this.uiComponents.updateCastButton(
            this.castService.isConnected(),
            this.applicationLogic.isConnecting(),
            this.castService.getDeviceName() || undefined,
            available
        );
    }

    private handleCastError(error: any): void {
        this.uiComponents.showNotification(
            this.applicationLogic.getCastErrorMessage()
        );
    }

    // Manejadores de eventos PWA
    private handleInstallPrompt(deferredPrompt: any): void {
        this.deferredPrompt = deferredPrompt;
        this.uiComponents.showInstallPrompt(deferredPrompt);
    }

    private handleInstallSuccess(): void {
        this.uiComponents.showNotification('✅ Aplicación instalada correctamente');
    }

    private handleInstallError(error: any): void {
        this.uiComponents.showNotification('❌ Error al instalar la aplicación');
    }

    // Manejadores de eventos de UI
    private async handleSoundClick(soundName: string): Promise<void> {
        const validation = this.applicationLogic.validateSoundOperation(soundName, soundFiles);
        if (!validation.isValid) {
            this.uiComponents.showNotification(validation.errorMessage!);
            return;
        }

        // Si el mismo sonido está reproduciéndose, detenerlo
        if (this.applicationLogic.shouldStopCurrentSound(soundName)) {
            this.audioService.stopSound(soundName);
            return;
        }

        // Detener cualquier sonido que esté reproduciéndose
        this.audioService.stopAll();

        // Reproducir el nuevo sonido
        await this.playSound(soundName);
    }

    private async handleCastClick(): Promise<void> {
        if (!this.applicationLogic.validateCastOperation(
            this.castService.isConnected(),
            this.applicationLogic.isConnecting()
        )) {
            return;
        }

        this.applicationLogic.setConnecting(true);

        try {
            if (this.castService.isConnected()) {
                await this.castService.stopCasting();
                this.uiComponents.showNotification(
                    this.applicationLogic.getDisconnectionMessage()
                );
            } else {
                const connected = await this.castService.startCasting();
                if (connected) {
                    const deviceName = this.castService.getDeviceName();
                    this.uiComponents.showNotification(
                        this.applicationLogic.getConnectionSuccessMessage(deviceName || 'dispositivo')
                    );
                } else {
                    this.uiComponents.showNotification(
                        this.applicationLogic.getNoDeviceSelectedMessage()
                    );
                }
            }
        } catch (error) {
            console.error('Error en operación de Cast:', error);
            this.uiComponents.showNotification(
                this.applicationLogic.getCastErrorMessage()
            );
        } finally {
            this.applicationLogic.setConnecting(false);
        }
    }

    private handleCloseClick(): void {
        if ((navigator as any).app && (navigator as any).app.exitApp) {
            (navigator as any).app.exitApp();
        } else {
            window.close();
            this.uiComponents.showNotification(
                this.applicationLogic.getCloseAppMessage()
            );
        }
    }

    // Lógica de reproducción
    private async playSound(soundName: string): Promise<void> {
        const soundFile = soundFiles.find(s => s.name === soundName);
        if (!soundFile) return;

        if (this.castService.isConnected()) {
            await this.playSoundOnCast(soundName, soundFile);
        } else {
            await this.playSoundLocally(soundName, soundFile);
        }
    }

    private async playSoundOnCast(soundName: string, soundFile: any): Promise<void> {
        try {
            // Asegurar que el elemento de audio existe
            let audio = this.audioService.getAudioElement(soundName);
            if (!audio) {
                audio = this.audioService.createAudioElement(soundFile);
            }

            const fullUrl = this.castService.getFullAudioUrl(audio.src);
            const success = await this.castService.playAudioOnCast(fullUrl, soundName);
            
            if (success) {
                this.applicationLogic.setPlayingAudio(true, soundName);
                // Inicializar AudioService con eventos
                this.audioService = new AudioService({
                    onSoundStarted: (soundName: string) => {
                        console.log(`Reproduciendo: ${soundName}`);
                        this.uiComponents.updateSoundButton(soundName, 'playing');
                    },
                    onSoundEnded: (soundName: string) => {
                        console.log(`Terminó: ${soundName}`);
                        this.uiComponents.updateSoundButton(soundName, 'stopped');
                    },
                    onSoundError: (soundName: string, error: Error) => {
                        console.error(`Error en audio: ${soundName}`, error);
                        this.uiComponents.updateSoundButton(soundName, 'error');
                    }
                });
                // Simular finalización después de 5 segundos (tiempo estimado)
                setTimeout(() => {
                    this.applicationLogic.setPlayingAudio(false);
                }, 5000);
            } else {
                this.uiComponents.showNotification('❌ Error al reproducir en Cast');
            }
        } catch (error) {
            console.error('Error al castear audio:', error);
            this.uiComponents.showNotification('❌ Error al enviar audio a Cast');
        }
    }

    private async playSoundLocally(soundName: string, soundFile: any): Promise<void> {
        try {
            await this.audioService.playSound(soundName, soundFile);
        } catch (error) {
            // El error ya se maneja en handleAudioError
        }
    }

    // Actualización de UI basada en el estado
    private updateUI(state: any): void {
        const disabledButtons = this.applicationLogic.getDisabledButtons();
        const activeButton = this.applicationLogic.getActiveButton();
        
        this.uiComponents.updateSoundButtonStates(disabledButtons, activeButton);
        
        this.uiComponents.updateCastButton(
            this.castService.isConnected(),
            state.isConnecting,
            this.castService.getDeviceName() || undefined,
            this.castService.areDevicesAvailable()
        );
    }

    // Persistencia de datos
    private loadPersistedData(): void {
        const appData = this.dataRepository.loadAppData();
        if (!appData) {
            // Primera vez que se ejecuta la app
            const newAppData = DataAdapters.createAppData();
            this.dataRepository.saveAppData(newAppData);
        }
    }

    private saveAppData(): void {
        const appData: AppData = {
            isInitialized: this.applicationLogic.isInitialized(),
            version: '1.0.0',
            lastStartTime: new Date(),
            settings: this.dataRepository.loadSettings()
        };
        this.dataRepository.saveAppData(appData);
    }

    private updateSoundPlayTime(soundName: string): void {
        let soundsData = this.dataRepository.loadSoundData();
        
        // Ensure soundsData is an array
        if (!soundsData || !Array.isArray(soundsData)) {
            soundsData = [];
        }
        
        const soundIndex = soundsData.findIndex((s: any) => s.name === soundName);
        
        if (soundIndex >= 0) {
            soundsData[soundIndex].lastPlayed = new Date();
        } else {
            const soundFile = soundFiles.find(s => s.name === soundName);
            if (soundFile) {
                // Crear SoundData usando el adaptador
                const soundData = DataAdapters.soundFileToSoundData(soundFile);
                soundData.lastPlayed = new Date();
                soundData.isLoaded = true;
                soundsData.push(soundData);
            }
        }
        
        this.dataRepository.saveSoundData(soundsData);
    }

    // Eventos globales
    private setupGlobalEventListeners(): void {
        document.addEventListener('gesturestart', (e: Event) => e.preventDefault());

        window.addEventListener('orientationchange', () => {
            setTimeout(() => window.scrollTo(0, 0), 100);
        });
    }

    // Métodos públicos para acceso externo
    public getDataRepository(): DataRepository {
        return this.dataRepository;
    }

    public getApplicationLogic(): ApplicationLogic {
        return this.applicationLogic;
    }

    public getCastService(): CastService {
        return this.castService;
    }

    public getAudioService(): AudioService {
        return this.audioService;
    }

    public getUIComponents(): UIComponents {
        return this.uiComponents;
    }

    public getPWAService(): PWAService {
        return this.pwaService;
    }
}
