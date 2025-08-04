export interface SoundFile {
    name: string;
    filename: string;
    color: string;
}

export interface AudioObjects {
    [key: string]: HTMLAudioElement;
}

export const soundFiles: SoundFile[] = [
    { name: 'Cris', filename: 'Cris.mp3', color: '#FF6B6B' },
    { name: 'Ivan', filename: 'Ivan.mp3', color: '#4ECDC4' },
    { name: 'Josefina', filename: 'Josefina.mp3', color: '#45B7D1' },
    { name: 'Mimi', filename: 'Mimi.mp3', color: '#96CEB4' },
    { name: 'Rita', filename: 'Rita.mp3', color: '#FFEAA7' },
    { name: 'Valentina', filename: 'Valentina.mp3', color: '#DDA0DD' }
];
