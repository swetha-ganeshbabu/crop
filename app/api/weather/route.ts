import { NextResponse } from 'next/server'

// Weather.gov API Integration (NOAA)
// Free, no API key required - Government weather data
// Fetches real-time weather data for farm locations

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get('lat') || '40.7128' // Default: New York
    const lon = searchParams.get('lon') || '-74.0060'

    try {
      // Step 1: Get grid point from lat/lon
      const gridPointUrl = `https://api.weather.gov/points/${lat},${lon}`
      const gridResponse = await fetch(gridPointUrl, {
        headers: {
          'User-Agent': 'FarmWise/1.0 (hackathon project)',
        },
      })

      if (!gridResponse.ok) {
        throw new Error('Failed to get grid point')
      }

      const gridData = await gridResponse.json()
      const gridId = gridData.properties.gridId
      const gridX = gridData.properties.gridX
      const gridY = gridData.properties.gridY
      const forecastUrl = gridData.properties.forecast
      const forecastHourlyUrl = gridData.properties.forecastHourly

      // Step 2: Get current conditions and forecast
      const [forecastResponse, hourlyResponse] = await Promise.all([
        fetch(forecastUrl, {
          headers: {
            'User-Agent': 'FarmWise/1.0 (hackathon project)',
          },
        }),
        fetch(forecastHourlyUrl, {
          headers: {
            'User-Agent': 'FarmWise/1.0 (hackathon project)',
          },
        }),
      ])

      if (forecastResponse.ok && hourlyResponse.ok) {
        const forecastData = await forecastResponse.json()
        const hourlyData = await hourlyResponse.json()

        // Get current conditions from hourly forecast
        const currentPeriod = hourlyData.properties.periods[0]
        const currentWeather = {
          temp: Math.round(currentPeriod.temperature),
          condition: currentPeriod.shortForecast || currentPeriod.detailedForecast,
          description: currentPeriod.detailedForecast,
          humidity: null, // Weather.gov doesn't provide humidity in forecast
          windSpeed: currentPeriod.windSpeed ? parseInt(currentPeriod.windSpeed.split(' ')[0]) : null,
          windDirection: currentPeriod.windDirection || null,
          icon: getWeatherIconFromText(currentPeriod.shortForecast || currentPeriod.detailedForecast),
        }

        // Process forecast (next 4 days)
        const forecast = processWeatherGovForecast(forecastData.properties.periods)

        return NextResponse.json({
          success: true,
          source: 'Weather.gov (NOAA)',
          current: currentWeather,
          forecast: forecast,
          location: {
            name: gridData.properties.relativeLocation?.properties?.city || 'Unknown',
            state: gridData.properties.relativeLocation?.properties?.state || 'Unknown',
            lat: parseFloat(lat),
            lon: parseFloat(lon),
          },
        })
      } else {
        throw new Error('Failed to get forecast')
      }
    } catch (error) {
      console.error('Weather.gov API error:', error)
      // Fallback to mock data
      return NextResponse.json({
        success: false,
        error: 'Weather.gov API unavailable',
        source: 'Mock (fallback)',
        data: getMockWeatherData(),
      }, { status: 200 })
    }
  } catch (error) {
    console.error('Weather route error:', error)
    return NextResponse.json(
      { error: 'Failed to process request', data: getMockWeatherData() },
      { status: 500 }
    )
  }
}

// Process forecast data from Weather.gov API
function processWeatherGovForecast(periods: any[]) {
  // Weather.gov provides periods (day/night cycles)
  // Group into days
  const dailyData: Record<string, { highs: number[], lows: number[], conditions: string[] }> = {}
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  periods.slice(0, 14).forEach((period: any) => {
    const date = new Date(period.startTime)
    const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' })
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = { highs: [], lows: [], conditions: [] }
    }
    
    if (period.isDaytime) {
      dailyData[dayKey].highs.push(period.temperature)
    } else {
      dailyData[dayKey].lows.push(period.temperature)
    }
    dailyData[dayKey].conditions.push(period.shortForecast || period.detailedForecast)
  })

  // Convert to forecast array
  const forecast = Object.entries(dailyData).slice(0, 4).map(([day, data], index) => {
    const high = data.highs.length > 0 ? Math.max(...data.highs) : data.lows[0] || 70
    const low = data.lows.length > 0 ? Math.min(...data.lows) : data.highs[0] || 50
    const mostCommonCondition = getMostCommon(data.conditions)

    return {
      day: index === 0 ? 'Today' : day.substring(0, 3),
      high,
      low,
      condition: mostCommonCondition.substring(0, 20), // Truncate long descriptions
      icon: getWeatherIconFromText(mostCommonCondition),
    }
  })

  return forecast
}

function getMostCommon(arr: string[]): string {
  const counts: Record<string, number> = {}
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1
  })
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
}

function getWeatherIconFromText(text: string): string {
  const lowerText = text.toLowerCase()
  
  if (lowerText.includes('sunny') || lowerText.includes('clear')) {
    return 'Sun'
  } else if (lowerText.includes('rain') || lowerText.includes('shower')) {
    return 'CloudRain'
  } else if (lowerText.includes('snow')) {
    return 'CloudSnow'
  } else if (lowerText.includes('cloud')) {
    return 'Cloud'
  } else if (lowerText.includes('thunder') || lowerText.includes('storm')) {
    return 'CloudRain'
  } else {
    return 'Cloud'
  }
}

// Mock weather data (fallback)
function getMockWeatherData() {
  return {
    current: {
      temp: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      icon: 'Cloud',
    },
    forecast: [
      { day: 'Today', high: 75, low: 58, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tomorrow', high: 73, low: 60, condition: 'Light Rain', icon: 'CloudRain' },
      { day: 'Wed', high: 70, low: 55, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Thu', high: 68, low: 52, condition: 'Sunny', icon: 'Sun' },
    ],
  }
}

