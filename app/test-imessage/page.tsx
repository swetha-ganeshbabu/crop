'use client'

/**
 * Test Page for iMessage Integration
 * 
 * This page simulates what Photon iMessage Kit would send,
 * so you can test the integration without needing real iMessage.
 * 
 * Beginner Explanation:
 * - This is like a "practice" version of iMessage
 * - You can type messages here and see how the AI responds
 * - It uses the same endpoint that real iMessage will use
 */

import { useState } from 'react'
import { Send, MessageCircle, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  actions?: Array<{ type: string; label: string; url: string }>
}

export default function TestiMessagePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your FarmWise AI assistant. This is a test page to simulate iMessage integration. Try asking me about your farm!",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Call the same endpoint that Photon iMessage Kit will use
      const response = await fetch('/api/imessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          userId: 'test-farmer-123',
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || data.error || 'Sorry, I encountered an error.',
        timestamp: new Date(),
        actions: data.actions,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4" style={{ pointerEvents: 'auto' }}>
      <div className="max-w-2xl mx-auto" style={{ pointerEvents: 'auto' }}>
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-green-600 p-3 rounded-full">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">iMessage Integration Test</h1>
              <p className="text-sm text-gray-600">Simulating Photon iMessage Kit</p>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This page tests the same endpoint that real iMessage will use.
              Messages are sent to <code className="bg-blue-100 px-2 py-1 rounded">/api/imessage</code>
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 h-[500px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.actions.map((action, actionIndex) => (
                            <a
                              key={actionIndex}
                              href={action.url}
                              className="block bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded text-sm text-center transition-colors"
                            >
                              {action.label}
                            </a>
                          ))}
                        </div>
                      )}
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-green-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white rounded-lg shadow-md p-4" style={{ pointerEvents: 'auto' }}>
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                e.stopPropagation()
                setInput(e.target.value)
              }}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              onKeyUp={(e) => e.stopPropagation()}
              placeholder="Type a message... (e.g., 'How's my soil health?')"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 z-10"
              disabled={loading}
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                sendMessage()
              }}
              disabled={loading || !input.trim()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 z-10"
              style={{ pointerEvents: 'auto', zIndex: 10 }}
            >
              <Send className="h-5 w-5 pointer-events-none" />
              <span>Send</span>
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            <p>💡 Try: "Status", "Show spending", "Soil health", "What should I plant?"</p>
          </div>
        </div>
      </div>
    </div>
  )
}

