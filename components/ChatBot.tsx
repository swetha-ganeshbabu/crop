'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Mic, MicOff, Bot, User, Volume2, VolumeX, X, MessageCircle, Minimize2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Type definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort?: () => void
  onresult: (event: any) => void
  onerror: (event: any) => void
  onend: () => void
  onstart?: () => void
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor
    SpeechRecognition?: SpeechRecognitionConstructor
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your regenerative farming assistant. I can help you with soil health, crop planning, sustainability metrics, and spending analysis. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakWithElevenLabs = useCallback(async (text: string) => {
    setIsSpeaking(true)
    try {
      const response = await fetch('/api/elevenlabs-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice_id: '21m00Tcm4TlvDq8ikWAM',
        }),
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        
        if (contentType && contentType.includes('audio')) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl)
            setIsSpeaking(false)
          }
          
          audio.onerror = () => {
            console.error('Audio playback error')
            setIsSpeaking(false)
          }
          
          await audio.play()
          return
        }
        
        const data = await response.json()
        if (!data.success) {
          console.log('ElevenLabs not available, using Web Speech API fallback')
        }
      }

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
        
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1
        
        utterance.onend = () => {
          setIsSpeaking(false)
        }
        
        utterance.onerror = () => {
          console.error('Speech synthesis error')
          setIsSpeaking(false)
        }
        
        window.speechSynthesis.speak(utterance)
      } else {
        setIsSpeaking(false)
      }
    } catch (error) {
      console.error('Error with ElevenLabs:', error)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1
        utterance.onend = () => setIsSpeaking(false)
        window.speechSynthesis.speak(utterance)
      } else {
        setIsSpeaking(false)
      }
    }
  }, [])

  const generateAIResponse = useCallback(async (userInput: string): Promise<{ text: string }> => {
    try {
      const response = await fetch('/api/dedalus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: userInput,
          model: 'openai/gpt-5-mini',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.final_output) {
          return { text: data.final_output }
        }
      }
    } catch (error) {
      console.log('Dedalus API not available, using local responses')
    }

    const input = userInput.toLowerCase()

    if (input.includes('soil') || input.includes('health')) {
      return {
        text: "Your soil health is excellent! Your fungal-to-bacterial ratio is 0.8:1, which is great for regenerative farming. Your soil respiration is 125 ppm, showing high biological activity. I recommend continuing with cover crops and no-till practices to maintain this health.",
      }
    }

    if (input.includes('carbon') || input.includes('sequestration')) {
      return {
        text: "Great question! You've sequestered 245 tons of CO₂ this year, which is equivalent to taking 92 cars off the road. Your carbon sequestration rate is 0.98 tons per acre per year. At current carbon credit prices, that's worth about $8,500 annually.",
      }
    }

    if (input.includes('water') || input.includes('irrigation')) {
      return {
        text: "Your water conservation is impressive! You've saved 125,000 gallons this year, a 64% reduction compared to conventional farming. Your soil infiltration rate is 7.5 inches per hour, which is 15 times better than conventional farms. Your water banking capacity is 100,000 gallons, giving you 42 days of drought resilience.",
      }
    }

    if (input.includes('spending') || input.includes('money') || input.includes('cost') || input.includes('knot')) {
      return {
        text: "I've tracked your spending through Knot transactions. You've spent $33,700 this season, but saved $31,000 through regenerative practices, giving you a net benefit. Your biggest savings came from avoiding $12,500 in fertilizer costs. I recommend focusing on eliminating pesticide spending next, which could save another $4,200.",
      }
    }

    if (input.includes('yield') || input.includes('crop') || input.includes('harvest')) {
      return {
        text: "Your crop yield predictions look strong! Corn is projected at 185 bushels per acre, soybeans at 58, and wheat at 72. These are competitive with conventional yields while using 78% fewer chemicals. Your nutrient density scores are excellent, which means you can command premium prices.",
      }
    }

    if (input.includes('biodiversity') || input.includes('pollinator') || input.includes('wildlife')) {
      return {
        text: "Your biodiversity index is 7.2 out of 10, which is excellent! You have 12 bird species, 28 beneficial insects, and over 150 soil organisms. Your pollinator habitat covers 18% of your farm. This ecosystem is providing free pest control and pollination services worth thousands of dollars.",
      }
    }

    if (input.includes('sustainability') || input.includes('impact') || input.includes('environment')) {
      return {
        text: "Your overall sustainability score is 87 out of 100! You've achieved carbon neutrality, eliminated synthetic fertilizers, and reduced water usage by 50%. You're sequestering 425 tons of CO₂ equivalent annually. That's equivalent to planting 5,100 trees or taking 92 cars off the road every year!",
      }
    }

    if (input.includes('advice') || input.includes('recommendation') || input.includes('what should')) {
      return {
        text: "Based on your data, here's my top recommendation: Your cover crop is ready to terminate in 45 days, which perfectly matches your nitrogen release forecast. I suggest planting corn then to maximize the 120 pounds of nitrogen that will be available. Also, your Brix levels are high, so you can skip the preventative pesticide spray and save $8 per acre.",
      }
    }

    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return {
        text: "Hello! I'm here to help you with your regenerative farming journey. I can answer questions about your soil health, carbon impact, water conservation, spending, yields, biodiversity, and sustainability metrics. What would you like to know?",
      }
    }

    return {
      text: "I understand you're asking about regenerative farming. I can help you with soil health, carbon sequestration, water conservation, spending analysis, crop yields, biodiversity, and sustainability metrics. Could you be more specific about what you'd like to know?",
    }
  }, [])

  const handleUserMessage = useCallback(async (userText: string) => {
    const userMessage: Message = {
      role: 'user',
      content: userText,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])

    const response = await generateAIResponse(userText)

    const assistantMessage: Message = {
      role: 'assistant',
      content: response.text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMessage])

    if (voiceEnabled && response.text) {
      await speakWithElevenLabs(response.text)
    }
  }, [voiceEnabled, generateAIResponse, speakWithElevenLabs])

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.webkitSpeechRecognition || window.SpeechRecognition)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          handleUserMessage(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }
      }
    }
  }, [handleUserMessage])

  const startListening = () => {
    try {
      if (recognitionRef.current && !isListening) {
        setIsListening(true)
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
    }
  }

  const stopListening = () => {
    try {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          if (recognitionRef.current.abort) {
            try {
              recognitionRef.current.abort()
            } catch (abortError) {
              console.error('Both stop and abort failed:', abortError)
            }
          }
        }
        setIsListening(false)
      } else {
        setIsListening(false)
      }
    } catch (error) {
      console.error('Error stopping recognition:', error)
      setIsListening(false)
    }
  }

  // Always show floating button when closed
  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true)
          setIsMinimized(false)
        }}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          <Bot className="h-3 w-3" />
        </span>
      </button>
    )
  }

  return (
    <>
      {/* Chat Popup */}
      <div
        className={`
          fixed bottom-6 right-6 z-50 bg-white rounded-lg shadow-2xl transition-all duration-300
          ${isOpen && !isMinimized ? 'w-96 h-[600px]' : 'w-0 h-0 opacity-0 pointer-events-none'}
          ${isMinimized ? 'w-80 h-16' : ''}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">Voice Assistant</h3>
              <p className="text-xs text-green-100">Powered by ElevenLabs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label={voiceEnabled ? 'Disable voice' : 'Enable voice'}
            >
              {voiceEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => {
                setIsMinimized(!isMinimized)
                if (isMinimized) setIsOpen(true)
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label={isMinimized ? 'Expand' : 'Minimize'}
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setIsOpen(false)
                setIsMinimized(false)
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Chat Content - only show when not minimized */}
        {!isMinimized && (
          <>
            {/* ElevenLabs Badge */}
            <div className="px-4 pt-3 pb-2 bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">
                  ELEVENLABS
                </div>
                <p className="text-xs text-gray-600">
                  Natural conversation with your farming assistant
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-2 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="bg-green-600 p-1 rounded-full flex-shrink-0">
                      <Bot className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="bg-blue-600 p-1 rounded-full flex-shrink-0">
                      <User className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls */}
            <div className="p-4 border-t bg-white">
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking}
                className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5" />
                    <span>Tap to Talk</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Questions */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  'How is my soil health?',
                  'What is my carbon impact?',
                  'How much water am I saving?',
                  'Show my spending analysis',
                  'What are my yield predictions?',
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleUserMessage(question)}
                    className="text-xs bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Indicator */}
            {(isListening || isSpeaking) && (
              <div className="px-4 pb-2 flex items-center space-x-2 text-xs text-gray-600">
                {isListening && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Listening...</span>
                  </div>
                )}
                {isSpeaking && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Speaking...</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Button - show when minimized */}
      {isMinimized && (
        <button
          onClick={() => {
            setIsOpen(true)
            setIsMinimized(false)
          }}
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            <Bot className="h-3 w-3" />
          </span>
        </button>
      )}
    </>
  )
}

