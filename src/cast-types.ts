// Tipos TypeScript para Google Cast SDK
declare global {
  interface Window {
    cast: any;
    __onGCastApiAvailable: (isAvailable: boolean) => void;
  }
}

export interface CastDevice {
  friendlyName: string;
  deviceId: string;
  capabilities: string[];
}

export interface CastSession {
  getSessionId(): string;
  getApplicationId(): string;
  sendMessage(namespace: string, message: any): void;
  addUpdateListener(listener: (isAlive: boolean) => void): void;
  removeUpdateListener(listener: (isAlive: boolean) => void): void;
}

export interface CastContext {
  getCurrentSession(): CastSession | null;
  requestSession(): Promise<CastSession>;
  endCurrentSession(stopCasting: boolean): void;
  setOptions(options: any): void;
}

export interface MediaInfo {
  contentId: string;
  contentType: string;
  streamType: string;
  metadata: {
    type: number;
    metadataType: number;
    title: string;
    subtitle?: string;
    images?: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
}

export interface LoadRequest {
  media: MediaInfo;
  autoplay: boolean;
  currentTime: number;
}

export enum CastState {
  NO_DEVICES_AVAILABLE = 'NO_DEVICES_AVAILABLE',
  NOT_CONNECTED = 'NOT_CONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED'
}

export interface CastStateEventData {
  castState: CastState;
}
