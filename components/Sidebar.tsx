'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Leaf, 
  Calendar,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import Image from 'next/image'

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

interface SidebarProps {
  onSectionClick?: (section: string) => void
  children?: React.ReactNode
}

export default function Sidebar({ onSectionClick, children }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  // Update document body class for dynamic margin
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-width', isOpen ? '256px' : '64px')
    }
  }, [isOpen])

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farm-map', label: 'Farm Map', icon: Map },
    { id: 'predictions', label: 'Predictions', icon: TrendingUp },
    { id: 'soil-health', label: 'Soil Health', icon: Leaf },
    { id: 'advice', label: 'Planting Advice', icon: Calendar },
  ]

  const handleSectionClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault()
    if (onSectionClick) {
      onSectionClick(sectionId)
    } else {
      // Fallback to anchor link
      const element = document.getElementById(sectionId.replace('#', ''))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    // Close mobile menu after click
    setIsMobileOpen(false)
  }

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-green-600 text-white p-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white shadow-xl z-40
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-16'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          pt-16 lg:pt-0
        `}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          {isOpen && (
            <div className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="Cropit Logo" 
                width={120} 
                height={49}
                className="h-8 w-auto"
                priority
              />
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-4 px-2">
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <li key={section.id}>
                  <button
                    onClick={(e) => handleSectionClick(section.id, e)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      hover:bg-green-50 hover:text-green-700
                      text-gray-700 font-medium
                      ${isOpen ? 'justify-start' : 'justify-center'}
                    `}
                    title={section.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {isOpen && (
                      <span className="text-sm whitespace-nowrap">{section.label}</span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Collapsed Indicator */}
        {!isOpen && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </aside>

      {/* Render children inside context provider */}
      {children}
    </SidebarContext.Provider>
  )
}

// Export a component that uses the sidebar state for margin
export function SidebarSpacer() {
  const { isOpen } = useSidebar()
  return (
    <div 
      className={`hidden lg:block transition-all duration-300 flex-shrink-0`}
      style={{ width: isOpen ? '256px' : '64px' }}
    />
  )
}

