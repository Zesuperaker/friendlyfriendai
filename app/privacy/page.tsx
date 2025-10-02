import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <Link
          href="/"
          className="inline-block mb-6 text-white hover:text-white/80 transition-colors"
        >
          ← Back to Home
        </Link>

        <article className="text-white space-y-6">
          <h1 className="text-4xl font-extrabold mb-2">Privacy Policy</h1>
          <p className="text-white/80 text-sm">Last Updated: October 2025</p>

          <section>
            <h2 className="text-2xl font-bold mb-3">We Don't Collect Your Data</h2>
            <p className="text-white/90">
              Your conversations happen entirely in your browser using Google's Gemini Nano AI.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Where Your Data Lives</h2>
            <ul className="list-disc list-inside space-y-2 text-white/90">
              <li>Your chat history is stored only in your browser's local storage</li>
              <li>You can delete it anytime with the "New Chat" button</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Third Parties</h2>
            <ul className="list-disc list-inside space-y-2 text-white/90">
              <li><strong>Vercel:</strong> May collect basic web analytics (page views, general location)</li>
              <li><strong>Google Gemini Nano:</strong> Runs locally in your Chrome browser</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Not Medical Advice</h2>
            <p className="text-white/90">
              This is not professional therapy or medical advice. If you need help, contact a healthcare
              professional or crisis hotline.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3">Questions?</h2>
            <p className="text-white/90">
              This is open source project. View our code on{' '}
              <a
                href="https://github.com/Zesuperaker/friendlyfriendai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                GitHub
              </a>.
            </p>
          </section>

          <div className="mt-8 p-4 bg-white/10 rounded-lg border border-white/20">
            <p className="font-bold">TL;DR:</p>
            <p className="text-white/90 mt-1">
              Everything happens on your device. We don't collect, store, or see your conversation data and for extra privacy you can run this websites code locally by pulling it from our github repo.
            </p>
          </div>
        </article>
      </div>
    </main>
  )
}