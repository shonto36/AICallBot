import axios from 'axios';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

export async function generateSpeechFromText(
  text: string,
  fileName?: string
): Promise<string> {
  try {
    // Create temp directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'temp');
    await fs.mkdir(outputDir, { recursive: true });

    // Generate filename if not provided
    const mp3FileName = fileName || `${uuidv4()}.mp3`;
    const mp3FilePath = path.join(outputDir, mp3FileName);

    // Make API request
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
      data: {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7,
        },
      },
      responseType: 'arraybuffer', // Get binary data directly
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
    });

    // Write file atomically
    await fs.writeFile(mp3FilePath, response.data);
    
    return mp3FilePath;
  } catch (error: any) {
    console.error('❌ ElevenLabs TTS Error:', error.response?.data || error.message);
    throw new Error(`TTS synthesis failed: ${error.message}`);
  }
}