import { GoogleGenerativeAI } from '@google/generative-ai'
import { GoogleAIFileManager } from '@google/generative-ai/files'

export const getGemini = (key) => {
  const genAI = new GoogleGenerativeAI(key)
  const fileManagerAI = new GoogleAIFileManager(key)

  return { genAI, fileManagerAI }
}
