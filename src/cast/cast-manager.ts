import { CastState, CastSession, CastContext } from './cast-types';
import { getCastStateDescription, getFullAudioUrl } from './cast-utils';
import { CastInitializer } from './cast-initializer';
import { CastPlayer } from './cast-player';

export class CastManager {
  private castContext: CastContext | null = null;
  private currentSession: CastSession | null = null;
  private isInitialized: boolean = false;
  private onStateChangeCallback: ((state: CastState) => void) | null = null;
  private player: CastPlayer;

  constructor() {
    this.player = new CastPlayer();
  }

  /**
   * Inicializa el CastManager usando el CastInitializer
   */
  public async initialize(): Promise<void> {
    const initializer = new CastInitializer();
    this.castContext = await initializer.initialize();

    if (this.castContext) {
      this.isInitialized = true;
      this.addEventListeners();
      console.log('✅ CastManager inicializado y listo.');
    } else {
      this.isInitialized = false;
      console.error('❌ Falló la inicialización de CastManager.');
    }
  }

  /**
   * Añade los listeners para los eventos de Cast
   */
  private addEventListeners(): void {
    if (!this.castContext) return;

    // Cast state changes
    (this.castContext as any).addEventListener(
      window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      (event: any) => {
        const castState = event.castState;
        console.log(`🔔 Estado de Cast actualizado: ${getCastStateDescription(castState)}`, `(${castState})`);
        
        this.currentSession = (this.castContext as any)?.getCurrentSession() ?? null;

        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(this.getCastState());
        }
      }
    );

    // Session state changes
    (this.castContext as any).addEventListener(
      window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (event: any) => {
        console.log('🔄 Sesión Cast cambiada:', event.sessionState);
        this.currentSession = (this.castContext as any).getCurrentSession();
        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(this.getCastState());
        }
      }
    );
  }

  /**
   * Obtiene el estado actual de Cast
   */
  public getCastState(): CastState {
    if (!this.isInitialized || !this.castContext) {
      return CastState.NO_DEVICES_AVAILABLE;
    }
    return (this.castContext as any).getCastState();
  }

  /**
   * Verifica si hay dispositivos Cast disponibles
   */
  public areDevicesAvailable(): boolean {
    if (!this.isInitialized || !this.castContext) {
      return false;
    }
    
    const castState = (this.castContext as any).getCastState?.();
    if (castState === undefined) {
      console.warn('⚠️ No se pudo obtener el estado de Cast');
      return false;
    }
    
    const CastStateEnum = window.cast?.framework?.CastState;
    const available = CastStateEnum ? castState !== CastStateEnum.NO_DEVICES_AVAILABLE : false;
    
    console.log('🔍 Verificando dispositivos Cast:', {
      castState,
      available,
      stateDescription: getCastStateDescription(castState)
    });
    
    return available;
  }

  /**
   * Inicia una sesión de Cast
   */
  public async startCasting(): Promise<boolean> {
    if (!window.cast || !window.cast.framework) {
      console.error('❌ Google Cast SDK no está cargado');
      return false;
    }

    if (!this.isInitialized || !this.castContext) {
      console.error('❌ Cast no está inicializado. Llama a `initialize()` primero.');
      return false;
    }

    try {
      console.log('🔄 Solicitando sesión de Cast...');
      await (this.castContext as any).requestSession();
      this.currentSession = (this.castContext as any).getCurrentSession();
      
      if (this.currentSession) {
        console.log('✅ Sesión Cast iniciada:', (this.currentSession as any).getSessionId());
        return true;
      } else {
        console.warn('⚠️ No se pudo obtener la sesión de Cast');
        return false;
      }
    } catch (error: any) {
      if (error.code === 'cancel') {
        console.log('ℹ️ Usuario canceló la selección de dispositivo Cast');
      } else {
        console.error('❌ Error al iniciar Cast:', error);
      }
      return false;
    }
  }

  /**
   * Detiene la sesión de Cast actual
   */
  public stopCasting(): void {
    if (this.castContext && this.currentSession) {
      (this.castContext as any).endCurrentSession(true);
      this.currentSession = null;
      console.log('🛑 Sesión Cast detenida');
    }
  }

  /**
   * Reproduce un archivo de audio en el dispositivo Cast
   */
  public async playAudioOnCast(audioUrl: string, title: string): Promise<boolean> {
    if (!this.currentSession) {
      console.error('❌ No hay sesión Cast activa para reproducir.');
      return false;
    }
    return this.player.playAudio(this.currentSession, audioUrl, title);
  }

  /**
   * Verifica si hay una sesión activa
   */
  public isConnected(): boolean {
    return this.currentSession !== null;
  }

  /**
   * Obtiene el nombre del dispositivo conectado
   */
  public getDeviceName(): string {
    if (this.currentSession) {
      return (this.currentSession as any).getReceiver()?.friendlyName || 'Dispositivo Cast';
    }
    return '';
  }

  /**
   * Registra callback para cambios de estado
   */
  public onStateChange(callback: (state: CastState) => void): void {
    this.onStateChangeCallback = callback;
  }

  /**
   * Obtiene la URL completa del archivo de audio
   */
  public getFullAudioUrl(filename: string): string {
    return getFullAudioUrl(filename);
  }
}
