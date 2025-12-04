import { readFileSync } from "fs";
import path from "path";
import { sendToWebhook } from "./sendWebhook.js";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "stickers.txt");
    const text = readFileSync(filePath, "utf8");

    const links = text
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    const random = links[Math.floor(Math.random() * links.length)];

    // Send to your Discord webhook
    await sendToWebhook(random);

    // Return the URL (or embed it however your page works)
    res.status(200).json({ sticker: random });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading sticker");
  }
}
