import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY not found in environment variables');
}

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }
    );

    const candidates = response.data.candidates;
    const reply = candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error('Gemini returned empty response:', response.data);
      throw new Error('No valid reply from Gemini');
    }

    return reply;
  } catch (err) {
    console.error('Error fetching Gemini reply:', err);
    throw err;
  }
}