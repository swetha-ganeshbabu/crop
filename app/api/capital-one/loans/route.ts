import { NextResponse } from 'next/server'

// Capital One Nessie API - Loan Management
// Creates and retrieves loans using the proper loan endpoints

const NESSIE_API_BASE = 'http://api.nessieisreal.com'

// Create a loan
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { accountId, type, amount, monthlyPayment, creditScore, description } = body

    const CAPITAL_ONE_API_KEY = process.env.CAPITAL_ONE_API_KEY || ''

    if (!CAPITAL_ONE_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'CAPITAL_ONE_API_KEY not set',
        note: 'Add your Capital One Nessie API key to .env.local',
      }, { status: 400 })
    }

    if (!accountId) {
      return NextResponse.json({
        success: false,
        error: 'accountId is required',
      }, { status: 400 })
    }

    // Create loan payload according to Nessie API documentation
    const loanPayload = {
      type: type || 'home',
      status: 'pending',
      credit_score: creditScore || 687,
      monthly_payment: monthlyPayment || Math.round(amount / 60), // Default 5-year loan
      amount: amount || 0,
      description: description || 'Farm loan application',
    }

    const url = `${NESSIE_API_BASE}/accounts/${accountId}/loans?key=${CAPITAL_ONE_API_KEY}`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanPayload),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          loan: data.objectCreated || data,
          loanId: data.objectCreated?._id || data._id,
          message: 'Loan created successfully',
        })
      } else {
        const errorText = await response.text()
        console.error('Capital One Loan API error:', response.status, errorText)
        return NextResponse.json({
          success: false,
          error: 'Failed to create loan',
          details: errorText,
          status: response.status,
        }, { status: response.status })
      }
    } catch (error) {
      console.error('Capital One API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Capital One API',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Capital One loan route error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Get all loans for an account
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('accountId')
    const loanId = searchParams.get('loanId')
    const CAPITAL_ONE_API_KEY = process.env.CAPITAL_ONE_API_KEY || ''

    if (!CAPITAL_ONE_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'CAPITAL_ONE_API_KEY not set',
      }, { status: 400 })
    }

    // Get specific loan by ID
    if (loanId) {
      const url = `${NESSIE_API_BASE}/loans/${loanId}?key=${CAPITAL_ONE_API_KEY}`
      
      try {
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          return NextResponse.json({
            success: true,
            loan: data,
          })
        } else {
          return NextResponse.json({
            success: false,
            error: 'Failed to fetch loan',
          }, { status: response.status })
        }
      } catch (error) {
        console.error('Capital One API error:', error)
        return NextResponse.json({
          success: false,
          error: 'Failed to connect to Capital One API',
        }, { status: 500 })
      }
    }

    // Get all loans for an account
    if (!accountId) {
      return NextResponse.json({
        success: false,
        error: 'accountId or loanId is required',
      }, { status: 400 })
    }

    const url = `${NESSIE_API_BASE}/accounts/${accountId}/loans?key=${CAPITAL_ONE_API_KEY}`

    try {
      const response = await fetch(url)
      
      if (response.ok) {
        const data = await response.json()
        return NextResponse.json({
          success: true,
          loans: Array.isArray(data) ? data : [data],
        })
      } else {
        return NextResponse.json({
          success: false,
          error: 'Failed to fetch loans',
        }, { status: response.status })
      }
    } catch (error) {
      console.error('Capital One API error:', error)
      return NextResponse.json({
        success: false,
        error: 'Failed to connect to Capital One API',
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Capital One loan route error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

