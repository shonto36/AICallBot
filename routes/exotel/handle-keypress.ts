// routes/exotel/handle-keypress.ts
import * as express from "express";
const router = express.Router();

router.post("/exotel/handle-keypress", (req, res) => {
  const digits = req.body.Digits;
  console.log("Pressed key:", digits);

  res.set("Content-Type", "text/xml");

  if (digits === "1") {
    return res.send(`
      <Response>
        <Say>Recording now. Speak after the beep.</Say>
        <Record
          timeout="5"
          maxDuration="30"
          transcribe="false"
          playBeep="true"
          action="/api/exotel/on-recording"
        />
      </Response>
    `);
  }

  return res.send(`<Response><Say>Invalid input. Goodbye!</Say></Response>`);
});

export default router;