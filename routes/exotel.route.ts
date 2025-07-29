import { Request, Response } from 'express';
import { getTranscriptFromRecording } from '../services/stt-google';
import { getGeminiResponse } from '../services/gemini-api';
import { generateSpeechFromText } from '../services/tts-elevenlabs';

export const handleExotelVoiceHook = async (req: Request, res: Response) => {
  try {
    const recordingUrl = req.body?.RecordingUrl;

    if (!recordingUrl) {
      return res.status(400).send('Missing RecordingUrl');
    }

    console.log('Received RecordingUrl:', recordingUrl);

    // 1. Transcribe audio to text
    const transcript = await getTranscriptFromRecording(recordingUrl);
    console.log('Transcript:', transcript);

    // 2. Get Gemini response
    const aiReply = await getGeminiResponse(transcript);
    console.log('Gemini Reply:', aiReply);

    // 3. Generate TTS audio URL
    const audioUrl = await generateSpeechFromText(aiReply);
    console.log('TTS Audio URL:', audioUrl);

    // 4. Return TwiML XML to play the audio to caller
    const twiml = `
      <Response>
        <Play>${audioUrl}</Play>
      </Response>
    `;

    res.set('Content-Type', 'text/xml');
    res.send(twiml.trim());
  } catch (err) {
    console.error('Error handling Exotel hook:', err);
    res.status(500).send('Internal Server Error');
  }
};

import { Router } from 'express';

const router = Router();
router.post('/api/exotel/voicehook', handleExotelVoiceHook);

export default router;