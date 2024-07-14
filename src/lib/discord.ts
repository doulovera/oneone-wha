export const WEBHOOKS = {
  SUCCESS: process.env.DS_WEBHOOK_SUCCESS,
} as const

export async function sendWebhookMessage (webhook: typeof WEBHOOKS[keyof typeof WEBHOOKS], message: string) {
  try {
    return fetch(webhook!, {
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
