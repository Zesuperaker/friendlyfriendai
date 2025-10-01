import { NextRequest, NextResponse } from 'next/server'

// This route is a placeholder as the Chrome Prompt API is client-side.
// In a real implementation, if server-side processing is needed, it could be added here.
// For now, it returns a simple response.

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { message } = body

  // Placeholder logic - in reality, this would not be used for Chrome API
  return NextResponse.json({ response: 'This is a server response placeholder.' })
}
