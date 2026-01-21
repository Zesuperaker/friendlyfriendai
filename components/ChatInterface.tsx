'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'
import { Message } from '@/lib/types'
import { createGeminiSession, promptSession, type Session } from '@/lib/gemini'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load saved messages on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Initialize the Gemini session when user clicks button (USER GESTURE)
  const handleInitializeSession = async () => {
    setIsInitializing(true)
    setDownloadProgress(0)
    try {
      const newSession = await createGeminiSession({
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round((e.loaded * 100) / (1024 * 1024 * 22)) // Estimate based on ~22MB model
            setDownloadProgress(Math.min(progress, 99)) // Cap at 99% until complete
            console.log(`Downloaded ${progress}%`)
          })
        },
      })
      if (newSession) {
        setSession(newSession)
        setSessionReady(true)
        setDownloadProgress(100)
        console.log('✅ Gemini session created successfully')
      } else {
        console.error('Failed to create Gemini session')
      }
    } catch (error) {
      console.error('Error initializing Gemini session:', error)
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          console.error('User gesture required - please click the Initialize button')
        }
      }
    } finally {
      setIsInitializing(false)
    }
  }

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleClearChat = () => {
    if (messages.length > 0) {
      const confirmed = window.confirm('Are you sure you want to start a new chat? This will clear all messages.')
      if (confirmed) {
        setMessages([])
        localStorage.removeItem('chatMessages')
      }
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!session) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'AI session not initialized. Please click the Initialize button first.',
        role: 'assistant'
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const userMessage: Message = { id: Date.now().toString(), content, role: 'user' }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      const response = await promptSession(session, content)
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant'
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Show initialization screen if session not ready
  if (!sessionReady) {
    return (
      <div className="flex flex-col h-[600px] items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">👋 Friendly Friend AI</h2>
            <p className="text-white/60">Your private AI companion</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4"
          >
            <p className="text-white/80 text-sm leading-relaxed">
              Click below to download and initialize the google prompt AI model on your device.
            </p>

            {isInitializing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-white/70 font-medium">{downloadProgress}% downloaded...</p>
              </motion.div>
            )}

            <motion.button
              onClick={handleInitializeSession}
              disabled={isInitializing}
              whileHover={!isInitializing ? { scale: 1.02 } : {}}
              whileTap={!isInitializing ? { scale: 0.98 } : {}}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                isInitializing
                  ? 'bg-white/10 text-white/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {isInitializing ? 'Downloading...' : 'Initialize AI'}
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-white/50 space-y-2"
          >
            <p className="font-semibold text-white/60">Requirements:</p>
            <ul className="space-y-1 text-left">
              <li>✓ Chrome with experimental AI enabled</li>
              <li>✓ 22GB free storage</li>
            </ul>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Header with New Chat button */}
      {messages.length > 0 && (
        <div className="flex justify-end p-2 border-b border-white/20">
          <motion.button
            onClick={handleClearChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
            New Chat
          </motion.button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white/70">
              <p className="text-lg mb-2">👋 Hi! I&apos;m Friendly Friend AI</p>
              <p className="text-sm">Send a message to start chatting</p>
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map(message => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white"
          >
            AI is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <InputArea onSend={handleSendMessage} disabled={isTyping} />
    </div>
  )
}