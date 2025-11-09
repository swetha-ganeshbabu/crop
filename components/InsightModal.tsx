'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Volume2, VolumeX, Loader2, Sparkles, ArrowRight, ExternalLink } from 'lucide-react'

interface InsightModalProps {
  isOpen: boolean
  onClose: () => void
  section: string
  content: string
  context?: any
}

interface GeminiInsights {
  insights: string[]
  summary: string
  recommendations?: string[]
  source?: string
}

// Map section names to dashboard element IDs
const sectionToIdMap: Record<string, string> = {
  'dashboard': 'dashboard-overview',
  'farm-map': 'farm-map',
  'farm map': 'farm-map',
  'predictions': 'predictions',
  'soil-health': 'soil-health',
  'soil health': 'soil-health',
  'advice': 'advice',
  'planting advice': 'advice',
}

export default function InsightModal({ isOpen, onClose, section, content, context }: InsightModalProps) {
  const [insights, setInsights] = useState<GeminiInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (isOpen && content) {
      fetchInsights()
    } else {
      setInsights(null)
      // Stop any playing audio when modal closes
      if (audioRef.current) {
        try {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
          audioRef.current.src = ''
          audioRef.current.load()
        } catch (error) {
          console.error('Error stopping audio on close:', error)
        }
        audioRef.current = null
      }
      if (audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl)
        } catch (error) {
          console.error('Error revoking URL on close:', error)
        }
        setAudioUrl(null)
      }
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel()
        } catch (error) {
          console.error('Error canceling speech on close:', error)
        }
      }
      if (utteranceRef.current) {
        utteranceRef.current = null
      }
      setIsSpeaking(false)
    }
  }, [isOpen, section, audioUrl])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          section,
          context,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setInsights(data)
      }
    } catch (error) {
      console.error('Error fetching insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const speakInsights = async () => {
    if (!insights) return

    setIsSpeaking(true)
    try {
      // Create text to speak (summary + insights)
      const textToSpeak = `${insights.summary}. Key insights: ${insights.insights.join('. ')}`

      // Use ElevenLabs API
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice_id: '21m00Tcm4TlvDq8ikWAM', // Rachel voice
        }),
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        if (contentType && contentType.includes('audio')) {
          const audioBlob = await response.blob()
          const url = URL.createObjectURL(audioBlob)
          setAudioUrl(url)
          const audio = new Audio(url)
          audioRef.current = audio
          
          audio.onended = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(url)
            setAudioUrl(null)
            audioRef.current = null
          }
          
          audio.onerror = () => {
            setIsSpeaking(false)
            URL.revokeObjectURL(url)
            setAudioUrl(null)
            audioRef.current = null
          }
          
          await audio.play()
          return
        }
      }

      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utteranceRef.current = utterance
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1
        utterance.onend = () => {
          setIsSpeaking(false)
          utteranceRef.current = null
        }
        utterance.onerror = () => {
          setIsSpeaking(false)
          utteranceRef.current = null
        }
        window.speechSynthesis.speak(utterance)
      } else {
        setIsSpeaking(false)
      }
    } catch (error) {
      console.error('Error speaking:', error)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    console.log('Stop speaking called', { audioRef: audioRef.current, audioUrl, isSpeaking })
    
    // Stop ElevenLabs audio if playing
    if (audioRef.current) {
      try {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        audioRef.current.src = '' // Clear the source
        audioRef.current.load() // Reset the audio element
        // Remove event listeners
        audioRef.current.onended = null
        audioRef.current.onerror = null
      } catch (error) {
        console.error('Error stopping audio:', error)
      }
      audioRef.current = null
    }
    
    // Clean up audio URL
    if (audioUrl) {
      try {
        URL.revokeObjectURL(audioUrl)
      } catch (error) {
        console.error('Error revoking URL:', error)
      }
      setAudioUrl(null)
    }
    
    // Stop Web Speech API if using fallback
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel()
        // Also remove any pending utterances
        if (utteranceRef.current) {
          utteranceRef.current = null
        }
      } catch (error) {
        console.error('Error canceling speech synthesis:', error)
      }
    }
    
    setIsSpeaking(false)
  }

  const handleViewDetailedAnalysis = () => {
    // Close the modal first
    onClose()
    
    // Small delay to ensure modal closes smoothly
    setTimeout(() => {
      // Get the section ID from the map
      const sectionId = sectionToIdMap[section.toLowerCase()] || section.toLowerCase().replace(/\s+/g, '-')
      
      // Try to find the element
      const element = document.getElementById(sectionId)
      
      if (element) {
        // Scroll to the element with smooth behavior
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        })
        
        // Add a highlight effect
        element.classList.add('ring-4', 'ring-green-400', 'ring-offset-2', 'transition-all', 'duration-1000')
        
        // Remove highlight after animation
        setTimeout(() => {
          element.classList.remove('ring-4', 'ring-green-400', 'ring-offset-2')
        }, 2000)
      } else {
        // Fallback: scroll to top if section not found
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <div>
                <h2 className="text-2xl font-bold">{section}</h2>
                <p className="text-green-100 text-sm">AI-Powered Insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {insights && (
                <button
                  onClick={isSpeaking ? stopSpeaking : speakInsights}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title={isSpeaking ? 'Stop' : 'Read Aloud'}
                >
                  {isSpeaking ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
              <p className="text-gray-600">Analyzing with Gemini AI...</p>
            </div>
          ) : insights ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
                <h3 className="font-semibold text-emerald-800 mb-2">Summary</h3>
                <p className="text-emerald-700">{insights.summary}</p>
                {insights.source && (
                  <p className="text-xs text-emerald-600 mt-2">Powered by {insights.source}</p>
                )}
              </div>

              {/* Key Insights */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Key Insights</h3>
                <ul className="space-y-2">
                  {insights.insights.map((insight, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-gray-700">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              {insights.recommendations && insights.recommendations.length > 0 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-semibold text-green-800 mb-2">Recommendations</h3>
                  <ul className="space-y-1">
                    {insights.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-green-700 text-sm">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Read Aloud Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (isSpeaking) {
                      stopSpeaking()
                    } else {
                      speakInsights()
                    }
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 mb-3 ${
                    isSpeaking
                      ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                      : 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-5 w-5" />
                      <span>Stop Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-5 w-5" />
                      <span>Read Aloud with ElevenLabs</span>
                    </>
                  )}
                </button>
              </div>

              {/* View Detailed Analysis Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={handleViewDetailedAnalysis}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>View Detailed Analysis</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Navigate to the full {section} section on the dashboard
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No insights available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

