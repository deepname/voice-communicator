export interface SoundFile {
    name: string;
    filename: string;
    color: string;
}

export interface AudioObjects {
    [key: string]: HTMLAudioElement;
}

// Helper function to generate a random hex color
function getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const soundFileNames = (process.env.SOUND_FILES || '').split(',').filter(Boolean);

export const soundFiles: SoundFile[] = soundFileNames.map((filename) => ({
    name: filename.split('.')[0],
    filename,
    color: getRandomColor()
}));
