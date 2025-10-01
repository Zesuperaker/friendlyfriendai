// Wrapper for Chrome Prompt API
// Note: This API is experimental and requires Chrome Canary/Dev with AI features enabled.

export async function generateResponse(prompt: string): Promise<string> {
  if (typeof window !== 'undefined' && 'ai' in window.chrome) {
    try {
      // Assuming the API structure based on Chrome docs
      const session = await window.ai.languageModel.create()
      const result = await session.prompt(prompt)
      const result = await session.prompt(prompt)
      return result
    } catch (error) {
      throw new Error('Failed to generate response from Chrome AI')
    }
  } else {
    throw new Error('Chrome Prompt API not supported in this browser')
  }
}
