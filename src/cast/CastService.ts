import { CastManager } from './cast-manager';

export interface CastServiceEvents {
    onStateChange: (isConnected: boolean, deviceName?: string) => void;
    onDevicesAvailable: (available: boolean) => void;
    onError: (error: any) => void;
}

export class CastService {
    private castManager: CastManager;
    private events: CastServiceEvents | null = null;

    constructor(events?: CastServiceEvents) {
        this.castManager = new CastManager();
        if (events) {
            this.events = events;
            this.setupCastManagerEvents();
        }
    }

    private setupCastManagerEvents(): void {
        this.castManager.onStateChange(() => {
            if (this.events) {
                const isConnected = this.castManager.isConnected();
                const deviceName = this.castManager.getDeviceName();
                this.events.onStateChange(isConnected, deviceName || undefined);
                
                const devicesAvailable = this.castManager.areDevicesAvailable();
                this.events.onDevicesAvailable(devicesAvailable);
            }
        });
    }

    public async initialize(): Promise<void> {
        try {
            await this.castManager.initialize();
        } catch (error) {
            console.warn('Error inicializando Cast API:', error);
            if (this.events) {
                this.events.onError(error);
            }
            throw error;
        }
    }

    public async startCasting(): Promise<boolean> {
        try {
            return await this.castManager.startCasting();
        } catch (error) {
            if (this.events) {
                this.events.onError(error);
            }
            throw error;
        }
    }

    public async stopCasting(): Promise<void> {
        try {
            await this.castManager.stopCasting();
        } catch (error) {
            if (this.events) {
                this.events.onError(error);
            }
            throw error;
        }
    }

    public async playAudioOnCast(audioUrl: string, soundName: string): Promise<boolean> {
        try {
            return await this.castManager.playAudioOnCast(audioUrl, soundName);
        } catch (error) {
            this.events?.onError(error);
            throw error;
        }
    }

    public getFullAudioUrl(relativeSrc: string): string {
        return this.castManager.getFullAudioUrl(relativeSrc);
    }

    public isConnected(): boolean {
        return this.castManager.isConnected();
    }

    public getDeviceName(): string | null {
        return this.castManager.getDeviceName();
    }

    public areDevicesAvailable(): boolean {
        return this.castManager.areDevicesAvailable();
    }

    public getCastManager(): CastManager {
        return this.castManager;
    }

    // Methods expected by tests
    public setEventHandlers(events: CastServiceEvents): void {
        this.events = events;
        this.setupCastManagerEvents();
    }

    public handleStateChange(isConnected: boolean, deviceName?: string): void {
        if (this.events) {
            this.events.onStateChange(isConnected, deviceName);
        }
    }

    public handleError(error: any): void {
        if (this.events) {
            this.events.onError(error);
        }
    }

    public handleDeviceFound(deviceName: string): void {
        if (this.events && this.events.onDevicesAvailable) {
            this.events.onDevicesAvailable(true);
        }
    }

    public getCurrentDevice(): string | null {
        return this.getDeviceName();
    }

    public getAvailableDevices(): string[] {
        // Return empty array for now, could be enhanced to return actual device list
        return [];
    }

    public castSound(soundName: string, soundUrl: string): Promise<boolean> {
        return this.playAudioOnCast(soundUrl, soundName);
    }

    public disconnect(): Promise<void> {
        return this.stopCasting();
    }
}
