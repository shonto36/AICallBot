import * as express from 'express';
import * as dotenv from 'dotenv';
import exotelRouter from './routes/exotel.route';
import { getGeminiResponse } from './services/gemini-api';
import { generateSpeechFromText } from './services/tts-elevenlabs';
import { getTranscriptFromRecording } from './services/stt-google';
import * as fs from 'node:fs';
import * as path from 'node:path';

console.log('🔧 Starting CallAI Voice Bot server...');

dotenv.config();
console.log('✅ Environment variables loaded from .env');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
console.log('📦 JSON middleware applied');

app.use('/api/exotel', exotelRouter);
console.log('🔌 Mounted /api/exotel routes');

app.post('/api/test-voice-flow', async (req, res) => {
  try {
    console.log('🎤 Received test voice request');

    // Simulated audio file path from Exotel (replace this path with actual Exotel input later)
    const dummyAudioPath = path.join(__dirname, 'temp', 'sample-input.wav');

    // Step 1: STT
    const transcript = await getTranscriptFromRecording(dummyAudioPath);
    console.log('[STT] Transcript:', transcript);

    // Step 2: Gemini
    const geminiReply = await getGeminiResponse(transcript);
    console.log('[Gemini] Reply:', geminiReply);

    // Step 3: TTS
    const mp3Path = await generateSpeechFromText(geminiReply, 'callai-response.mp3');
    console.log('[ElevenLabs] MP3 saved at:', mp3Path);

    const stats = fs.statSync(mp3Path);
    const isValid = stats.size > 1024;

    res.json({
      transcript,
      geminiReply,
      mp3Path,
      size: stats.size,
      validMp3: isValid,
    });
  } catch (err: any) {
    console.error('❌ Error in test voice flow:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

app.get('/', (req, res) => {
  console.log('🌐 GET / received');
  res.send('CallAI Voice Bot is live!');
});

console.log(`📡 Server will listen on port ${port}`);
app.listen(port, () => {
  console.log(`🚀 Gemini Voice Bot live at http://localhost:${port}`);
});