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
    res.status(500).send("Error reading stickers.txt");
  }
}
