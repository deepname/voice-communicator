import { soundFiles, SoundFile, AudioObjects } from './config';

export class AudioManager {
    private audioObjects: AudioObjects = {};
    private onPlay: (soundName: string) => void;
    private onEnded: (soundName: string) => void;

    constructor(onPlay: (soundName: string) => void, onEnded: (soundName: string) => void) {
        this.onPlay = onPlay;
        this.onEnded = onEnded;
    }

    public preloadAudio(): void {
        soundFiles.forEach((sound: SoundFile) => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = `sound/${sound.filename}`;
            audio.crossOrigin = 'anonymous';

            audio.addEventListener('error', (e: Event) => {
                console.error(`Error cargando audio: ${sound.filename}`, e);
                // Reintentar la carga después de un segundo
                setTimeout(() => audio.load(), 1000);
            });

            audio.addEventListener('canplaythrough', () => {
                console.log(`Audio listo para reproducir: ${sound.filename}`);
            });

            audio.addEventListener('play', () => {
                this.onPlay(sound.name);
            });

            audio.addEventListener('ended', () => {
                this.onEnded(sound.name);
            });

            this.audioObjects[sound.name] = audio;
        });
    }

    public getAudioElement(soundName: string): HTMLAudioElement | undefined {
        return this.audioObjects[soundName];
    }

        public getAudioObjects(): AudioObjects {
        return this.audioObjects;
    }

    public playSound(soundName: string): void {
        const audio = this.getAudioElement(soundName);
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.error(`Error al reproducir ${soundName}:`, e));
        }
    }

    public stopAll(): void {
        for (const soundName in this.audioObjects) {
            const audio = this.audioObjects[soundName];
            if (!audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    }
}
