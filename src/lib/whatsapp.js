const WHA_NUMBER_ID = process.env.WHA_NUMBER_ID
const WHA_TOKEN = process.env.WHA_TOKEN

const fbVersion = 'v19.0'
const url = `https://graph.facebook.com/${fbVersion}/${WHA_NUMBER_ID}/messages`

// const MessageType = {
//   TEMPLATE: 'template',
//   TEXT: 'text',
// }

export const sendMessage = async ({ to, replyInfo, message }) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${WHA_TOKEN}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      // type: MessageType.TEXT,
      context: {
        message_id: replyInfo.id,
      },
      text: {
        body: message,
      },
    }),
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }
}
