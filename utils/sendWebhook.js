export async function sendToWebhook(stickerUrl) {
  try {
    const webhook = process.env.WEBHOOK_URL;
    if (!webhook) {
      console.error("WEBHOOK_URL is not set");
      return;
    }

    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: stickerUrl
      })
    });
  } catch (err) {
    console.error("Error sending to webhook:", err);
  }
}
