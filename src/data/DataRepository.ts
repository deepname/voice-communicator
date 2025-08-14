export interface AppData {
    isInitialized: boolean;
    lastUsed: string;
    [key: string]: any;
}

export class DataRepository {
    private storageKey = 'voice-communicator-data';

    public saveAppData(data: AppData): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving app data:', error);
            throw error;
        }
    }

    public loadAppData(): AppData | null {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading app data:', error);
            return null;
        }
    }

    public clearAppData(): void {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (error) {
            console.error('Error clearing app data:', error);
            throw error;
        }
    }

    public hasAppData(): boolean {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Methods expected by tests
    public persistData(data: AppData): void {
        this.saveAppData(data);
    }

    public retrieveData(): AppData | null {
        return this.loadAppData();
    }

    public deleteData(): void {
        this.clearAppData();
    }

    public exists(): boolean {
        return this.hasAppData();
    }

    // Additional methods expected by tests
    public saveCastData(data: any): void {
        try {
            localStorage.setItem('voice-communicator-cast', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving cast data:', error);
            throw error;
        }
    }

    public loadCastData(): any {
        try {
            const data = localStorage.getItem('voice-communicator-cast');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading cast data:', error);
            return null;
        }
    }

    public saveSoundData(data: any): void {
        try {
            localStorage.setItem('voice-communicator-sound', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving sound data:', error);
            throw error;
        }
    }

    public loadSoundData(): any {
        try {
            const data = localStorage.getItem('voice-communicator-sound');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading sound data:', error);
            return null;
        }
    }

    public hasData(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public saveData(key: string, data: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
            throw error;
        }
    }

    public loadData(key: string): any {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading data for key ${key}:`, error);
            return null;
        }
    }

    public removeData(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing data for key ${key}:`, error);
            throw error;
        }
    }
}
