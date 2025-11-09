'use client'

import { useState, useEffect, useCallback } from 'react'
import { DollarSign, TrendingDown, TrendingUp, ShoppingCart, AlertTriangle, CheckCircle, Link2, Unlink } from 'lucide-react'

interface Transaction {
  id: string
  merchant: string
  amount: number
  category: string
  date: string
  sku?: string
}

interface SpendingAnalysis {
  totalSpent: number
  categories: {
    fertilizer: number
    seeds: number
    equipment: number
    fuel: number
    pesticides: number
    other: number
  }
  savings: number
  netProfit: number
  recommendations: string[]
}

// Realistic farmer transaction data - mimicking real agricultural purchases
const mockTransactions: Transaction[] = [
    // Seeds - Spring planting season
    { id: '1', merchant: 'Pioneer Seeds', amount: 18450, category: 'seeds', date: '2024-03-05', sku: 'PIO-33M57-CORN-50LB' },
    { id: '2', merchant: 'Bayer CropScience', amount: 12400, category: 'seeds', date: '2024-03-08', sku: 'BAY-SOY-XB33A-50LB' },
    { id: '3', merchant: 'Syngenta Seeds', amount: 8900, category: 'seeds', date: '2024-02-28', sku: 'SYN-WHT-AGRI-50LB' },
    
    // Fertilizer - Pre-planting application
    { id: '4', merchant: 'Tractor Supply Co', amount: 12450, category: 'fertilizer', date: '2024-03-12', sku: 'TS-FERT-NPK-10-10-10-50LB' },
    { id: '5', merchant: 'Rural King Supply', amount: 8750, category: 'fertilizer', date: '2024-03-15', sku: 'RK-UREA-46N-50LB' },
    { id: '6', merchant: 'Farm & Fleet', amount: 6200, category: 'fertilizer', date: '2024-03-18', sku: 'FF-PHOS-0-46-0-50LB' },
    
    // Pesticides & Herbicides - Crop protection
    { id: '7', merchant: 'Corteva Agriscience', amount: 11200, category: 'pesticides', date: '2024-03-20', sku: 'COR-ENLIST-2.5GAL' },
    { id: '8', merchant: 'BASF Agricultural', amount: 6800, category: 'pesticides', date: '2024-03-22', sku: 'BAS-ENGENIA-2.5GAL' },
    { id: '9', merchant: 'FMC Corporation', amount: 5400, category: 'pesticides', date: '2024-03-25', sku: 'FMC-INSECT-ACE-1GAL' },
    
    // Equipment & Parts - Maintenance and upgrades
    { id: '10', merchant: 'John Deere Parts', amount: 15200, category: 'equipment', date: '2024-03-10', sku: 'JD-PLOW-DISC-8FT' },
    { id: '11', merchant: 'Case IH Dealer', amount: 9800, category: 'equipment', date: '2024-03-14', sku: 'CIH-PLANTER-ROW-12' },
    { id: '12', merchant: 'New Holland Parts', amount: 4200, category: 'equipment', date: '2024-03-16', sku: 'NH-HARROW-DISC-10FT' },
    { id: '13', merchant: 'Tractor Supply Co', amount: 1850, category: 'equipment', date: '2024-03-19', sku: 'TS-HYDRAULIC-HOSE-3/4' },
    
    // Fuel - Diesel for tractors and equipment
    { id: '14', merchant: 'Shell Fuel Station', amount: 3200, category: 'fuel', date: '2024-03-11', sku: 'SHELL-DIESEL-200GAL' },
    { id: '15', merchant: 'Chevron Farm Co-op', amount: 2800, category: 'fuel', date: '2024-03-13', sku: 'CHEV-DIESEL-175GAL' },
    { id: '16', merchant: 'Local Farm Co-op', amount: 2400, category: 'fuel', date: '2024-03-17', sku: 'COOP-DIESEL-150GAL' },
    
    // Other supplies
    { id: '17', merchant: 'Tractor Supply Co', amount: 1200, category: 'other', date: '2024-03-21', sku: 'TS-FENCING-WIRE-500FT' },
    { id: '18', merchant: 'Farm & Fleet', amount: 850, category: 'other', date: '2024-03-23', sku: 'FF-LIVESTOCK-FEED-50LB' },
]

