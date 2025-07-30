import { Request, Response } from 'express';
import { getTranscriptFromRecording } from '../services/stt-google';
import { getGeminiResponse } from '../services/gemini-api';
import { generateSpeechFromText } from '../services/tts-elevenlabs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as https from 'https';

dotenv.config();

const downloadMp3 = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

export const handleExotelVoiceHook = async (req: Request, res: Response) => {
  try {
    console.log('Incoming Exotel request:', JSON.stringify(req.body, null, 2));
    // Case 1: Handle digit input (e.g., user pressed "1")
    const digits = req.body?.Digits;
    if (digits) {
      console.log('Digits pressed:', digits);
      console.log('User input received, sending response to proceed to AI interaction.');

      const twiml = `
        <Response>
          <Say>Great. Connecting you to our AI agent.</Say>
        </Response>
      `;

      res.set('Content-Type', 'text/xml');
      return res.send(twiml.trim());
    }

    // Case 2: Handle voice recording URL after input
    const recordingUrl = req.body?.RecordingUrl;

    if (!recordingUrl) {
      return res.status(400).send('Missing RecordingUrl');
    }

    console.log('Received RecordingUrl:', recordingUrl);

    const localFilePath = path.join(__dirname, '../temp/user-question.mp3');
    await downloadMp3(recordingUrl, localFilePath);
    console.log('Audio file downloaded to local path:', localFilePath);

    // 1. Transcribe audio to text
    const transcript = await getTranscriptFromRecording(localFilePath);
    console.log('Transcript:', transcript);
    console.log('Transcription completed.');

    // 2. Get Gemini response
    const aiReply = await getGeminiResponse(transcript);
    console.log('Gemini Reply:', aiReply);
    console.log('Gemini AI response received.');

    // 3. Generate TTS audio and save as callai-response.mp3
    await generateSpeechFromText(aiReply, 'callai-response.mp3');
    console.log('TTS audio generation completed.');
    const audioUrl = `${process.env.PUBLIC_URL}/temp/callai-response.mp3`;
    console.log('TTS Audio URL:', audioUrl);

    // 4. Return TwiML XML to play the audio to caller
    const twiml = `
      <Response>
        <Play>${audioUrl}</Play>
      </Response>
    `;
    console.log('Responding with TwiML:', twiml);

    res.set('Content-Type', 'text/xml');
    res.send(twiml.trim());
  } catch (err) {
    console.error('Error handling Exotel hook:', err.stack || err);
    res.status(500).send('Internal Server Error');
  }
};

import { Router } from 'express';

const router = Router();
router.post('/voicehook', handleExotelVoiceHook);

export default router;