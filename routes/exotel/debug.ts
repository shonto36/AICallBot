// routes/exotel/debug.ts
import * as express from "express";
import * as dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/api/exotel/debug", (req, res) => {
  console.log("[EXOTEL DEBUG POST] Incoming:", req.body || req.query);

  res.set("Content-Type", "text/xml");

  const ngrokUrl = process.env.NGROK_URL;

  return res.send(`
    <Response>
      <Say>Welcome to the Call AI bot. Press 1 to talk to the AI.</Say>
      <Gather timeout="10" numDigits="1" action="${ngrokUrl}/api/exotel/handle-keypress" method="POST">
        <Say>Press 1 to start recording your message for the AI.</Say>
      </Gather>
      <Say>No input received. Goodbye.</Say>
    </Response>
  `);
});

export default router;