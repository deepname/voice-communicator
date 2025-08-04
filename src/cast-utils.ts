import { CastState } from './cast-types';

/**
 * Obtiene descripción legible del estado de Cast
 */
export function getCastStateDescription(state: any): string {
  // Asegurarse de que window.cast.framework.CastState está disponible
  const CastStateEnum = window.cast?.framework?.CastState || {};

  switch (state) {
    case CastStateEnum.NO_DEVICES_AVAILABLE:
      return 'No hay dispositivos';
    case CastStateEnum.NOT_CONNECTED:
      return 'No conectado';
    case CastStateEnum.CONNECTING:
      return 'Conectando';
    case CastStateEnum.CONNECTED:
      return 'Conectado';
    default:
      return 'Estado desconocido';
  }
}

/**
 * Obtiene la URL completa del archivo de audio
 */
export function getFullAudioUrl(filename: string): string {
  const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
  // Asegurarse de que la URL base termine con una barra
  const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${finalBaseUrl}sound/${filename}`;
}
