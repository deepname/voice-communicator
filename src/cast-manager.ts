import { CastState, CastSession, CastContext, MediaInfo, LoadRequest } from './cast-types';

export class CastManager {
  private castContext: CastContext | null = null;
  private currentSession: CastSession | null = null;
  private isInitialized: boolean = false;
  private onStateChangeCallback: ((state: CastState) => void) | null = null;

  constructor() {
    // Esperar a que el DOM esté listo antes de inicializar Cast
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeCast());
    } else {
      this.initializeCast();
    }
  }

  /**
   * Verifica si el Google Cast SDK está completamente disponible
   */
  private isCastSDKReady(): boolean {
    try {
      return !!(window.cast && 
               window.cast.framework && 
               window.cast.framework.CastContext && 
               window.cast.framework.AutoJoinPolicy && 
               window.cast.framework.AutoJoinPolicy.ORIGIN_SCOPED &&
               window.cast.framework.CastState);
    } catch (error) {
      console.warn('⚠️ Error verificando Google Cast SDK:', error);
      return false;
    }
  }

  /**
   * Inicializa el SDK de Google Cast
   */
  private async initializeCast(): Promise<void> {
    return new Promise((resolve) => {
      // Verificar si estamos en HTTPS o localhost (requerido para Cast)
      const isSecureContext = window.location.protocol === 'https:' || 
                             window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';
      
      if (!isSecureContext) {
        console.warn('⚠️ Google Cast requiere HTTPS o localhost');
        this.isInitialized = false;
        resolve();
        return;
      }

      // Verificar si el SDK ya está disponible completamente
      if (this.isCastSDKReady()) {
        console.log('✅ Google Cast SDK ya disponible');
        this.setupCastContext();
        this.isInitialized = true;
        resolve();
        return;
      }

      // Configurar callback global para cuando el SDK se cargue
      window.__onGCastApiAvailable = (isAvailable: boolean) => {
        console.log(`🔄 Google Cast SDK disponible: ${isAvailable}`);
        
        if (isAvailable && this.isCastSDKReady()) {
          try {
            this.setupCastContext();
            this.isInitialized = true;
            console.log('✅ Google Cast SDK inicializado correctamente');
          } catch (error) {
            console.error('❌ Error inicializando Google Cast:', error);
            this.isInitialized = false;
          }
        } else {
          console.warn('⚠️ Google Cast SDK no disponible o incompleto');
          this.isInitialized = false;
        }
        resolve();
      };

      // Timeout de seguridad
      setTimeout(() => {
        if (!this.isInitialized) {
          console.warn('⏰ Timeout inicializando Google Cast SDK');
          this.isInitialized = false;
          resolve();
        }
      }, 5000);
    });
  }

  /**
   * Configura el contexto de Cast
   */
  private setupCastContext(): void {
    const castContext = window.cast.framework.CastContext.getInstance();
    
    // Configuración mejorada para detección de dispositivos
    const autoJoinPolicy = window.cast?.framework?.AutoJoinPolicy?.ORIGIN_SCOPED || 'origin_scoped';
    
    castContext.setOptions({
      receiverApplicationId: 'CC1AD845', // Default Media Receiver oficial de Google
      autoJoinPolicy: autoJoinPolicy,
      language: 'es-ES',
      resumeSavedSession: false, // Cambiar a false para forzar nueva detección
      androidReceiverCompatible: true // Compatibilidad con Android TV
    });

    console.log('🔧 Configuración Cast aplicada:', {
      receiverApplicationId: 'CC1AD845',
      autoJoinPolicy: 'ORIGIN_SCOPED',
      language: 'es-ES'
    });

    // Escuchar cambios de estado
    castContext.addEventListener(
      window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      (event: any) => {
        const castState = event.castState;
        console.log('🔄 Estado Cast cambiado:', castState);
        
        // Log detallado de estados
        const CastState = window.cast?.framework?.CastState;
        if (CastState) {
          switch (castState) {
            case CastState.NO_DEVICES_AVAILABLE:
              console.warn('⚠️ No hay dispositivos Cast disponibles');
              break;
            case CastState.NOT_CONNECTED:
              console.log('📱 Cast no conectado');
              break;
            case CastState.CONNECTING:
              console.log('🔄 Conectando a Cast...');
              break;
            case CastState.CONNECTED:
              console.log('✅ Cast conectado exitosamente');
              break;
          }
        }
        
        if (this.onStateChangeCallback) {
          this.onStateChangeCallback(castState);
        }
      }
    );

    // Escuchar cambios de sesión
    castContext.addEventListener(
      window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      (event: any) => {
        const sessionState = event.sessionState;
        console.log('🔄 Sesión Cast cambiada:', sessionState);
        this.currentSession = castContext.getCurrentSession();
        
        if (this.currentSession) {
          const castDevice = (this.currentSession as any).getCastDevice?.() || null;
          console.log('📡 Sesión activa:', {
            sessionId: this.currentSession.getSessionId(),
            deviceName: castDevice?.friendlyName || 'Dispositivo desconocido'
          });
        }
      }
    );

    this.castContext = castContext;
    
    // Verificar estado inicial
    const initialState = castContext.getCastState();
    console.log('🔍 Estado inicial de Cast:', initialState);
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
    
    const CastState = window.cast?.framework?.CastState;
    const available = CastState ? castState !== CastState.NO_DEVICES_AVAILABLE : false;
    
    console.log('🔍 Verificando dispositivos Cast:', {
      castState,
      available,
      stateDescription: this.getCastStateDescription(castState)
    });
    
    return available;
  }

  /**
   * Obtiene descripción legible del estado de Cast
   */
  private getCastStateDescription(state: any): string {
    const CastState = window.cast?.framework?.CastState;
    if (!CastState) {
      return 'SDK no disponible';
    }
    
    switch (state) {
      case CastState.NO_DEVICES_AVAILABLE:
        return 'No hay dispositivos disponibles';
      case CastState.NOT_CONNECTED:
        return 'No conectado';
      case CastState.CONNECTING:
        return 'Conectando';
      case CastState.CONNECTED:
        return 'Conectado';
      default:
        return 'Estado desconocido';
    }
  }

  /**
   * Inicia una sesión de Cast
   */
  public async startCasting(): Promise<boolean> {
    // Verificar si Cast está disponible en el entorno
    if (!window.cast || !window.cast.framework) {
      console.error('❌ Google Cast SDK no está cargado');
      return false;
    }

    if (!this.isInitialized || !this.castContext) {
      console.warn('⚠️ Cast no inicializado, intentando reinicializar...');
      
      // Intentar reinicializar
      try {
        await this.initializeCast();
        if (!this.isInitialized || !this.castContext) {
          console.error('❌ No se pudo inicializar Google Cast');
          return false;
        }
      } catch (error) {
        console.error('❌ Error reinicializando Cast:', error);
        return false;
      }
    }

    try {
      console.log('🔄 Solicitando sesión de Cast...');
      await this.castContext.requestSession();
      this.currentSession = this.castContext.getCurrentSession();
      
      if (this.currentSession) {
        console.log('✅ Sesión Cast iniciada:', this.currentSession.getSessionId());
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
      this.castContext.endCurrentSession(true);
      this.currentSession = null;
      console.log('🛑 Sesión Cast detenida');
    }
  }

  /**
   * Reproduce un archivo de audio en el dispositivo Cast
   */
  public async playAudioOnCast(audioUrl: string, title: string): Promise<boolean> {
    if (!this.currentSession) {
      console.error('❌ No hay sesión Cast activa');
      return false;
    }

    try {
      const mediaInfo: MediaInfo = {
        contentId: audioUrl,
        contentType: 'audio/mpeg',
        streamType: 'BUFFERED',
        metadata: {
          type: 0,
          metadataType: 0,
          title: title,
          subtitle: 'Voice Communicator',
          images: [{
            url: 'https://via.placeholder.com/512x512/4CAF50/white?text=🎵',
            height: 512,
            width: 512
          }]
        }
      };

      const request: LoadRequest = {
        media: mediaInfo,
        autoplay: true,
        currentTime: 0
      };

      const remotePlayer = new window.cast.framework.RemotePlayer();
      const remotePlayerController = new window.cast.framework.RemotePlayerController(remotePlayer);
      
      await (this.currentSession as any).loadMedia(request);
      console.log(`✅ Reproduciendo "${title}" en Cast`);
      return true;
    } catch (error) {
      console.error('❌ Error al reproducir en Cast:', error);
      return false;
    }
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
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}sound/${filename}`;
  }
}
