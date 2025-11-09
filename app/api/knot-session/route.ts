import { NextResponse } from 'next/server'
import { KNOT_CONFIG } from '@/lib/knot-config'

// Create Knot session for SDK initialization
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { external_user_id } = body
    
    const response = await fetch(KNOT_CONFIG.SESSION_URL, {
      method: 'POST',
      headers: {
        'Authorization': KNOT_CONFIG.getAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_user_id: external_user_id || 'farmer-123',
        type: 'transaction_link', // Required field for Knot API
      }),
    })

    if (response.ok) {
      const data = await response.json()
      // Knot API returns session_id as "session" field
      const sessionId = data.session || data.session_id || data.data?.session_id || data.id
      return NextResponse.json({
        session_id: sessionId,
        success: true,
      })
    } else {
      const errorText = await response.text()
      console.error('Knot session creation failed:', errorText)
      return NextResponse.json(
        { error: 'Failed to create session', details: errorText },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Knot session error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

