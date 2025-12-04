export async function sendToWebhook(data) {
  try {
    const webhook = process.env.WEBHOOK_URL;
    if (!webhook) {
      console.error("WEBHOOK_URL is not set");
      return;
    }

    await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error("Error sending to webhook:", err);
  }
}
