import { SoundFile } from '../config';

// Modelo de datos para sonidos
export interface SoundData {
    name: string;
    filename: string;
    color: string;
    isLoaded: boolean;
    lastPlayed?: Date;
}

// Modelo de datos para el estado de Cast
export interface CastData {
    isConnected: boolean;
    deviceName: string | null;
    sessionId: string | null;
    devicesAvailable: boolean;
    lastConnectionTime?: Date;
}

// Modelo de datos para el estado de la aplicación
export interface AppData {
    isInitialized: boolean;
    version: string;
    lastStartTime: Date;
    settings: AppSettings;
}

export interface AppSettings {
    autoConnect: boolean;
    defaultVolume: number;
    theme: 'light' | 'dark' | 'auto';
    language: string;
}

// Repositorio de datos para gestionar la persistencia
export class DataRepository {
    private readonly STORAGE_KEYS = {
        APP_DATA: 'voice_communicator_app_data',
        CAST_DATA: 'voice_communicator_cast_data',
        SOUND_DATA: 'voice_communicator_sound_data',
        SETTINGS: 'voice_communicator_settings'
    };

    // Métodos para datos de la aplicación
    public saveAppData(data: AppData): void {
        try {
            localStorage.setItem(this.STORAGE_KEYS.APP_DATA, JSON.stringify(data));
        } catch (error) {
            console.warn('Error saving app data:', error);
        }
    }

    public loadAppData(): AppData | null {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.APP_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Error loading app data:', error);
            return null;
        }
    }

    // Métodos para datos de Cast
    public saveCastData(data: CastData): void {
        try {
            localStorage.setItem(this.STORAGE_KEYS.CAST_DATA, JSON.stringify(data));
        } catch (error) {
            console.warn('Error saving cast data:', error);
        }
    }

    public loadCastData(): CastData | null {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.CAST_DATA);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Error loading cast data:', error);
            return null;
        }
    }

    // Métodos para datos de sonidos
    public saveSoundData(sounds: SoundData[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SOUND_DATA, JSON.stringify(sounds));
        } catch (error) {
            console.warn('Error saving sound data:', error);
        }
    }

    public loadSoundData(): SoundData[] {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SOUND_DATA);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.warn('Error loading sound data:', error);
            return [];
        }
    }

    // Métodos para configuración
    public saveSettings(settings: AppSettings): void {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.warn('Error saving settings:', error);
        }
    }

    public loadSettings(): AppSettings {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            return data ? JSON.parse(data) : this.getDefaultSettings();
        } catch (error) {
            console.warn('Error loading settings:', error);
            return this.getDefaultSettings();
        }
    }

    private getDefaultSettings(): AppSettings {
        return {
            autoConnect: false,
            defaultVolume: 0.8,
            theme: 'auto',
            language: 'es'
        };
    }

    // Métodos de utilidad
    public clearAllData(): void {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('Error clearing data:', error);
        }
    }

    public exportData(): string {
        const data = {
            appData: this.loadAppData(),
            castData: this.loadCastData(),
            soundData: this.loadSoundData(),
            settings: this.loadSettings()
        };
        return JSON.stringify(data, null, 2);
    }

    public importData(jsonData: string): boolean {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.appData) this.saveAppData(data.appData);
            if (data.castData) this.saveCastData(data.castData);
            if (data.soundData) this.saveSoundData(data.soundData);
            if (data.settings) this.saveSettings(data.settings);
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

// Adaptadores para convertir entre modelos externos e internos
export class DataAdapters {
    public static soundFileToSoundData(soundFile: SoundFile): SoundData {
        return {
            name: soundFile.name,
            filename: soundFile.filename,
            color: soundFile.color,
            isLoaded: false
        };
    }

    public static soundDataToSoundFile(soundData: SoundData): SoundFile {
        return {
            name: soundData.name,
            filename: soundData.filename,
            color: soundData.color
        };
    }

    public static createAppData(version: string = '1.0.0'): AppData {
        return {
            isInitialized: false,
            version,
            lastStartTime: new Date(),
            settings: {
                autoConnect: false,
                defaultVolume: 0.8,
                theme: 'auto',
                language: 'es'
            }
        };
    }

    public static createCastData(): CastData {
        return {
            isConnected: false,
            deviceName: null,
            sessionId: null,
            devicesAvailable: false
        };
    }
}
