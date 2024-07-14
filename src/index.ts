import express from 'express'
import { chat } from './services/chat'
import { sendMessage } from './lib/whatsapp'
import logOnPetition from './middlewares/log-on-petition'
import { sendWebhookMessage, WEBHOOKS } from './lib/discord'
import { PORT } from './constants/config'

const app = express()
app.use(express.json())
app.use(logOnPetition)

const FB_VERIFICATION_TOKEN = process.env.FB_VERIFICATION_TOKEN

app.get('/', (req: any, res: any) => {
  return res.json({ res: 'One-One WHA | Server running' })
})

app.get('/ping', async (req: any, res: any) => {
  return res.send({ ok: true })
})

app.get('/wha/webhook', async (req: any, res: any) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === FB_VERIFICATION_TOKEN) {
    res.status(200).send(challenge)
    console.log('Webhook verified successfully!')
    await sendWebhookMessage(
      WEBHOOKS.SUCCESS,
      'Webhook verified successfully!',
    )
  } else {
    res.sendStatus(403)
  }
})

app.post('/wha/webhook', async (req: any, res: any) => {
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

    const { message } = await chat(userMessage)

    console.log('Response:', message)

    await sendMessage({
      to: senderNumber,
      replyInfo: { id: messageId },
      message,
    })

    return res.sendStatus(200)
  } catch (error) {
    console.error((error as any).error)
    return res.sendStatus(500)
  }
})

app.listen(PORT, () => {
  console.log(`One-One WHA | Server running on port ${PORT}`)
})
