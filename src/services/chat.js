import { sendWebhookMessage, WEBHOOKS } from '../lib/discord.js'
import { getGemini } from '../lib/gemini.js'

const { model } = getGemini(process.env.GOOGLE_AI_API_KEY)

export async function chat (userMessage) {
  if (!userMessage) {
    throw new Error('Message is required')
  }

  try {
    // const chat = model.startChat()
    // const result = await chat.sendMessage(userMessage)

    const result = await model.generateContent(userMessage)
    const response = result.response
    const message = response.text()

    return { success: true, message }
  } catch (error) {
    console.error(error)
    await sendWebhookMessage(WEBHOOKS.SUCCESS, `Failed to process chat: \`\`\`${error}\`\`\``)
    const message = 'Sorry, I am unable to process your request at the moment. Please try again later.'
    return { success: false, message }
  }
}
