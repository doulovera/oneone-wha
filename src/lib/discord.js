export const WEBHOOKS = {
  SUCCESS: process.env.DS_WEBHOOK_SUCCESS,
}

export async function sendWebhookMessage (webhook, message) {
  try {
    return fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: message }),
    })
  } catch (error) {
    console.error(error)
  }
}
