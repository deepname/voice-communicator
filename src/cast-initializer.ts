import { CastContext } from './cast-types';

export class CastInitializer {
  private isInitialized = false;

  public async initialize(): Promise<CastContext | null> {
    if (this.isInitialized) {
      console.log('✅ Cast ya estaba inicializado.');
      return window.cast.framework.CastContext.getInstance();
    }

    return new Promise((resolve) => {
      const isSecureContext = window.location.protocol === 'https:' || 
                             ['localhost', '127.0.0.1'].includes(window.location.hostname);

      if (!isSecureContext) {
        console.warn('⚠️ Google Cast requiere HTTPS o localhost.');
        this.isInitialized = false;
        resolve(null);
        return;
      }

      if (this.isCastSDKReady()) {
        console.log('✅ Google Cast SDK ya disponible, configurando contexto.');
        this.isInitialized = true;
        resolve(this.setupCastContext());
        return;
      }

      window.__onGCastApiAvailable = (isAvailable: boolean) => {
        console.log(`🔄 Google Cast SDK disponible: ${isAvailable}`);
        if (isAvailable) {
          try {
            this.isInitialized = true;
            console.log('✅ Google Cast SDK inicializado correctamente.');
            resolve(this.setupCastContext());
          } catch (error) {
            console.error('❌ Error configurando contexto de Cast:', error);
            this.isInitialized = false;
            resolve(null);
          }
        } else {
          console.warn('⚠️ Google Cast SDK no disponible.');
          this.isInitialized = false;
          resolve(null);
        }
      };

      // Timeout de seguridad
      setTimeout(() => {
        if (!this.isInitialized) {
          console.warn('⏰ Timeout esperando Google Cast SDK.');
          this.isInitialized = false;
          resolve(null);
        }
      }, 5000);
    });
  }

  private isCastSDKReady(): boolean {
    return !!(window.cast && window.cast.framework && window.cast.framework.CastContext);
  }

  private setupCastContext(): CastContext {
    const castContext = window.cast.framework.CastContext.getInstance();
    
    const options = {
      receiverApplicationId: 'CC1AD845',
      autoJoinPolicy: window.cast.framework.AutoJoinPolicy.ORIGIN_SCOPED,
      language: 'es-ES',
      resumeSavedSession: false,
      androidReceiverCompatible: true
    };

    castContext.setOptions(options);
    console.log('🔧 Configuración Cast aplicada:', options);
    return castContext;
  }
}
