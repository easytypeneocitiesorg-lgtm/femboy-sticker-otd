import { readFileSync } from "fs";
import path from "path";
import { sendToWebhook } from "../utils/sendWebhook.js"; // fixed path

export default async function handler(req, res) {
  try {
    // Read stickers.txt from root
    let raw = "";
    try {
      raw = readFileSync(path.join(process.cwd(), "stickers.txt"), "utf8");
    } catch (e) {
      console.error("Could not read stickers.txt:", e);
      res.status(500).send("Error reading stickers.txt");
      return;
    }

    const links = raw.split(",").map(x => x.trim()).filter(Boolean);
    if (!links.length) {
      res.status(500).send("No stickers available");
      return;
    }

    const random = links[Math.floor(Math.random() * links.length)];

    // Send to webhook
    sendToWebhook({ sticker: random }).catch(console.error);

    // Return HTML
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Femboy Sticker of the Day</title>
          <style>
            body { 
              background:#36393f; 
              color:white; 
              font-family:sans-serif; 
              display:flex; 
              justify-content:center; 
              align-items:center; 
              min-height:100vh; 
              margin:0; 
              flex-direction:column; 
            }
            #surveyBtn, #soundsBtn { 
              position: fixed; 
              top: 20px; 
              left: 20px; 
              padding: 12px 20px; 
              font-size: 16px; 
              cursor: pointer; 
              border: none; 
              border-radius: 8px; 
            }
            #surveyBtn { background:#f5aee0; }
            #soundsBtn { 
              background:#a1d8f5; 
              top: 70px; /* slightly below the survey button */
            }
            img { max-width:90%; max-height:90%; border-radius:12px; }
          </style>
        </head>
        <body>
          <button id="surveyBtn" onclick="window.location.href='/survey.html'">Open Survey</button>
          <button id="soundsBtn" onclick="openSounds()">Open Sounds</button>
          <img src="${random}" alt="Sticker of the Day">

          <script>
            function openSounds() {
              const newTab = window.open('https://femboy-sticker-otd.vercel.app/sounds.html', '_blank');
              if (newTab) newTab.focus();
            }
          </script>
        </body>
      </html>
    `);

  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).send("Internal server error");
  }
}
