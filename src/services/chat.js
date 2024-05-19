import { getGemini } from '../lib/gemini.js'

export async function chat (message) {
  if (!message) {
    throw new Error('Message is required')
  }

  try {
    const { genAI } = getGemini(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const chat = model.startChat()

    const result = await chat.sendMessage(message)
    const response = result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error(error)
    return error.message
  }
}
