import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "stickers.txt");
    const text = readFileSync(filePath, "utf8");

    const links = text
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (links.length === 0) {
      res.status(500).send("No stickers available");
      return;
    }

    // Pick a random sticker
    const random = links[Math.floor(Math.random() * links.length)];

    // Redirect to the GIF/image
    res.writeHead(302, { Location: random });
    res.end();
  } catch (err) {
    res.status(500).send("Error reading stickers.txt");
  }
}
