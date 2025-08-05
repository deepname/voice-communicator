export interface SoundFile {
    name: string;
    filename: string;
    color: string;
}

export interface AudioObjects {
    [key: string]: HTMLAudioElement;
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFC3A0', '#FFAB91', '#F4A261', '#E76F51', '#2A9D8F', '#264653'];

const soundFileNames = (process.env.SOUND_FILES || '').split(',').filter(Boolean);

export const soundFiles: SoundFile[] = soundFileNames.map((filename, index) => ({
    name: filename.split('.')[0],
    filename,
    color: colors[index % colors.length]
}));