// Helper functions (defined outside component to avoid dependency issues)
const categorizeTransaction = (txn: any): string => {
  // Categorize based on merchant name or SKU
  const merchant = (txn.merchant || '').toLowerCase()
  const sku = (txn.sku || txn.sku_data?.sku || '').toLowerCase()
  
  if (merchant.includes('seed') || sku.includes('seed') || sku.includes('corn') || sku.includes('soy')) {
    return 'seeds'
  }
  if (merchant.includes('fert') || sku.includes('fert') || sku.includes('npk') || sku.includes('urea')) {
    return 'fertilizer'
  }
  if (merchant.includes('pest') || merchant.includes('chem') || sku.includes('herb') || sku.includes('pest')) {
    return 'pesticides'
  }
  if (merchant.includes('fuel') || merchant.includes('gas') || merchant.includes('shell') || sku.includes('diesel')) {
    return 'fuel'
  }
  if (merchant.includes('deere') || merchant.includes('tractor') || merchant.includes('equipment')) {
    return 'equipment'
  }
  return 'other'
}

const calculateAnalysis = (txns: Transaction[]): SpendingAnalysis => {
  const categories = {
    fertilizer: 0,
    seeds: 0,
    equipment: 0,
    fuel: 0,
    pesticides: 0,
    other: 0,
  }

  txns.forEach(txn => {
    const cat = txn.category as keyof typeof categories
    if (categories.hasOwnProperty(cat)) {
      categories[cat] += txn.amount
    } else {
      categories.other += txn.amount
    }
  })

  const totalSpent = Object.values(categories).reduce((sum, val) => sum + val, 0)
  
  // Compare with regenerative savings from EcoWallet
  const regenerativeSavings = 31000 // From EcoWallet component
  const netProfit = regenerativeSavings - totalSpent

  const recommendations: string[] = []
  if (categories.fertilizer > 0) {
    recommendations.push(`You spent $${categories.fertilizer.toLocaleString()} on fertilizer. Cover crops can eliminate this cost entirely.`)
  }
  if (categories.pesticides > 0) {
    recommendations.push(`Pesticide spending: $${categories.pesticides.toLocaleString()}. Healthy soil reduces pest pressure naturally.`)
  }
  if (categories.fuel > 0) {
    recommendations.push(`Fuel costs: $${categories.fuel.toLocaleString()}. No-till practices can reduce tractor passes by 60%.`)
  }
  if (netProfit < 0) {
    recommendations.push(`⚠️ You're spending more than you're saving. Focus on eliminating fertilizer and pesticide costs first.`)
  } else {
    recommendations.push(`✅ Net profit: $${netProfit.toLocaleString()} from regenerative practices!`)
  }

  return {
    totalSpent,
    categories,
    savings: regenerativeSavings,
    netProfit,
    recommendations,
  }
}

