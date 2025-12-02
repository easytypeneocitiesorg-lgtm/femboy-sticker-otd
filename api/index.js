import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Paths to the files
    const stickersPath = path.join(process.cwd(), "stickers.txt");
    const fridayPath = path.join(process.cwd(), "friday.txt");

    // Read and parse stickers
    const stickersText = readFileSync(stickersPath, "utf8");
    const stickers = stickersText
      .split(",")
      .map(x => x.trim())
      .filter(Boolean);

    let links = [...stickers]; // default list

    // Check if today is Friday (0 = Sunday, 5 = Friday)
    const today = new Date();
    if (today.getDay() === 5) {
      // Read and parse friday.txt
      const fridayText = readFileSync(fridayPath, "utf8");
      const fridayLinks = fridayText
        .split(",")
        .map(x => x.trim())
        .filter(Boolean);

      // Merge Friday stickers into the pool
      links = [...links, ...fridayLinks];
    }

    if (links.length === 0) {
      res.status(500).send("No stickers available");
      return;
    }

    // Pick a random sticker
    const random = links[Math.floor(Math.random() * links.length)];

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <html>
        <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
          <img src="${random}" fetchpriority="high" loading="eager" style="max-width:100%; max-height:100%;">
        </body>
      </html>
    `);

  } catch (err) {
    res.status(500).send("Error reading sticker files");
  }
}
