import { readFileSync } from "fs";
import path from "path";
import { sendToWebhook } from "./sendWebhook.js";

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), "stickers.txt");
    const raw = readFileSync(filePath, "utf8");

    const links = raw.split(",").map(x => x.trim()).filter(Boolean);
    if (!links.length) {
      res.status(500).send("No stickers available");
      return;
    }

    // Random sticker
    const random = links[Math.floor(Math.random() * links.length)];

    // Send to webhook
    sendToWebhook({ sticker: random }).catch(console.error);

    // Return HTML
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Femboy Sticker of the Day</title>
          <style>
            body { background:#36393f; color:white; font-family:sans-serif; display:flex; justify-content:center; align-items:center; min-height:100vh; margin:0; flex-direction:column; }
            #surveyBtn { position: fixed; top:20px; left:20px; padding:12px 20px; font-size:16px; cursor:pointer; background:#ff77ff; border:none; border-radius:8px; }
            img { max-width:90%; max-height:90%; border-radius:12px; }
          </style>
        </head>
        <body>
          <button id="surveyBtn">Take Femboy Survey</button>
          <img id="sticker" src="${random}" alt="Sticker of the Day">
          <script>
            document.getElementById("surveyBtn").onclick = () => {
              window.location.href = "/survey.html";
            };
          </script>
        </body>
      </html>
    `);
    res.end();

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).send("Error loading sticker");
  }
}
