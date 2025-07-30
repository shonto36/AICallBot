// routes/exotel/on-recording.ts
import * as express from "express";
const router = express.Router();

router.post("/exotel/on-recording", (req, res) => {
  const recordingUrl = req.body.RecordingUrl;
  console.log("🎤 Received recording URL:", recordingUrl);

  res.set("Content-Type", "text/xml");
  return res.send(`<Response><Say>Thanks. Your message is recorded. Bye!</Say></Response>`);
});

export default router;