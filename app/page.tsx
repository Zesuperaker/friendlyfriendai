import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6">
        <h1 className="text-3xl font-bold text-white text-center mb-6">AI Therapist Friend</h1>
        <ChatInterface />
      </div>
    </main>
  )
}
