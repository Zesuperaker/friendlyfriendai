interface Window {
  ai?: {
    languageModel: {
      availability(): Promise<'readily' | 'downloadable' | 'unavailable'>
      create(options?: { systemPrompt?: string }): Promise<AILanguageModel>
    }
  }
}

interface AILanguageModel {
  prompt(input: string): Promise<string>
  promptStreaming(input: string): ReadableStream
  destroy(): void
}