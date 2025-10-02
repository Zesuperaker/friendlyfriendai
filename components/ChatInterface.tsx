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
  const [isInitializing, setIsInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize the Gemini session when component mounts
  useEffect(() => {
    const initSession = async () => {
      try {
        const newSession = await createGeminiSession()
        if (newSession) {
          setSession(newSession)
          console.log('Gemini session created successfully')
        } else {
          console.error('Failed to create Gemini session')
        }
      } catch (error) {
        console.error('Error initializing Gemini session:', error)
      } finally {
        setIsInitializing(false)
      }
    }

    initSession()
  }, [])

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

  const handleSendMessage = async (content: string) => {
    if (!session) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: 'AI session not initialized. Please refresh the page.',
        role: 'assistant'
      }
      setMessages(prev => [...prev, errorMessage])
      return
    }

    const userMessage: Message = { id: Date.now().toString(), content, role: 'user' }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Use the Gemini LanguageModel API
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

  if (isInitializing) {
    return (
      <div className="flex flex-col h-96 items-center justify-center">
        <div className="text-white text-lg">Initializing AI...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex flex-col h-96 items-center justify-center">
        <div className="text-white text-lg">Failed to initialize AI. Please refresh the page.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
      <InputArea onSend={handleSendMessage} disabled={isTyping} />
    </div>
  )
}