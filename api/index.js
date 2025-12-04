import { readFileSync } from "fs";
import path from "path";
import { sendToWebhook } from "../utils/sendWebhook.js";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "stickers.txt");
    const raw = readFileSync(filePath, "utf8");

    const links = raw
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (links.length === 0) {
      res.status(500).send("No stickers available");
      return;
    }

    // Pick a random sticker
    const random = links[Math.floor(Math.random() * links.length)];

    // Send to Discord webhook
    await sendToWebhook(random);

    // Return HTML showing the sticker
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Femboy Sticker of the Day</title>
        </head>
        <body style="display:flex;justify-content:center;align-items:center;height:100vh;background:#36393f;">
          <img src="${random}" alt="Sticker of the Day" style="max-width:90%; max-height:90%; border-radius:12px;">
        </body>
      </html>
    `);
    res.end();

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).send("Error loading sticker");
  }
}
