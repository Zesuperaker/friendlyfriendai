export async function generateResponse(prompt: string): Promise<string> {
  if ('ai' in window && 'languageModel' in (window as any).ai) {
    const { available } = await (window as any).ai.languageModel.capabilities();
    if (available !== 'no') {
      const session = await (window as any).ai.languageModel.create();
      try {
        const result = await session.prompt(prompt);
        return result;
      } catch (error) {
        throw new Error('Failed to generate response from Chrome AI');
      }
    } else {
      throw new Error('Chrome Prompt API not supported in this browser');
    }
  } else {
    throw new Error('Chrome Prompt API not supported in this browser');
  }
}