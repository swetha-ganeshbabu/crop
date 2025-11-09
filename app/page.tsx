'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/components/Dashboard'
import Navigation from '@/components/Navigation'
import Sidebar, { useSidebar } from '@/components/Sidebar'
import VoiceAlerts from '@/components/VoiceAlerts'
import InsightModal from '@/components/InsightModal'
import ChatBot from '@/components/ChatBot'

export default function Home() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<string[]>([])
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSection, setModalSection] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalContext, setModalContext] = useState<any>(null)

  useEffect(() => {
    // Check if user is logged in - only run on client
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }
    
    try {
      const storedUser = localStorage.getItem('farmer_user')
      const storedToken = localStorage.getItem('farmer_token')

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
          setLoading(false)
        } catch (error) {
          // Invalid user data, redirect to login
          console.error('Error parsing user data:', error)
          localStorage.removeItem('farmer_user')
          localStorage.removeItem('farmer_token')
          setLoading(false)
          setTimeout(() => {
            window.location.href = '/login'
          }, 100)
        }
      } else {
        // Redirect to login if not authenticated
        setLoading(false)
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
    } catch (error) {
      console.error('Error checking authentication:', error)
      setLoading(false)
      setTimeout(() => {
        window.location.href = '/login'
      }, 100)
    }
  }, [])

  useEffect(() => {
    // Simulate real-time alerts
    const interval = setInterval(() => {
      const newAlerts = [
        'Optimal planting window opens in 3 days',
        'Soil moisture levels are ideal for corn',
        'Weather forecast: Light rain expected tomorrow',
      ]
      const randomAlert = newAlerts[Math.floor(Math.random() * newAlerts.length)]
      setAlerts(prev => [randomAlert, ...prev.slice(0, 4)])
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your farm dashboard...</p>
        </div>
      </div>
    )
  }

  const handleSectionClick = (section: string) => {
    // Extract content based on section
    let content = ''
    let context: any = {}

    switch (section) {
      case 'dashboard':
        content = `Welcome to your regenerative farming dashboard. Your sustainability score is 87 out of 100. You have 250 acres of farmland growing Corn, Soybeans, and Wheat. Your carbon impact is negative 425 tons of CO₂ equivalent this year, meaning you're actively removing carbon from the atmosphere. Your regenerative practices are saving you $31,000 annually through avoided costs in fertilizers, pesticides, and other inputs.`
        context = { user, alerts }
        break
      case 'farm-map':
        content = `Your farm map shows 4 fields with varying irrigation needs. Field A has optimal moisture with 72% and is ready for harvest in 45 days. Field B has adequate moisture at 68% and needs planting in 3 days. Field C needs attention with low moisture at 45% and is ready for harvest now. Field D requires immediate irrigation with critical moisture at 38%. The color-coded map helps you quickly identify which fields need water, with green indicating healthy moisture levels and yellow or amber showing areas requiring irrigation.`
        context = { fields: 4 }
        break
      case 'predictions':
        content = `Your crop yield predictions show strong potential. Corn is projected at 185 bushels per acre, up from 165 last year, indicating a 12% increase. Soybeans are predicted at 52 bushels per acre, up from 48, showing an 8% improvement. Wheat is forecasted at 68 bushels per acre, slightly down from 72 last year. All crops show low to medium risk levels. These predictions are based on current soil conditions, weather patterns, and your regenerative farming practices. The USDA data integration provides real agricultural statistics as a baseline for these forecasts.`
        context = { crops: ['Corn', 'Soybeans', 'Wheat'] }
        break
      case 'soil-health':
        content = `Your soil health analysis shows an overall score of 82 out of 100, which is excellent. Organic matter is at 4.2%, above the optimal 4.0%. pH level is 6.8, which is excellent and ideal for most crops. Nitrogen levels are at 28 ppm, slightly above optimal. Phosphorus is at 18 ppm, slightly below the optimal 20 ppm. Potassium is at 145 ppm, close to the optimal 150 ppm. Soil moisture is at 68%, which is excellent. Your soil shows high biological activity with a fungal-to-bacterial ratio of 0.8 to 1, indicating a mature, healthy soil ecosystem.`
        context = { score: 82 }
        break
      case 'advice':
        content = `Your planting and harvesting advice shows several upcoming tasks. For Corn in Field A, you should plant seeds in 3 days, which is high priority. For Soybeans in Field B, apply fertilizer in 1 day, which is urgent. For Wheat in Field C, harvest in 45 days. The optimal planting window for Corn opens in 2 days and extends to 10 days from now, as soil temperature has reached the optimal 55 degrees Fahrenheit and weather forecast is favorable. For cover crops, the optimal window is 30 to 45 days from now to improve soil health and prevent erosion after harvest.`
        context = { tasks: 3 }
        break
      default:
        content = 'Section content not available.'
    }

    setModalSection(section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' '))
    setModalContent(content)
    setModalContext(context)
    setModalOpen(true)
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Left Sidebar - wraps everything to provide context */}
      <Sidebar onSectionClick={handleSectionClick}>
        {/* Main Content Area - with dynamic margin for sidebar */}
        <ContentArea 
          user={user}
          alerts={alerts}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          handleSectionClick={handleSectionClick}
          modalOpen={modalOpen}
          modalSection={modalSection}
          modalContent={modalContent}
          modalContext={modalContext}
          setModalOpen={setModalOpen}
        />
      </Sidebar>
    </div>
  )
}

// Separate component to use sidebar context
function ContentArea({ 
  user, 
  alerts, 
  voiceEnabled, 
  setVoiceEnabled, 
  handleSectionClick,
  modalOpen,
  modalSection,
  modalContent,
  modalContext,
  setModalOpen
}: any) {
  const { isOpen } = useSidebar()
  const [isDesktop, setIsDesktop] = useState(false)
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])
  
  return (
    <>
      <div 
        className="transition-all duration-300"
        style={{ marginLeft: isDesktop ? (isOpen ? '256px' : '64px') : '0' }}
      >
        {/* Top Navigation Bar */}
        <Navigation user={user} onSectionClick={handleSectionClick} />
        
        <VoiceAlerts 
          alerts={alerts} 
          enabled={voiceEnabled}
          onToggle={() => setVoiceEnabled(!voiceEnabled)}
        />
        
        <main className="container mx-auto px-4 py-8">
          <Dashboard alerts={alerts} user={user} onSectionClick={handleSectionClick} />
        </main>
      </div>
      
      {/* Insight Modal */}
      <InsightModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        section={modalSection}
        content={modalContent}
        context={modalContext}
      />
      
      {/* ChatBot - Floating in bottom-right corner */}
      <ChatBot />
    </>
  )
}

