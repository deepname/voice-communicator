import { SoundFile, AudioObjects } from '../config';

export interface AudioServiceEvents {
    onSoundStarted?: (soundName: string) => void;
    onSoundEnded?: (soundName: string) => void;
    onSoundError?: (soundName: string, error: Error) => void;
}

export class AudioService {
    private audioObjects: AudioObjects = {};
    private events?: AudioServiceEvents;

    constructor(events?: AudioServiceEvents) {
        this.events = events;
    }

    public createAudioElement(sound: SoundFile): HTMLAudioElement {
        if (this.audioObjects[sound.name]) {
            return this.audioObjects[sound.name];
        }

        const audio = new Audio();
        audio.preload = 'metadata'; // Changed from 'auto' to 'metadata' for better performance
        audio.src = `sound/${sound.filename}`;
        audio.crossOrigin = 'anonymous';

        // Configurar eventos
        audio.addEventListener('error', (e: Event) => {
            console.error(`Error cargando audio: ${sound.filename}`, e);
            this.events?.onSoundError?.(sound.name, new Error(`Error cargando audio: ${sound.filename}`));
        });

        audio.addEventListener('play', () => {
            this.events?.onSoundStarted?.(sound.name);
        });

        audio.addEventListener('ended', () => {
            this.events?.onSoundEnded?.(sound.name);
        });

        this.audioObjects[sound.name] = audio;
        return audio;
    }

    public getAudioElement(soundName: string): HTMLAudioElement | null {
        return this.audioObjects[soundName] || null;
    }

    public async playSound(soundName: string, soundFile?: SoundFile): Promise<void> {
        let audio = this.getAudioElement(soundName);

        // Crear elemento de audio si no existe (lazy loading)
        if (!audio && soundFile) {
            console.log(`Cargando ${soundName} bajo demanda...`);
            audio = this.createAudioElement(soundFile);
        }

        if (!audio) {
            console.error(`No se pudo cargar el audio para ${soundName}`);
            return;
        }

        // Pausar cualquier sonido que esté reproduciéndose
        this.stopAll();

        try {
            audio.currentTime = 0;
            await audio.play();
            console.log(`Reproduciendo: ${soundName}`);
        } catch (error) {
            console.error(`Error reproduciendo ${soundName}:`, error);
            this.events?.onSoundError?.(soundName, error as Error);
        }
    }

    public stopSound(soundName: string): void {
        const audio = this.getAudioElement(soundName);
        if (audio && !audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    public stopAll(): void {
        Object.values(this.audioObjects).forEach(audio => {
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    public isPlaying(soundName: string): boolean {
        const audio = this.getAudioElement(soundName);
        return audio ? !audio.paused : false;
    }

    public getLoadedSounds(): string[] {
        return Object.keys(this.audioObjects);
    }

    public setEventHandlers(events: AudioServiceEvents): void {
        this.events = events;
    }

    public handleSoundEnded(soundName: string): void {
        this.events?.onSoundEnded?.(soundName);
    }

    public handleSoundError(soundName: string, error: Error): void {
        this.events?.onSoundError?.(soundName, error);
    }

    public getCurrentlyPlaying(): string[] {
        const playing: string[] = [];
        for (const [soundName, audio] of Object.entries(this.audioObjects)) {
            if (!audio.paused) {
                playing.push(soundName);
            }
        }
        return playing;
    }

    public preloadSound(sound: SoundFile): void {
        if (!this.audioObjects[sound.name]) {
            this.createAudioElement(sound);
        }
    }

    public preloadAllSounds(sounds: SoundFile[]): void {
        sounds.forEach(sound => this.preloadSound(sound));
    }

    public dispose(): void {
        this.stopAll();
        for (const soundName in this.audioObjects) {
            const audio = this.audioObjects[soundName];
            audio.removeEventListener('play', () => {});
            audio.removeEventListener('ended', () => {});
            audio.removeEventListener('error', () => {});
        }
        this.audioObjects = {};
    }
}
