// Interfaces for TypeScript support of the experimental LanguageModel API
// These are approximations based on the Web API; actual types may evolve

export interface Prompt {
    role: 'system' | 'user' | 'assistant';
    content: string;
    prefix?: boolean;
  }

  export interface CreateOptions {
    initialPrompts?: Prompt[];
    temperature?: number;
    topK?: number;
    signal?: AbortSignal;
    monitor?: (model: Model) => void;
    expectedInputs?: ExpectedInput[];
    expectedOutputs?: ExpectedOutput[];
    outputLanguage?: string;
  }

  export interface ExpectedInput {
    type: 'text' | 'image' | 'audio';
    languages: string[];
  }

  export interface ExpectedOutput {
    type: 'text';
    languages: string[];
  }

  export interface Params {
    defaultTopK: number;
    maxTopK: number;
    defaultTemperature: number;
    maxTemperature: number;
  }

  export interface PromptOptions {
    responseConstraint?: object; // JSON Schema for structured output
    omitResponseConstraintInput?: boolean;
    signal?: AbortSignal;
  }

  export interface ModelEvent extends Event {
    loaded: number;
  }

  export interface Model {
    addEventListener(type: 'downloadprogress', listener: (e: ModelEvent) => void): void;
  }

  export type Availability = 'unavailable' | 'downloadable' | 'downloading';
  export type Session = {
    prompt(messages: string | Prompt[], options?: PromptOptions): Promise<string>;
    promptStreaming(messages: string | Prompt[], options?: PromptOptions): ReadableStream<string>;
    append(prompts: Prompt[]): Promise<void>;
    clone(options?: { signal?: AbortSignal }): Promise<Session>;
    destroy(): Promise<void>;
    readonly inputUsage: number;
    readonly inputQuota: number;
  };

  // Global declaration for the experimental API (not yet in lib.dom.d.ts)
  declare global {
    interface Window {
      LanguageModel: {
        availability(options?: { expectedInputs?: ExpectedInput[]; expectedOutputs?: ExpectedOutput[] }): Promise<Availability>;
        params(): Promise<Params>;
        create(options?: CreateOptions): Promise<Session>;
      };
    }
  }

  if (typeof window !== 'undefined') {
    // Ensure API is accessible; fallback if not supported
    (window as any).LanguageModel = (window as any).LanguageModel || null;
  }

  export async function checkAvailability(): Promise<Availability> {
    if (typeof window === 'undefined') {
      return 'unavailable';
    }
    try {
      const languageModel = (window as any).LanguageModel;
      if (!languageModel || typeof languageModel.availability !== 'function') {
        return 'unavailable';
      }
      return await languageModel.availability();
    } catch (error) {
      console.error('Availability check failed:', error);
      return 'unavailable';
    }
  }

  export async function getParams(): Promise<Params> {
    if (typeof window === 'undefined') {
      throw new Error('Cannot get params server-side');
    }
    try {
      const languageModel = (window as any).LanguageModel;
      if (!languageModel || typeof languageModel.params !== 'function') {
        throw new Error('LanguageModel API not available');
      }
      const params = await languageModel.params();
      return params;
    } catch (error) {
      console.error('Params retrieval failed:', error);
      throw error;
    }
  }

  export async function createGeminiSession(options: Partial<CreateOptions> = {}): Promise<Session | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      const params = await getParams();
      const fullOptions: CreateOptions = {
        outputLanguage: 'en',
        initialPrompts: [
          {
            role: 'system',
            content: 'You are a friendly and helpful AI therapist. Respond empathetically, supportively, and professionally to help users with their feelings and thoughts. If and only if the user says anything about self harm tell them to seek professional help immediately. ou can use markdown formatting like *italic* for emphasis, **bold** for strong emphasis, and other markdown features when appropriate.',
          },
        ],
        temperature: Math.min(params.defaultTemperature * 0.8, params.maxTemperature), // Slightly lower for consistent, empathetic responses
        topK: params.defaultTopK,
        ...options,
      };
      const languageModel = (window as any).LanguageModel;
      if (!languageModel || typeof languageModel.create !== 'function') {
        throw new Error('LanguageModel API not available');
      }
      const session = await languageModel.create(fullOptions);
      return session;
    } catch (error) {
      console.error('Session creation failed:', error);
      // Handle specific errors like NotSupportedError or download issues
      if (error instanceof DOMException && error.name === 'NotSupportedError') {
        console.error('Model not supported on this device/browser');
      }
      return null;
    }
  }

  export async function promptSession(session: Session, message: string, options?: PromptOptions): Promise<string> {
    try {
      const result = await session.prompt([{ role: 'user', content: message }], options);
      return result;
    } catch (error) {
      console.error('Prompt failed:', error);
      throw error;
    }
  }

  export function streamSession(session: Session, message: string, options?: PromptOptions): ReadableStream<string> {
    try {
      const stream = session.promptStreaming([{ role: 'user', content: message }], options);
      return stream;
    } catch (error) {
      console.error('Streaming prompt failed:', error);
      throw error;
    }
  }

  export async function appendToSession(session: Session, prompts: Prompt[]): Promise<void> {
    try {
      await session.append(prompts);
    } catch (error) {
      console.error('Append failed:', error);
      throw error;
    }
  }

  export async function cloneSession(session: Session, options?: { signal?: AbortSignal }): Promise<Session> {
    try {
      const cloned = await session.clone(options);
      return cloned;
    } catch (error) {
      console.error('Clone failed:', error);
      throw error;
    }
  }

  export async function destroySession(session: Session): Promise<void> {
    try {
      await session.destroy();
    } catch (error) {
      console.error('Destroy session failed:', error);
    }
  }