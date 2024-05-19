import express from 'express'
import { chat } from './services/chat.js'
import { sendMessage } from './lib/whatsapp.js'

const app = express()
app.use(express.json())

const FB_VERIFICATION_TOKEN = process.env.FB_VERIFICATION_TOKEN

app.get('/ping', (req, res) => {
  return res.send(true)
})

app.get('/wha/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === FB_VERIFICATION_TOKEN) {
    res.status(200).send(challenge)
    console.log('Webhook verified successfully!')
  } else {
    res.sendStatus(403)
  }
})

app.post('/wha/webhook', async (req, res) => {
  try {
    // console.log('Incoming webhook message:', JSON.stringify(req.body, null, 2))

    const senderMessage = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0]

    const message = senderMessage?.text?.body
    const messageId = senderMessage?.id
    const senderNumber = senderMessage?.from

    console.log('Incoming message:', message)

    if (message && message.length > 10) {
      const response = await chat(message)
      console.log('Response:', response)

      await sendMessage({
        to: senderNumber,
        replyInfo: { id: messageId },
        message: response,
      })
    }

    return res.sendStatus(200)
  } catch (error) {
    // return res.status(500).send(error.message)
    console.error(error)
    return res.sendStatus(500)
  }
})

app.listen(3000, () => {
  console.log('One-One WHA | Server running on port 3000')
})
