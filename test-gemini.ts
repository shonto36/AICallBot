import { getGeminiResponse } from './services/gemini-api';

(async () => {
  const reply = await getGeminiResponse('Capital of India?');
  console.log('Gemini reply:', reply);
})();