import { NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/ai-response'

/**
 * Photon iMessage Kit Integration
 * 
 * This endpoint receives messages from Photon iMessage Kit
 * and routes them to our existing AI system.
 * 
 * How it works:
 * 1. Farmer sends message via iMessage
 * 2. Photon forwards it to this endpoint
 * 3. We use existing ChatBot AI to generate response
 * 4. Response goes back to farmer's iMessage
 */

/**
 * POST /api/imessage
 * 
 * Receives messages from Photon iMessage Kit
 * Supports multiple request formats for compatibility:
 * 
 * Format 1 (Photon standard):
 * {
 *   message: string,
 *   userId: string,
 *   phoneNumber?: string
 * }
 * 
 * Format 2 (Alternative):
 * {
 *   text: string,
 *   user: string,
 *   phone?: string
 * }
 * 
 * Format 3 (Photon webhook):
 * {
 *   body: string,
 *   from: string,
 *   conversationId?: string
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Support multiple request formats
    let message: string | undefined
    let userId: string | undefined
    let phoneNumber: string | undefined
    
    // Try different formats
    if (body.message) {
      message = body.message
      userId = body.userId || body.user
      phoneNumber = body.phoneNumber || body.phone
    } else if (body.text) {
      message = body.text
      userId = body.userId || body.user
      phoneNumber = body.phoneNumber || body.phone
    } else if (body.body) {
      message = body.body
      userId = body.from || body.userId || body.user
      phoneNumber = body.phoneNumber || body.phone
    } else if (typeof body === 'string') {
      // Handle plain string body
      message = body
    }

    // Validate input
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required. Supported formats: {message: string}, {text: string}, or {body: string}' },
        { status: 400 }
      )
    }

    const userIdentifier = userId || phoneNumber || 'unknown'
    console.log(`[iMessage] Received from ${userIdentifier}: ${message}`)

    // Generate AI response using shared function
    // This ensures consistency across web, iMessage, and voice interfaces
    const response = await generateAIResponse(message, userId)

    // Format response for iMessage
    // Photon iMessage Kit expects:
    // {
    //   text: string,
    //   actions?: Array<{ type: string, label: string, url: string }>
    // }
    return NextResponse.json({
      text: response.text,
      actions: response.actions || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[iMessage] Error processing message:', error)
    return NextResponse.json(
      {
        error: 'Failed to process message',
        text: "I'm sorry, I encountered an error processing your message. Please try again or visit the dashboard for more information.",
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/imessage
 * 
 * Health check endpoint for Photon iMessage Kit
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'FarmWise iMessage Integration',
    version: '1.0.0',
    message: 'FarmWise AI assistant is ready to help!',
  })
}
