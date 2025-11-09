import { NextResponse } from 'next/server'

// Create Knot session for SDK initialization
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { external_user_id } = body

    // Knot API credentials (dev environment)
    const KNOT_CLIENT_ID = 'dda0778d-9486-47f8-bd80-6f2512f9bcdb'
    const KNOT_SECRET = 'ff5e51b6dcf84a829898d37449cbc47a'
    const KNOT_SESSION_URL = 'https://development.knotapi.com/session/create'
    
    // Create Basic Auth header
    const authString = Buffer.from(`${KNOT_CLIENT_ID}:${KNOT_SECRET}`).toString('base64')
    
    const response = await fetch(KNOT_SESSION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        external_user_id: external_user_id || 'farmer-123',
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({
        session_id: data.session_id,
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

