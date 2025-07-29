import * as dotenv from 'dotenv';
dotenv.config();

import { getGeminiResponse } from './services/gemini-api';
import { generateSpeechFromText } from './services/tts-elevenlabs';
import * as fs from 'node:fs';
import * as path from 'node:path';

async function main() {
  try {
    const prompt = 'Tell me a random joke';
    console.log('[Gemini] Sending prompt:', prompt);

    const reply = await getGeminiResponse(prompt);
    console.log('[Gemini] Got reply:', reply);

    const mp3Path = await generateSpeechFromText(reply, 'gemini-tts-test.mp3');
    console.log('[ElevenLabs] MP3 saved to:', mp3Path);

    const stats = fs.statSync(mp3Path);
    console.log(`[ℹ️ File Info] Size: ${stats.size} bytes`);
    
    // Verify the file is playable
    if (stats.size < 1024) {
      console.warn('⚠️ Warning: File size seems too small');
      const content = fs.readFileSync(mp3Path);
      console.log('First 100 bytes:', content.subarray(0, 100).toString('hex'));
    }
  } catch (err) {
    console.error('❌ Error during Gemini → TTS test:', err);
  }
}

main();