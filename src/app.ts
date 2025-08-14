// Archivo de compatibilidad - Redirige a la nueva arquitectura por dominio
import { ApplicationCoordinator } from './core';

// Mantener la clase original para compatibilidad hacia atrás
export class VoiceCommunicatorApp {
    private coordinator: ApplicationCoordinator;

    constructor() {
        console.warn('VoiceCommunicatorApp está deprecated. Use ApplicationCoordinator directamente.');
        this.coordinator = new ApplicationCoordinator();
    }

    // Métodos de compatibilidad que redirigen a la nueva arquitectura
    public async playSound(soundName: string): Promise<void> {
        // El coordinator maneja esto internamente a través de los eventos de UI
        console.warn('playSound está deprecated. Use la interfaz de usuario para reproducir sonidos.');
    }

    public handleClose(): void {
        // El coordinator maneja esto internamente
        console.warn('handleClose está deprecated. Use el botón de cerrar en la interfaz.');
    }

    // Getters para acceso a la nueva arquitectura
    public getCoordinator(): ApplicationCoordinator {
        return this.coordinator;
    }

    // Métodos legacy para mantener compatibilidad
    public get castManager() {
        return this.coordinator.getCastService().getCastManager();
    }

    public get isConnecting() {
        return this.coordinator.getApplicationLogic().isConnecting();
    }

    public get isPlayingAudio() {
        return this.coordinator.getApplicationLogic().isPlayingAudio();
    }
}

// Inicialización segura con Google Cast API - Ahora usa Arquitectura por Capas
(window as any).__onGCastApiAvailable = function(isAvailable: boolean) {
    console.log('Google Cast API disponible:', isAvailable);
    if (isAvailable) {
        // Solo inicializar Cast cuando la API esté lista
        const coordinator = new ApplicationCoordinator();
        coordinator.getCastService().initialize().catch((error) => {
            console.warn('Error inicializando Cast API:', error);
            // La app continúa funcionando sin Cast
        });
    }
};

// Inicializar la aplicación inmediatamente, sin esperar a Google Cast
// Esto asegura que los botones aparezcan incluso si Cast no está disponible
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Voice Communicator con Arquitectura por Capas');
    new ApplicationCoordinator();
});

// Fallback: Si DOMContentLoaded ya pasó, inicializar inmediatamente
if (document.readyState === 'loading') {
    // DOMContentLoaded se ejecutará
} else {
    // DOM ya está listo
    console.log('🚀 Inicializando Voice Communicator (DOM ya listo)');
    new ApplicationCoordinator();
}
