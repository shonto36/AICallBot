// services/stt-google.ts
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { SpeechClient } from '@google-cloud/speech';

const client = new SpeechClient();

// For Exotel (URL input)
export async function getTranscriptFromRecording(recordingUrl: string): Promise<string> {
  const filePath = path.join(__dirname, '..', 'temp', `recording-${Date.now()}.mp3`);

  try {
    const response = await axios({
      method: 'GET',
      url: recordingUrl,
      responseType: 'stream',
    });

    await pipeline(response.data, (await fs.open(filePath, 'w')).createWriteStream());
    console.log('✅ Audio downloaded:', filePath);

    const file = await fs.readFile(filePath);
    const audioBytes = file.toString('base64');

    const [responseSTT] = await client.recognize({
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'MP3',
        sampleRateHertz: 44100,
        languageCode: 'en-IN',
      },
    });

    const transcript = responseSTT.results?.map(r => r.alternatives?.[0]?.transcript).join(' ') || '';
    console.log('📝 Transcribed Text:', transcript);
    return transcript;
  } catch (err) {
    console.error('❌ STT Error:', err);
    throw new Error('Google STT failed');
  } finally {
    await fs.unlink(filePath).catch(() => {});
  }
}

// For local MP3 test
export async function getTranscriptFromFile(mp3Path: string): Promise<string> {
  try {
    const file = await fs.readFile(mp3Path);
    const audioBytes = file.toString('base64');

    const [responseSTT] = await client.recognize({
      audio: {
        content: audioBytes,
      },
      config: {
        encoding: 'MP3',
        sampleRateHertz: 44100,
        languageCode: 'en-IN',
      },
    });

    const transcript = responseSTT.results?.map(r => r.alternatives?.[0]?.transcript).join(' ') || '';
    console.log('📝 Transcribed Text:', transcript);
    return transcript;
  } catch (err) {
    console.error('❌ STT Error:', err);
    throw new Error('Google STT failed');
  }
}