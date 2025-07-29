// test-stt.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { getTranscriptFromFile } from './services/stt-google';
import { getGeminiResponse } from './services/gemini-api';
import { generateSpeechFromText } from './services/tts-elevenlabs';

async function main() {
  try {
    const filePath = './myVoicerecording.mp3'; // You can change this path as needed
    console.log('[🎙️ STT] Processing file:', filePath);

    const transcript = await getTranscriptFromFile(filePath);
    console.log('[✅ STT Done] Transcript:', transcript);

    const aiReply = await getGeminiResponse(transcript);
    console.log('[🧠 Gemini Reply]', aiReply);

    const audioPath = await generateSpeechFromText(aiReply, 'stt-gemini-tts.mp3');
    console.log('[🔊 TTS Saved]', audioPath);
  } catch (error) {
    console.error('❌ Test STT-Gemini-TTS Flow Failed:', error);
  }
}

main();