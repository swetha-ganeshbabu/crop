'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogIn, User, Lock, Mail, UserPlus } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [farmName, setFarmName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    // Check if already logged in (only on client)
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('farmer_user')
      if (storedUser) {
        router.push('/')
      }
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        // Login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (response.ok) {
          // Store user session
          localStorage.setItem('farmer_user', JSON.stringify(data.user))
          localStorage.setItem('farmer_token', data.token)
          router.push('/')
        } else {
          setError(data.error || 'Login failed')
        }
      } else {
        // Signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name, farmName }),
        })

        const data = await response.json()

        if (response.ok) {
          // Store user session
          localStorage.setItem('farmer_user', JSON.stringify(data.user))
          localStorage.setItem('farmer_token', data.token)
          router.push('/')
        } else {
          setError(data.error || 'Signup failed')
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ pointerEvents: 'auto' }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/background.png"
          alt="Background"
          fill
          className="object-cover blur-sm"
          priority
          quality={90}
        />
        {/* Gradient overlay to enhance green and brown tones */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-amber-700/20 via-transparent to-transparent"></div>
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-white/30"></div>
      </div>

      <div className="max-w-md w-full relative z-10" style={{ pointerEvents: 'auto' }}>
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white/95 backdrop-blur-md px-6 py-4 rounded-xl shadow-2xl border-2 border-green-100">
              <Image
                src="/logo.svg"
                alt="Cropit Logo"
                width={180}
                height={74}
                className="h-16 w-auto"
                priority
              />
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-md px-8 py-4 rounded-xl shadow-2xl border-2 border-green-100 inline-block">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 drop-shadow-lg">Regenerative Farm OS</h1>
            <p className="text-gray-700 font-medium">Your sustainable farming dashboard</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Toggle Login/Signup */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <LogIn className="h-4 w-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus className="h-4 w-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            onKeyDown={(e) => {
              // Allow typing - don't prevent default on input fields
              if (e.target instanceof HTMLInputElement) {
                return
              }
            }}
          >
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative" style={{ zIndex: 10 }}>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        e.stopPropagation()
                        setName(e.target.value)
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                      }}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 relative z-10"
                      placeholder="John Farmer"
                      autoComplete="name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Farm Name
                  </label>
                  <div className="relative" style={{ zIndex: 10 }}>
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => {
                        e.stopPropagation()
                        setFarmName(e.target.value)
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation()
                      }}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 relative z-10"
                      placeholder="Green Valley Farm"
                      autoComplete="organization"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative" style={{ zIndex: 10 }}>
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    e.stopPropagation()
                    setEmail(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                  }}
                  onKeyUp={(e) => {
                    e.stopPropagation()
                  }}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 relative z-10"
                  placeholder="farmer@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative" style={{ zIndex: 10 }}>
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    e.stopPropagation()
                    setPassword(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                  }}
                  onKeyUp={(e) => {
                    e.stopPropagation()
                  }}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 relative z-10"
                  placeholder="••••••••"
                  minLength={6}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5 mr-2" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Demo Accounts (for testing):</p>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => {
                  setEmail('demo@farm.com')
                  setPassword('demo123')
                  setIsLogin(true)
                }}
                className="text-green-600 hover:text-green-700"
              >
                Demo Farmer (demo@farm.com / demo123)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

