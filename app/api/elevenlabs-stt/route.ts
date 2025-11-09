import { NextResponse } from 'next/server'

// ElevenLabs Speech-to-Text API endpoint
// Converts audio (voice input) to text
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // Get ElevenLabs API key from environment
    const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || ''
    const ELEVENLABS_STT_URL = 'https://api.elevenlabs.io/v1/speech-to-text'

    if (!ELEVENLABS_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'ELEVENLABS_API_KEY not set',
        note: 'Using Web Speech API fallback. Add ELEVENLABS_API_KEY to enable ElevenLabs speech-to-text.',
      }, { status: 200 })
    }

    // Convert File to Blob
    const audioBlob = await audioFile.arrayBuffer()
    
    // Create FormData for ElevenLabs API
    const formDataForElevenLabs = new FormData()
    formDataForElevenLabs.append('file', new Blob([audioBlob], { type: audioFile.type }), audioFile.name)

    // Make API call to ElevenLabs Speech-to-Text
    try {
      const response = await fetch(ELEVENLABS_STT_URL, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: formDataForElevenLabs,
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          text: data.text || data.transcription || '',
        })
      } else {
        const errorText = await response.text()
        console.error('ElevenLabs STT API error:', response.status, errorText)
        return NextResponse.json(
          { 
            success: false,
            error: 'ElevenLabs STT API call failed',
            status: response.status,
            details: errorText,
          },
          { status: response.status }
        )
      }
    } catch (error) {
      console.error('ElevenLabs STT fetch error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to connect to ElevenLabs STT API',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('ElevenLabs STT API error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

