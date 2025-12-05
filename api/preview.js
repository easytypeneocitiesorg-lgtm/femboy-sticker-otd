import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // read mood from query (?mood=blush)
    const mood = req.query.mood ? req.query.mood.toLowerCase() : null;

    // decide which file to load
    // if mood is provided → stickers_mood.txt
    // otherwise → stickers.txt
    const fileName = mood ? `stickers_${mood}.txt` : "stickers.txt";
    const filePath = path.join(process.cwd(), fileName);

    let text = "";

    try {
      text = readFileSync(filePath, "utf8");
    } catch (err) {
      // mood doesn't exist → fallback to normal stickers.txt
      if (mood) {
        const fallbackPath = path.join(process.cwd(), "stickers.txt");
        try {
          text = readFileSync(fallbackPath, "utf8");
        } catch (e) {
          res.status(500).send("Error reading sticker files");
          return;
        }
      } else {
        res.status(500).send("Error reading stickers.txt");
        return;
      }
    }

    // Split the chosen file into URLs
    const links = text
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    if (!links.length) {
      res.status(500).send("No stickers available");
      return;
    }

    // Pick a random sticker
    const random = links[Math.floor(Math.random() * links.length)];

    // prevent Discord from caching same redirect
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    // redirect to the sticker URL
    res.writeHead(302, { Location: random });
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send("Internal error");
  }
}
