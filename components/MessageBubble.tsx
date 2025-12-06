'use client'

import { motion } from 'framer-motion'
import { Message } from '@/lib/types'
import ReactMarkdown from 'react-markdown'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white/20 text-white'
        }`}
      >
        <ReactMarkdown
          components={{
            // Paragraph styling
            p: ({ children }) => (
              <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
            ),
            // Bold text
            strong: ({ children }) => (
              <strong className="font-bold text-white">{children}</strong>
            ),
            // Italic text
            em: ({ children }) => (
              <em className="italic">{children}</em>
            ),
            // Unordered lists
            ul: ({ children }) => (
              <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
            ),
            // Ordered lists
            ol: ({ children }) => (
              <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
            ),
            // List items
            li: ({ children }) => (
              <li className="leading-relaxed">{children}</li>
            ),
            // Links
            a: ({ children, href }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/80 transition-colors"
              >
                {children}
              </a>
            ),
            // Code blocks
            code: ({ children, className }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                )
              }
              return (
                <code className="block bg-black/30 p-3 rounded-lg text-sm font-mono overflow-x-auto mb-2">
                  {children}
                </code>
              )
            },
            // Headings
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-bold mb-2 mt-3 first:mt-0">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-lg font-bold mb-2 mt-2 first:mt-0">{children}</h3>
            ),
            // Blockquotes
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-white/50 pl-4 italic my-2">
                {children}
              </blockquote>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </motion.div>
  )
}
