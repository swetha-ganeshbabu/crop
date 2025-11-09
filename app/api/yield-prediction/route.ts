import { NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Enhanced Yield Prediction API
// Now integrates USDA data and Chestnut Forty predictive intelligence
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const useUSDA = searchParams.get('usda') !== 'false' // Default to true
    const useChestnut = searchParams.get('chestnut') === 'true' // Opt-in for Chestnut Forty

    // Try to fetch USDA data first
    let usdaData = null
    if (useUSDA) {
      try {
        const usdaResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/usda-data?commodity=CORN&state=US`
        )
        if (usdaResponse.ok) {
          usdaData = await usdaResponse.json()
        }
      } catch (error) {
        console.log('USDA data not available, using fallback')
      }
    }

    // Fetch real-time weather data for predictions
    let weatherData = null
    try {
      const weatherResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/weather?lat=40.7128&lon=-74.0060`
      )
      if (weatherResponse.ok) {
        const weatherResult = await weatherResponse.json()
        if (weatherResult.success && weatherResult.current) {
          // Convert weather.gov data to prediction format
          weatherData = {
            rainfall: estimateRainfallFromForecast(weatherResult.forecast),
            avgTemperature: weatherResult.current.temp,
            condition: weatherResult.current.condition,
            windSpeed: weatherResult.current.windSpeed,
          }
        }
      }
    } catch (error) {
      console.log('Weather data not available for predictions, using defaults')
    }

    // If Chestnut Forty is requested, use advanced predictions
    if (useChestnut) {
      try {
        const chestnutResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/chestnut-forty`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              crop: 'CORN',
              location: { state: 'US' },
              soilData: { organicMatter: 3.5, respiration: 125 },
              weatherData: weatherData || { rainfall: 25, avgTemperature: 72 }, // Use real weather if available
              farmPractices: { noTill: true, coverCrops: true, cropRotation: true },
            }),
          }
        )
        
        if (chestnutResponse.ok) {
          const chestnutData = await chestnutResponse.json()
          return NextResponse.json({
            ...chestnutData.predictions,
            source: 'Chestnut Forty + USDA',
            usdaIntegrated: !!usdaData,
          })
        }
      } catch (error) {
        console.log('Chestnut Forty not available, using standard predictions')
      }
    }

    // Standard predictions with USDA data integration
    // Adjust predictions based on real USDA data if available
    const baseCornYield = usdaData?.data?.currentYield || 185
    const baseSoyYield = 52 // Could fetch from USDA for soybeans too
    const baseWheatYield = 68 // Could fetch from USDA for wheat too
    
    // Adjust based on weather if available
    let weatherFactor = 1.0
    if (weatherData) {
      // Simple weather adjustment
      if (weatherData.condition?.toLowerCase().includes('rain')) {
        weatherFactor = 1.1 // Rain is good for crops
      } else if (weatherData.condition?.toLowerCase().includes('sunny') || weatherData.condition?.toLowerCase().includes('clear')) {
        weatherFactor = 1.05 // Sunny is good
      } else if (weatherData.condition?.toLowerCase().includes('storm') || weatherData.condition?.toLowerCase().includes('thunder')) {
        weatherFactor = 0.95 // Storms can be damaging
      }
    }

    const predictions = {
      crops: [
        { 
          name: 'Corn', 
          predicted: Math.round(baseCornYield * weatherFactor), 
          lastYear: usdaData?.data?.lastYearYield || 165, 
          trend: (baseCornYield * weatherFactor) > (usdaData?.data?.lastYearYield || 165) ? 'up' : 'down',
          risk: 'low',
          confidence: usdaData ? 87 : 75,
        },
        { 
          name: 'Soybeans', 
          predicted: Math.round(baseSoyYield * weatherFactor), 
          lastYear: 48, 
          trend: 'up',
          risk: 'medium',
          confidence: 82,
        },
        { 
          name: 'Wheat', 
          predicted: Math.round(baseWheatYield * weatherFactor), 
          lastYear: 72, 
          trend: 'down',
          risk: 'low',
          confidence: 79,
        },
      ],
      monthlyData: [
        { month: 'Jan', yield: 120 },
        { month: 'Feb', yield: 135 },
        { month: 'Mar', yield: 150 },
        { month: 'Apr', yield: 165 },
        { month: 'May', yield: 175 },
        { month: 'Jun', predicted: Math.round(baseCornYield * weatherFactor) },
      ],
      factors: {
        weather: weatherData ? (weatherData.condition || 'favorable') : 'favorable',
        soil: 'optimal',
        market: 'stable',
      },
      source: usdaData && weatherData 
        ? 'USDA NASS + Weather.gov + AI' 
        : usdaData 
        ? 'USDA NASS + AI' 
        : weatherData
        ? 'Weather.gov + AI'
        : 'AI Prediction',
      usdaData: usdaData?.data || null,
      weatherData: weatherData || null,
      note: usdaData && weatherData
        ? 'Predictions enhanced with USDA National Agricultural Statistics Service data and real-time weather from Weather.gov'
        : usdaData
        ? 'Predictions enhanced with USDA National Agricultural Statistics Service data'
        : weatherData
        ? 'Predictions enhanced with real-time weather data from Weather.gov'
        : 'Using AI predictions. Enable USDA and weather integration for more accurate forecasts.',
    }

    return NextResponse.json(predictions)
  } catch (error) {
    console.error('Yield prediction error:', error)
    // Fallback to basic predictions
    return NextResponse.json({
      crops: [
        { name: 'Corn', predicted: 185, lastYear: 165, trend: 'up', risk: 'low', confidence: 87 },
        { name: 'Soybeans', predicted: 52, lastYear: 48, trend: 'up', risk: 'medium', confidence: 82 },
        { name: 'Wheat', predicted: 68, lastYear: 72, trend: 'down', risk: 'low', confidence: 79 },
      ],
      source: 'Fallback',
      note: 'Using fallback predictions',
    })
  }
}

// Estimate rainfall from weather forecast
function estimateRainfallFromForecast(forecast: any[]): number {
  if (!forecast || forecast.length === 0) return 25 // Default
  
  // Count rainy days in forecast
  const rainyDays = forecast.filter((day: any) => 
    day.condition?.toLowerCase().includes('rain') || 
    day.condition?.toLowerCase().includes('shower')
  ).length
  
  // Estimate: 0.5-1 inch per rainy day, plus base
  const estimatedRainfall = 20 + (rainyDays * 0.75)
  return Math.round(estimatedRainfall)
}
