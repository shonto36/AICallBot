

import { Request, Response } from 'express';
import { getTranscriptFromRecording } from '../services/stt-google';
import { getGeminiResponse } from '../services/gemini-api';
import { generateSpeechFromText } from '../services/tts-elevenlabs';
import * as path from 'node:path';
import * as fs from 'node:fs';

export const handleExotelVoice = async (req: Request, res: Response) => {
  try {
    const { RecordingUrl } = req.body;

    if (!RecordingUrl) {
      return res.status(400).send('Missing RecordingUrl');
    }

    console.log('🔉 Received RecordingUrl:', RecordingUrl);

    // Transcribe
    const transcribedText = await getTranscriptFromRecording(RecordingUrl);
    console.log('✍️ Transcribed Text:', transcribedText);

    // Generate Gemini reply
    const reply = await getGeminiResponse(transcribedText);
    console.log('🧠 Gemini Reply:', reply);

    // Generate speech using ElevenLabs
    const audioUrl = await generateSpeechFromText(reply);
    console.log('🔊 Audio URL:', audioUrl);

    // Send TwiML response with audio URL
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Play>${audioUrl}</Play>
      </Response>
    `);
  } catch (error) {
    console.error('❌ Error in handleExotelVoice:', error);
    res.status(500).send('Internal Server Error');
  }
};