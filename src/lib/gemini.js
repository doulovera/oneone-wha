import { GoogleGenerativeAI } from '@google/generative-ai'
// import { GoogleAIFileManager } from '@google/generative-ai/files'

// const GEMINI_MODEL = 'gemini-1.5-flash'
const GEMINI_MODEL = 'gemini-1.0-pro-001'

export const getGemini = (key) => {
  const genAI = new GoogleGenerativeAI(key)
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

  // const fileManagerAI = new GoogleAIFileManager(key)

  return {
    model,
    // fileManagerAI
  }
}
