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

    const random = links[Math.floor(Math.random() * links.length)];

    // send to webhook
    await sendToWebhook(random);

    // show the sticker like normal
    res.status(200).json({ sticker: random });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).send("Error loading sticker");
  }
}
