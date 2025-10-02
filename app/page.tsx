import ChatInterface from '@/components/ChatInterface'

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6">
        <h1 className="text-4xl font-extrabold text-white text-center mb-2">
          Free, Open Source and Private
        </h1>
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Friendly Friend AI
        </h2>
        <ChatInterface />
        <div className="mt-6 text-xs text-center text-white/80">
          <strong>Disclaimer:</strong> Friendly Friend AI does not provide professional help. Please reach out to a healthcare professional for actual therapy and help.
        </div>
      </div>
    </main>
  )
}
