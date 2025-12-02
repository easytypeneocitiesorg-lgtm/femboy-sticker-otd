import { readFileSync } from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Path to stickers.txt inside your repo
    const filePath = path.join(process.cwd(), "stickers.txt");
    const text = readFileSync(filePath, "utf8");

    const links = text
      .split(",")
      .map(x => x.trim())
      .filter(x => x.length > 0);

    if (links.length === 0) {
      res.status(500).send("No GIFs found in stickers.txt");
      return;
    }

    const random = links[Math.floor(Math.random() * links.length)];

    res.setHeader("Content-Type", "text/html");
    res.send(`
      <html>
        <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; height:100vh;">
          <img src="${random}" style="max-width:100%; max-height:100%;">
        </body>
      </html>
    `);

  } catch (err) {
    res.status(500).send("Error reading stickers.txt");
  }
}
