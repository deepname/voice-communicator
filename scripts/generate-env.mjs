import { readdir, writeFile } from 'fs/promises';
import { join } from 'path';

const soundDir = join(process.cwd(), 'sound');
const envFile = join(process.cwd(), '.env');

async function generateEnv() {
  try {
    const files = await readdir(soundDir);
    const soundFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.aac'));
    const envContent = `SOUND_FILES="${soundFiles.join(',')}"`;

    await writeFile(envFile, envContent);
    console.log(`Successfully generated .env file with ${soundFiles.length} sounds.`);
  } catch (error) {
    console.error('Error generating .env file:', error);
  }
}

generateEnv();
