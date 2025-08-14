export class DataAdapters {
    // Convert internal data to storage format
    public static toStorage(data: any): string {
        try {
            if (data === null || data === undefined) {
                return JSON.stringify(null);
            }
            return JSON.stringify(data);
        } catch (error) {
            console.error('Error converting data to storage format:', error);
            throw error;
        }
    }

    // Convert storage data to internal format
    public static fromStorage(storageData: string): any {
        try {
            if (!storageData || storageData === 'null' || storageData === 'undefined') {
                return null;
            }
            return JSON.parse(storageData);
        } catch (error) {
            console.error('Error converting storage data to internal format:', error);
            // Return null for invalid data instead of throwing
            return null;
        }
    }

    // Validate data structure
    public static validate(data: any, schema?: any): boolean {
        try {
            if (!data) return false;
            if (typeof data !== 'object') return false;
            
            // Basic validation - can be extended with schema validation
            if (schema) {
                // Simple schema validation
                for (const key in schema) {
                    if (schema[key].required && !(key in data)) {
                        return false;
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('Error validating data:', error);
            return false;
        }
    }

    // Sanitize data before storage
    public static sanitize(data: any): any {
        try {
            if (!data) return null;
            
            // Remove functions and undefined values
            const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
                if (typeof value === 'function' || value === undefined) {
                    return null;
                }
                return value;
            }));
            
            return sanitized;
        } catch (error) {
            console.error('Error sanitizing data:', error);
            return null;
        }
    }

    // Merge data objects
    public static merge(target: any, source: any): any {
        try {
            if (!target && !source) return null;
            if (!target) return { ...source };
            if (!source) return { ...target };
            
            return { ...target, ...source };
        } catch (error) {
            console.error('Error merging data:', error);
            return target || null;
        }
    }

    // Create default app data structure
    public static createAppData(version: string = '1.0.0'): any {
        return {
            version: version,
            isInitialized: true,
            lastUsed: new Date().toISOString(),
            settings: {
                volume: 0.8,
                autoPlay: false,
                theme: 'dark'
            },
            preferences: {
                language: 'es',
                notifications: true
            }
        };
    }

    // Create default cast data structure
    public static createCastData(): any {
        return {
            isConnected: false,
            lastConnectedDevice: null,
            connectionHistory: [],
            preferences: {
                autoConnect: false,
                volume: 0.8
            }
        };
    }

    // Create default sound data structure
    public static createSoundData(): any {
        return {
            lastPlayed: null,
            playCount: {},
            favorites: [],
            settings: {
                defaultVolume: 0.8,
                fadeInOut: true
            }
        };
    }
}
