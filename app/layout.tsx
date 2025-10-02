import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Friendly Friend AI',
  description: 'A calming AI chat for therapy and friendship',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 min-h-screen">
        {children}
      </body>
    </html>
  )
}
