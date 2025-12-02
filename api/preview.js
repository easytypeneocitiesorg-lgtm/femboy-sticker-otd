import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Path to stickers.txt
    const filePath = path.join(process.cwd(), "stickers.txt");

    // Read file fresh on each request
    const text = readFileSync(filePath, "utf8");

    // Split by comma, trim whitespace, remove empty entries
    const links = text
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (!links.length) {
      res.status(500).send("No stickers available");
      return;
    }

    // Pick a random sticker each request
    const randomIndex = Math.floor(Math.random() * links.length);
    const random = links[randomIndex];

    // Disable caching to avoid same redirect showing repeatedly
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // Redirect to the chosen sticker
    res.writeHead(302, { Location: random });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Error reading stickers.txt");
  }
}
