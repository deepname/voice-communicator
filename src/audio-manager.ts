import { soundFiles, SoundFile, AudioObjects } from './config';

export class AudioManager {
    private audioObjects: AudioObjects = {};
    private onPlay: (soundName: string) => void;
    private onEnded: (soundName: string) => void;

    constructor(onPlay: (soundName: string) => void, onEnded: (soundName: string) => void) {
        this.onPlay = onPlay;
        this.onEnded = onEnded;
    }

    /**
     * Crea y configura un elemento de audio para un sonido específico.
     * Este método se llama bajo demanda (carga diferida).
     */
    private createAudioElement(sound: SoundFile): HTMLAudioElement {
        const audio = new Audio();
        audio.preload = 'auto'; // El navegador decide cómo y cuándo cargar
        audio.src = `sound/${sound.filename}`;
        audio.crossOrigin = 'anonymous';

        audio.addEventListener('error', (e: Event) => {
            console.error(`Error cargando audio: ${sound.filename}`, e);
        });

        audio.addEventListener('play', () => this.onPlay(sound.name));
        audio.addEventListener('ended', () => this.onEnded(sound.name));

        this.audioObjects[sound.name] = audio;
        return audio;
    }

    public getAudioElement(soundName: string): HTMLAudioElement | undefined {
        return this.audioObjects[soundName];
    }

        public getAudioObjects(): AudioObjects {
        return this.audioObjects;
    }

    public playSound(soundName: string): void {
        let audio = this.getAudioElement(soundName);

        // Si el audio no existe, crearlo bajo demanda (lazy load)
        if (!audio) {
            const soundFile = soundFiles.find(sf => sf.name === soundName);
            if (soundFile) {
                console.log(`Cargando ${soundName} bajo demanda...`);
                audio = this.createAudioElement(soundFile);
            } else {
                console.error(`Archivo de sonido no encontrado en la configuración: ${soundName}`);
                return;
            }
        }

        // Reproducir el sonido
        audio.currentTime = 0;
        audio.play().catch(e => console.error(`Error al reproducir ${soundName}:`, e));
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
