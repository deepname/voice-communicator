import { SoundFile } from '../config';

export interface ApplicationState {
    isConnecting: boolean;
    isPlayingAudio: boolean;
    currentSound: string | null;
    isInitialized: boolean;
}

export class ApplicationLogic {
    private state: ApplicationState = {
        isConnecting: false,
        isPlayingAudio: false,
        currentSound: null,
        isInitialized: false
    };

    private stateChangeListeners: Array<(state: ApplicationState) => void> = [];

    // Observer pattern para notificar cambios de estado
    public onStateChange(listener: (state: ApplicationState) => void): void {
        this.stateChangeListeners.push(listener);
    }

    private notifyStateChange(): void {
        this.stateChangeListeners.forEach(listener => listener({ ...this.state }));
    }

    // Getters del estado
    public getState(): ApplicationState {
        return { ...this.state };
    }

    public isConnecting(): boolean {
        return this.state.isConnecting;
    }

    public isPlayingAudio(): boolean {
        return this.state.isPlayingAudio;
    }

    public getCurrentSound(): string | null {
        return this.state.currentSound;
    }

    public isInitialized(): boolean {
        return this.state.isInitialized;
    }

    // Lógica de negocio para reproducción de sonidos
    public canPlaySound(soundName: string): boolean {
        // No se puede reproducir si está conectando a Cast
        if (this.state.isConnecting) {
            return false;
        }

        // Si ya se está reproduciendo el mismo sonido, se puede "detener"
        if (this.state.isPlayingAudio && this.state.currentSound === soundName) {
            return true;
        }

        // Si se está reproduciendo otro sonido, no se puede reproducir uno nuevo
        if (this.state.isPlayingAudio && this.state.currentSound !== soundName) {
            return false;
        }

        return true;
    }

    public shouldStopCurrentSound(soundName: string): boolean {
        return this.state.isPlayingAudio && this.state.currentSound === soundName;
    }

    public validateSoundName(soundName: string, availableSounds: SoundFile[]): boolean {
        return availableSounds.some(sound => sound.name === soundName);
    }

    // Métodos para actualizar el estado
    public setConnecting(isConnecting: boolean): void {
        this.state.isConnecting = isConnecting;
        this.notifyStateChange();
    }

    public setPlayingAudio(isPlaying: boolean, soundName?: string): void {
        this.state.isPlayingAudio = isPlaying;
        this.state.currentSound = isPlaying ? (soundName || null) : null;
        this.notifyStateChange();
    }

    public setInitialized(initialized: boolean): void {
        this.state.isInitialized = initialized;
        this.notifyStateChange();
    }

    // Lógica de negocio para determinar qué botones deshabilitar
    public getDisabledButtons(): string[] {
        if (!this.state.isPlayingAudio) {
            return [];
        }

        // Si hay un sonido reproduciéndose, deshabilitar todos los demás
        return this.state.currentSound ? [] : [];
    }

    public getActiveButton(): string | undefined {
        return this.state.isPlayingAudio ? this.state.currentSound || undefined : undefined;
    }

    // Lógica de negocio para mensajes de notificación
    public getConnectionSuccessMessage(deviceName: string): string {
        return `✅ Conectado a ${deviceName}`;
    }

    public getDisconnectionMessage(): string {
        return '👋 Desconectado de Cast';
    }

    public getNoDeviceSelectedMessage(): string {
        return 'ℹ️ No se seleccionó ningún dispositivo Cast';
    }

    public getCastErrorMessage(): string {
        return '❌ Error al conectar con Google Cast';
    }

    public getPlayErrorMessage(soundName: string): string {
        return `❌ Error al reproducir ${soundName}`;
    }

    public getCloseAppMessage(): string {
        return 'Para cerrar, usa el gestor de apps de tu dispositivo.';
    }

    // Lógica de validación
    public validateCastOperation(isConnected: boolean, isConnecting: boolean): boolean {
        return !isConnecting; // Solo permitir operaciones si no está conectando
    }

    public validateSoundOperation(soundName: string, availableSounds: SoundFile[]): { 
        isValid: boolean; 
        errorMessage?: string; 
    } {
        if (!this.validateSoundName(soundName, availableSounds)) {
            return {
                isValid: false,
                errorMessage: `Sonido no válido: ${soundName}`
            };
        }

        if (!this.canPlaySound(soundName)) {
            return {
                isValid: false,
                errorMessage: 'No se puede reproducir el sonido en este momento'
            };
        }

        return { isValid: true };
    }

    // Reset del estado
    public reset(): void {
        this.state = {
            isConnecting: false,
            isPlayingAudio: false,
            currentSound: null,
            isInitialized: false
        };
        this.notifyStateChange();
    }
}
