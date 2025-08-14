import { CastSession, MediaInfo, LoadRequest } from './cast-types';

export class CastPlayer {

  public async playAudio(session: CastSession, audioUrl: string, title: string): Promise<boolean> {
    if (!session) {
      console.error('❌ No hay sesión Cast activa para reproducir');
      return false;
    }

    try {
      const mediaInfo: MediaInfo = {
        contentId: audioUrl,
        contentType: 'audio/mpeg',
        streamType: 'BUFFERED',
        metadata: {
          type: 0, // Generic media type
          metadataType: 0, // Generic metadata
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

      // El RemotePlayer y su Controller son manejados por el SDK al cargar media
      // No es necesario instanciarlos manualmente para una simple reproducción.
            await (session as any).loadMedia(request);
      console.log(`✅ Reproduciendo "${title}" en Cast`);
      return true;

    } catch (error: any) {
      console.error('❌ Error al reproducir en Cast:', error);
      // Puedes añadir manejo de errores más específico si es necesario
      // Por ejemplo, si error.code === 'LOAD_FAILED'
      return false;
    }
  }
}
