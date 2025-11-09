import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'

// Amazon Nova Act - Browser Automation AI for Price Scraping
// This uses Amazon Nova to scrape consumer prices from e-commerce sites
// For hackathon: Uses intelligent mock data that simulates real price scraping
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productName, category } = body

    // Support both AMAZON_NOVA_API_KEY and NOVA_ACT_API_KEY
    const NOVA_ACT_API_KEY = process.env.AMAZON_NOVA_API_KEY || process.env.NOVA_ACT_API_KEY || ''

    // If Amazon Nova Act API key is provided, try to use Python script
    if (NOVA_ACT_API_KEY) {
      try {
        const pythonScript = join(process.cwd(), 'nova_act_scraper.py')
        
        // Check if Python script exists
        if (existsSync(pythonScript)) {
          // Run Python script with Nova Act
          const result = await runPythonScript(pythonScript, { productName, category }, NOVA_ACT_API_KEY)
          
          if (result && result.success) {
            return NextResponse.json({
              success: true,
              source: 'Amazon Nova Act',
              prices: result.prices || [],
              averagePrice: result.averagePrice,
              lowestPrice: result.lowestPrice,
              highestPrice: result.highestPrice,
              timestamp: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        console.error('Amazon Nova Act error:', error)
        // Fall through to mock data
      }
    }

    // Fallback: Intelligent mock price data that simulates real scraping
    const mockPrices = generateIntelligentMockPrices(productName, category)
    const prices = mockPrices.map(p => p.price)
    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length
    const lowestPrice = Math.min(...prices)
    const highestPrice = Math.max(...prices)

    return NextResponse.json({
      success: true,
      source: NOVA_ACT_API_KEY ? 'Mock (Amazon Nova unavailable)' : 'Mock (Amazon Nova not configured)',
      prices: mockPrices,
      averagePrice: Math.round(averagePrice * 100) / 100,
      lowestPrice,
      highestPrice,
      timestamp: new Date().toISOString(),
      note: NOVA_ACT_API_KEY 
        ? 'Amazon Nova Act unavailable, using intelligent mock data'
        : 'Set NOVA_ACT_API_KEY for real price scraping',
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Intelligent mock price generator that creates realistic price variations
function generateIntelligentMockPrices(productName: string, category: string) {
  // Base prices by category (realistic market prices)
  const categoryBasePrices: Record<string, { base: number; variation: number }> = {
    fertilizer: { base: 45, variation: 15 },
    seeds: { base: 320, variation: 80 },
    equipment: { base: 1200, variation: 300 },
    crops: { base: 25, variation: 8 },
    other: { base: 50, variation: 15 },
  }

  const config = categoryBasePrices[category] || categoryBasePrices.other
  const basePrice = config.base
  const variation = config.variation

  // Generate realistic prices with variations across different retailers
  const sites = [
    { name: 'Amazon', multiplier: 1.15, rating: 4.5 },
    { name: 'Walmart', multiplier: 1.0, rating: 4.3 },
    { name: 'Home Depot', multiplier: 1.1, rating: 4.4 },
    { name: 'Lowe\'s', multiplier: 1.12, rating: 4.3 },
    { name: 'Tractor Supply', multiplier: 0.95, rating: 4.6 },
  ]

  return sites.map(site => {
    const price = Math.round((basePrice * site.multiplier + (Math.random() - 0.5) * variation) * 100) / 100
    return {
      site: site.name,
      price: Math.max(price, basePrice * 0.7), // Ensure price doesn't go too low
      url: `https://${site.name.toLowerCase().replace(/\s+/g, '')}.com/search?q=${encodeURIComponent(productName)}`,
      rating: site.rating + (Math.random() - 0.5) * 0.2,
      inStock: Math.random() > 0.2, // 80% chance of being in stock
      shipping: Math.random() > 0.5 ? 'Free' : '$5.99',
    }
  })
}

// Helper function to run Python script
function runPythonScript(scriptPath: string, input: any, apiKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Use virtual environment Python if available, otherwise system Python
    const venvPython = join(process.cwd(), 'venv', 'bin', 'python3')
    const pythonExec = existsSync(venvPython) ? venvPython : 'python3'
    
    const pythonProcess = spawn(pythonExec, [scriptPath], {
      env: { ...process.env, NOVA_ACT_API_KEY: apiKey },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    
    let output = ''
    let errorOutput = ''
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })
    
    pythonProcess.on('close', (code) => {
      if (code === 0 && output) {
        try {
          const data = JSON.parse(output)
          resolve(data)
        } catch (parseError) {
          console.error('Failed to parse Nova Act output:', parseError)
          resolve(null)
        }
      } else {
        console.error('Nova Act script error:', errorOutput)
        resolve(null)
      }
    })
    
    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error)
      resolve(null)
    })
    
    // Send input to Python script
    pythonProcess.stdin.write(JSON.stringify(input))
    pythonProcess.stdin.end()
  })
}