export default function SpendingTracker() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [analysis, setAnalysis] = useState<SpendingAnalysis | null>(null)
  const [knotConnected, setKnotConnected] = useState(false)
  const [knotSessionId, setKnotSessionId] = useState<string | null>(null)
  const [linkedMerchantId, setLinkedMerchantId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for existing Knot connection on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedMerchantId = localStorage.getItem('knot_merchant_id')
      const storedSessionId = localStorage.getItem('knot_session_id')
      if (storedMerchantId && storedSessionId) {
        setKnotConnected(true)
        setLinkedMerchantId(parseInt(storedMerchantId))
        setKnotSessionId(storedSessionId)
        fetchTransactionsWithMerchant(parseInt(storedMerchantId))
      } else {
        // Use mock data if not connected
        setTransactions(mockTransactions)
        setAnalysis(calculateAnalysis(mockTransactions))
      }
    }
  }, [])

  // Fetch transactions from Knot API
  const fetchTransactionsWithMerchant = useCallback(async (merchantId: number) => {
    setLoading(true)
    setError(null)
    try {
      const userEmail = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('farmer_user') || '{}').email || 'farmer-123'
        : 'farmer-123'

      const response = await fetch('/api/knot-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: merchantId,
          external_user_id: userEmail,
          limit: 50,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const mappedTransactions = data.transactions?.map((txn: any) => ({
          id: txn.id || txn.external_id || Math.random().toString(),
          merchant: txn.merchant || 'Unknown Merchant',
          amount: txn.amount || 0,
          category: txn.category || categorizeTransaction(txn),
          date: txn.date || txn.datetime || new Date().toISOString(),
          sku: txn.sku || txn.sku_data?.sku || txn.sku_data?.products?.[0]?.sku,
        })) || []

        if (mappedTransactions.length > 0) {
          setTransactions(mappedTransactions)
          setAnalysis(calculateAnalysis(mappedTransactions))
        } else {
          // Fallback to mock if no transactions
          setTransactions(mockTransactions)
          setAnalysis(calculateAnalysis(mockTransactions))
        }
      } else {
        // Fallback to mock data on error
        setTransactions(mockTransactions)
        setAnalysis(calculateAnalysis(mockTransactions))
      }
    } catch (err) {
      console.error('Error fetching Knot transactions:', err)
      setError('Failed to fetch transactions. Using demo data.')
      setTransactions(mockTransactions)
      setAnalysis(calculateAnalysis(mockTransactions))
    } finally {
      setLoading(false)
    }
  }, [])

  // Create Knot session and open SDK
  const handleConnectKnot = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const userEmail = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('farmer_user') || '{}').email || 'farmer-123'
        : 'farmer-123'

      // Create session
      const sessionResponse = await fetch('/api/knot-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ external_user_id: userEmail }),
      })

      if (!sessionResponse.ok) {
        throw new Error('Failed to create Knot session')
      }

      const sessionData = await sessionResponse.json()
      const sessionId = sessionData.session_id

      if (!sessionId) {
        throw new Error('No session ID received')
      }

      setKnotSessionId(sessionId)
      localStorage.setItem('knot_session_id', sessionId)

      // Dynamically import Knot SDK (client-side only)
      if (typeof window !== 'undefined') {
        try {
          // Import Knot SDK - it exports a default class KnotapiJS
          const knotModule = await import('knotapi-js')
          const KnotapiJS = knotModule.default || knotModule
          
          if (!KnotapiJS) {
            console.error('Knot SDK module:', knotModule)
            throw new Error('Knot SDK not available. Please ensure knotapi-js is installed.')
          }

          // Verify it's a constructor function
          if (typeof KnotapiJS !== 'function') {
            console.error('KnotapiJS is not a constructor:', typeof KnotapiJS, KnotapiJS)
            throw new Error('Knot SDK is not properly loaded. Expected a class constructor.')
          }

          // Create instance of KnotapiJS
          const knot = new KnotapiJS()
          
          // Verify the instance has the open method
          if (!knot || typeof knot.open !== 'function') {
            console.error('Knot instance:', knot)
            throw new Error('Knot SDK instance does not have an open method.')
          }
          
          // Import config dynamically to avoid SSR issues
          const { KNOT_CONFIG } = await import('@/lib/knot-config')
          
          console.log('Opening Knot SDK with config:', {
            sessionId,
            clientId: KNOT_CONFIG.CLIENT_ID,
            environment: KNOT_CONFIG.ENVIRONMENT,
            product: 'transaction_link',
          })
          
          // Open Knot SDK modal
          knot.open({
            sessionId: sessionId,
            clientId: KNOT_CONFIG.CLIENT_ID,
            environment: KNOT_CONFIG.ENVIRONMENT,
            product: 'transaction_link',
            mode: 'ui', // Explicitly set UI mode
            useCategories: true,
            useSearch: true,
            onSuccess: (product: string, merchant: string) => {
              console.log('Knot account linked successfully:', { product, merchant })
              
              // The merchant parameter is the merchant_id as a string
              const merchantId = merchant ? parseInt(merchant, 10) : null

              if (merchantId && !isNaN(merchantId)) {
                setKnotConnected(true)
                setLinkedMerchantId(merchantId)
                localStorage.setItem('knot_merchant_id', merchantId.toString())
                localStorage.setItem('knot_connected', 'true')
                
                // Fetch transactions for linked merchant
                fetchTransactionsWithMerchant(merchantId)
              } else {
                console.warn('No valid merchant_id in Knot response:', merchant)
                setError('Account linked but merchant ID not found. Using demo data.')
                setTransactions(mockTransactions)
                setAnalysis(calculateAnalysis(mockTransactions))
              }
              setLoading(false)
            },
            onError: (product: string, errorCode: string, message: string, payload: any) => {
              console.error('Knot SDK error details:', { 
                product, 
                errorCode, 
                message, 
                payload,
                sessionId,
                clientId: KNOT_CONFIG.CLIENT_ID,
                environment: KNOT_CONFIG.ENVIRONMENT,
              })
              
              // Provide more helpful error messages
              let errorMessage = 'Failed to link account. '
              
              // Check for cross-origin/security errors
              if (message && (message.includes('SecurityError') || message.includes('cross-origin') || message.includes('Blocked a frame'))) {
                errorMessage += 'Cross-origin security error. Your domain may need to be allowlisted in Knot dashboard. For demo, you can use mock data.'
              } else if (errorCode === 'INVALID_SESSION' || errorCode === 'EXPIRED_SESSION') {
                errorMessage += 'Session expired. Please try again.'
              } else if (errorCode === 'INVALID_CLIENT_ID') {
                errorMessage += 'Invalid client ID. Please check configuration.'
              } else if (message) {
                errorMessage += message
              } else if (errorCode) {
                errorMessage += `Error: ${errorCode}`
              } else {
                errorMessage += 'Something went wrong. Please try again in a few minutes.'
              }
              
              setError(errorMessage)
              setLoading(false)
            },
            onExit: (product: string) => {
              console.log('Knot modal closed:', product)
              setLoading(false)
            },
          })
        } catch (sdkError) {
          console.error('Knot SDK initialization error:', sdkError)
          setError(sdkError instanceof Error ? sdkError.message : 'Failed to initialize Knot SDK')
          setLoading(false)
        }
      } else {
        setError('Knot SDK requires browser environment')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error connecting Knot:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect Knot account')
      setLoading(false)
    }
  }, [fetchTransactionsWithMerchant])

  // Disconnect Knot account
  const handleDisconnectKnot = useCallback(() => {
    localStorage.removeItem('knot_merchant_id')
    localStorage.removeItem('knot_session_id')
    localStorage.removeItem('knot_connected')
    setKnotConnected(false)
    setLinkedMerchantId(null)
    setKnotSessionId(null)
    setTransactions(mockTransactions)
    setAnalysis(calculateAnalysis(mockTransactions))
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fertilizer: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      seeds: 'bg-teal-100 text-teal-800 border-teal-300',
      equipment: 'bg-green-100 text-green-800 border-green-300',
      fuel: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      pesticides: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      other: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colors[category] || colors.other
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Spending Tracker</h2>
          <p className="text-sm text-gray-600 mt-1">Track expenses and optimize profitability</p>
        </div>
        <div className="flex items-center space-x-3">
          {knotConnected ? (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Account Linked</span>
              </div>
              <button
                onClick={handleDisconnectKnot}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              >
                <Unlink className="h-3 w-3" />
                <span>Disconnect</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnectKnot}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Link2 className="h-4 w-4" />
              <span>{loading ? 'Connecting...' : 'Connect Knot Account'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Knot Logo & Integration Badge - Visual Representation Required */}
      <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border-l-4 border-emerald-500">
        <div className="flex items-center space-x-3">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-md">
            KNOT
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Powered by Knot Transaction Link API</p>
            {knotConnected ? (
              <>
                <p className="text-xs text-green-600 mt-1 font-medium">✅ Account linked - Real transaction data</p>
                {linkedMerchantId && (
                  <p className="text-xs text-gray-600 mt-1">Merchant ID: {linkedMerchantId}</p>
                )}
              </>
            ) : (
              <>
                <p className="text-xs text-gray-600">Connect your account to sync real transactions with SKU data</p>
                <p className="text-xs text-emerald-600 mt-1 font-medium">📊 Currently showing demo data</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 rounded-lg">
          <p className="text-sm text-emerald-800">Loading transactions...</p>
        </div>
      )}

      {analysis ? (
        <>
          {/* Profit/Loss Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Spent</span>
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">${analysis.totalSpent.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">This season</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Regenerative Savings</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">${analysis.savings.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">From Eco-Wallet</p>
            </div>
            <div className={`border-l-4 rounded-lg p-4 ${
              analysis.netProfit >= 0 
                ? 'bg-emerald-50 border-emerald-500' 
                : 'bg-orange-50 border-orange-500'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Net Profit</span>
                {analysis.netProfit >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <p className={`text-2xl font-bold ${
                analysis.netProfit >= 0 ? 'text-emerald-600' : 'text-orange-600'
              }`}>
                ${Math.abs(analysis.netProfit).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analysis.netProfit >= 0 ? 'Positive ROI' : 'Needs optimization'}
              </p>
            </div>
          </div>

          {/* Spending by Category */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Spending by Category</h3>
            <div className="space-y-2">
              {Object.entries(analysis.categories)
                .filter(([_, amount]) => amount > 0)
                .sort(([_, a], [__, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded text-xs font-medium border capitalize ${getCategoryColor(category)}`}>
                        {category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {((amount / analysis.totalSpent) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                    <span className="font-bold text-gray-800">${amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Transactions with SKU Data - Knot Requirement */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-700">Recent Transactions</h3>
              <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">
                SKU Data Included
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {transactions.slice(0, 5).map(txn => (
                <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{txn.merchant}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(txn.category)}`}>
                        {txn.category}
                      </span>
                    </div>
                    {txn.sku && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 mt-1 mb-1">
                        <p className="text-xs font-semibold text-emerald-800">SKU: <span className="font-mono">{txn.sku}</span></p>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">{new Date(txn.date).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-red-600">${txn.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            {transactions.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No transactions found. Connect your Knot account to sync.</p>
            )}
          </div>

          {/* Recommendations */}
          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded">
            <h3 className="font-semibold text-emerald-800 mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Profitability Recommendations
            </h3>
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-emerald-700 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  )
}

