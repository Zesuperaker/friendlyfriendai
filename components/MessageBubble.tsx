import { motion } from 'framer-motion'
import { Message } from '@/lib/types'

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs px-4 py-2 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white/20 text-white backdrop-blur-sm'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  )
}
