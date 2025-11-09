'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Loader2 } from 'lucide-react'

const iconMap: Record<string, typeof Sun> = {
  Sun: Sun,
  Cloud: Cloud,
  CloudRain: CloudRain,
  CloudSnow: Cloud,
  Clear: Sun,
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Default location (can be made dynamic based on user's farm location)
    const lat = '40.7128' // New York (default)
    const lon = '-74.0060'

    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.current) {
          setWeather({
            current: {
              ...data.current,
              icon: iconMap[data.current.icon] || Cloud,
            },
            forecast: data.forecast.map((day: any) => ({
              ...day,
              icon: iconMap[day.icon] || Cloud,
            })),
          })
        } else if (data.data) {
          // Use mock data from fallback
          setWeather({
            current: {
              ...data.data.current,
              icon: iconMap[data.data.current.icon] || Cloud,
            },
            forecast: data.data.forecast.map((day: any) => ({
              ...day,
              icon: iconMap[day.icon] || Cloud,
            })),
          })
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Weather fetch error:', error)
        // Fallback to mock data
        setWeather({
          current: {
            temp: 72,
            condition: 'Partly Cloudy',
            icon: Cloud,
            humidity: 65,
            windSpeed: 8,
          },
          forecast: [
            { day: 'Today', high: 75, low: 58, condition: 'Sunny', icon: Sun },
            { day: 'Tomorrow', high: 73, low: 60, condition: 'Light Rain', icon: CloudRain },
            { day: 'Wed', high: 70, low: 55, condition: 'Cloudy', icon: Cloud },
            { day: 'Thu', high: 68, low: 52, condition: 'Sunny', icon: Sun },
          ],
        })
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Weather Forecast</h2>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </div>
    )
  }

  if (!weather) {
    return null
  }

  const CurrentIcon = weather.current.icon

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Weather Forecast</h2>
      
      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div className="flex items-center space-x-4">
          <CurrentIcon className="h-12 w-12 text-green-500" />
          <div>
            <p className="text-3xl font-bold text-gray-800">{weather.current.temp}°F</p>
            <p className="text-gray-600">{weather.current.condition}</p>
          </div>
        </div>
        <div className="text-right space-y-1">
          <div className="flex items-center space-x-2 text-gray-600">
            <Droplets className="h-4 w-4" />
            <span>{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Wind className="h-4 w-4" />
            <span>{weather.current.windSpeed} mph</span>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {weather.forecast.map((day: any, index: number) => {
          const Icon = day.icon
          return (
            <div key={index} className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
              <Icon className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-lg font-semibold text-gray-800">{day.high}°</p>
              <p className="text-sm text-gray-500">{day.low}°</p>
              <p className="text-xs text-gray-500 mt-1">{day.condition}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

