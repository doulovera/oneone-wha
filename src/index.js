import express from 'express'
import { chat } from './services/chat.js'
import { sendMessage } from './lib/whatsapp.js'
import logOnPetition from './middlewares/log-on-petition.js'
import { sendWebhookMessage, WEBHOOKS } from './lib/discord.js'

const app = express()
app.use(express.json())
app.use(logOnPetition)

const FB_VERIFICATION_TOKEN = process.env.FB_VERIFICATION_TOKEN

app.get('/', (req, res) => {
  return res.json({ res: 'One-One WHA | Server running' })
})

app.get('/ping', async (req, res) => {
  await sendWebhookMessage(WEBHOOKS.SUCCESS, 'Webhook verified successfully!')
  return res.send(true)
})

app.get('/wha/webhook', async (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === FB_VERIFICATION_TOKEN) {
    res.status(200).send(challenge)
    console.log('Webhook verified successfully!')
    await sendWebhookMessage(WEBHOOKS.SUCCESS, 'Webhook verified successfully!')
  } else {
    res.sendStatus(403)
  }
})

app.post('/wha/webhook', async (req, res) => {
  try {
    const { messages } = req.body.entry?.[0]?.changes[0]?.value

    if (!messages) {
      console.log(req.body)
      return res.sendStatus(200)
    }

    const [senderMessage] = messages || []

    const userMessage = senderMessage?.text?.body
    const messageId = senderMessage?.id
    const senderNumber = senderMessage?.from

    console.log('Incoming message:', userMessage)

    const { success, message } = await chat(userMessage)

    if (!success) {
      await sendMessage({
        to: senderNumber,
        replyInfo: { id: messageId },
        message,
      })

      return res.sendStatus(200)
    }

    console.log('Response:', message)

    await sendMessage({
      to: senderNumber,
      replyInfo: { id: messageId },
      message,
    })

    return res.sendStatus(200)
  } catch (error) {
    console.error(error.error)
    return res.sendStatus(500)
  }
})

app.listen(3000, () => {
  console.log('One-One WHA | Server running on port 3000')
})
