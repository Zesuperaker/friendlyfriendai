'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble'
import InputArea from './InputArea'
import { Message } from '@/lib/types'

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
    const userMessage: Message = { id: Date.now().toString(), content, role: 'user' }
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Call Chrome Prompt API
      const response = await import('@/lib/promptApi').then(mod => mod.generateResponse(content))
      const aiMessage: Message = { id: (Date.now() + 1).toString(), content: response, role: 'assistant' }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = { id: (Date.now() + 1).toString(), content: 'Sorry, I encountered an error. Please try again.', role: 'assistant' }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
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
