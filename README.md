# 📞 AI CallBot – Exotel + Gemini + ElevenLabs

A Node.js-based AI voice bot that integrates:
- ✅ **Exotel** for incoming/outgoing calls
- 🧠 **Google Gemini** for intelligent call responses
- 🔊 **ElevenLabs** for natural Text-to-Speech
- 🎙️ **Google STT** for Speech-to-Text
- 🧪 Includes test scripts to validate each service individually

---

## 🏗️ Project Structure

```bash
.
├── controllers/
│   └── exotel.controller.ts         # Exotel call handling logic
├── routes/
│   └── exotel/                      # Routes for handling Exotel call events
├── services/
│   ├── gemini-api.ts               # Gemini API handler
│   ├── stt-google.ts               # Google Speech-to-Text service
│   └── tts-elevenlabs.ts           # ElevenLabs TTS service
├── utils/
│   └── downloadAudio.ts            # Downloads Exotel call recordings
├── test-elevenlabs.ts              # Run ElevenLabs TTS locally
├── test-gemini.ts                  # Run Gemini AI queries locally
├── test-stt.ts                     # Run STT on local audio file
├── .env                            # Secrets and keys (see below)
├── index.ts                        # Entry point


⸻

⚙️ Setup Instructions

1️⃣ Clone and Install

git clone https://github.com/<Your Git Name>/AICallBot.git
cd AICallBot
npm install


⸻

2️⃣ Create .env File

Create a .env file in the root:

PORT=3000

EXOTEL_SID=your_exotel_sid
EXOTEL_TOKEN=your_exotel_token
EXOTEL_VIRTUAL_NUMBER=your_exotel_number
EXOTEL_CALLBACK_URL=https://your-ngrok-or-api-url/api/exotel/on-recording

GOOGLE_PROJECT_ID=your_project_id
GOOGLE_CLIENT_EMAIL=your_email_from_json
GOOGLE_PRIVATE_KEY="your_private_key" # wrap in quotes & escape \n properly

GEMINI_API_KEY=your_google_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_key


⸻

3️⃣ Add Google STT JSON Credentials

Download the Google service account JSON file from:
https://console.cloud.google.com/iam-admin/serviceaccounts

Place it in the root folder as:

google-credentials.json

Also, set GOOGLE_APPLICATION_CREDENTIALS in .env (optional):

GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json


⸻

🔬 Test Each Component

✅ 1. Test Gemini Response

ts-node test-gemini.ts

🔹 Prompts Gemini with a sample message and logs the AI response.

⸻

✅ 2. Test ElevenLabs TTS

ts-node test-elevenlabs.ts

🔹 Converts a text prompt to audio and saves it as output.mp3.

⸻

✅ 3. Test Google STT

Ensure New Recording 3.m4a is present, or replace it with your own.

ts-node test-stt.ts

🔹 Converts audio to text using Google STT.

⸻

🔄 Webhook Flow (Exotel → You)
	1.	Exotel hits your /on-recording, /debug, or /handle-keypress route.
	2.	Audio gets downloaded and transcribed (Google STT).
	3.	Transcript is sent to Gemini for response.
	4.	Reply is converted to speech via ElevenLabs.
	5.	Audio is returned to Exotel as a response.

⸻

🚀 Run the Server

ts-node index.ts
# or build first and run
# tsc && node dist/index.js


⸻

🧠 Ideas for Expansion
	•	Add sentiment detection (angry/frustrated customers)
	•	Log call summaries to a Notion/CRM
	•	Multilingual support via Gemini + STT
	•	Auto-escalation if bot fails to resolve

⸻

Got it. Here’s the updated section for the README.md — clearly mentioning audio formats and conversion notes:

⸻

🔊 Audio Format Notes
	•	Exotel sends recordings as .mp3 → we store in .mp3
	•	ElevenLabs generates output in .mp3
	•	Gemini works with text only
	•	Google Speech-to-Text requires .wav format

So before passing to Google STT, we convert .mp3 to .wav in stt-google.ts. You can also pre-convert using ffmpeg like:

ffmpeg -i input.mp3 -ar 16000 -ac 1 output.wav

This is already handled internally in the code if you pass .mp3.

⸻

