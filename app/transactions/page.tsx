'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ShoppingCart, Filter, Calendar, BarChart3, Lightbulb } from 'lucide-react'

interface Transaction {
  id: string
  merchant: string
  amount: number
  category: string
  date: string
  sku?: string
  productName?: string
}

interface TransactionInsight {
  category: string
  totalSpent: number
  transactions: number
  profitImpact: 'positive' | 'negative' | 'neutral'
  profitAmount: number
  recommendation: string
}

export default function TransactionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [insights, setInsights] = useState<TransactionInsight[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [dateRange, setDateRange] = useState('all')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('farmer_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        router.push('/login')
      }
    }
  }, [router])

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/knot-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merchant_id: typeof window !== 'undefined' ? parseInt(localStorage.getItem('knot_merchant_id') || '44') : 44,
          external_user_id: user?.email || 'farmer-123',
          limit: 50,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const mappedTransactions = data.transactions?.map((txn: any) => ({
          id: txn.id,
          merchant: txn.merchant || 'Unknown',
          amount: txn.amount || 0,
          category: txn.category || 'other',
          date: txn.date || new Date().toISOString(),
          sku: txn.sku || txn.sku_data?.sku,
          productName: txn.sku_data?.products?.[0]?.name,
        })) || []

        setTransactions(mappedTransactions)
        analyzeTransactions(mappedTransactions)
      } else {
        // Use mock data
        const mockTransactions = getMockTransactions()
        setTransactions(mockTransactions)
        analyzeTransactions(mockTransactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      const mockTransactions = getMockTransactions()
      setTransactions(mockTransactions)
      analyzeTransactions(mockTransactions)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user, fetchTransactions])

  const getMockTransactions = (): Transaction[] => {
    return [
      // Seeds - Spring planting season
      { id: '1', merchant: 'Pioneer Seeds', amount: 18450, category: 'seeds', date: '2024-03-05', sku: 'PIO-33M57-CORN-50LB', productName: 'Pioneer 33M57 Corn Hybrid Seed 50lb' },
      { id: '2', merchant: 'Bayer CropScience', amount: 12400, category: 'seeds', date: '2024-03-08', sku: 'BAY-SOY-XB33A-50LB', productName: 'Bayer XB33A Soybean Seed 50lb' },
      { id: '3', merchant: 'Syngenta Seeds', amount: 8900, category: 'seeds', date: '2024-02-28', sku: 'SYN-WHT-AGRI-50LB', productName: 'Syngenta AgriPro Wheat Seed 50lb' },
      
      // Fertilizer - Pre-planting application
      { id: '4', merchant: 'Tractor Supply Co', amount: 12450, category: 'fertilizer', date: '2024-03-12', sku: 'TS-FERT-NPK-10-10-10-50LB', productName: 'NPK 10-10-10 Fertilizer 50lb Bag' },
      { id: '5', merchant: 'Rural King Supply', amount: 8750, category: 'fertilizer', date: '2024-03-15', sku: 'RK-UREA-46N-50LB', productName: 'Urea 46-0-0 Nitrogen Fertilizer 50lb' },
      { id: '6', merchant: 'Farm & Fleet', amount: 6200, category: 'fertilizer', date: '2024-03-18', sku: 'FF-PHOS-0-46-0-50LB', productName: 'Phosphate 0-46-0 Fertilizer 50lb' },
      
      // Pesticides & Herbicides - Crop protection
      { id: '7', merchant: 'Corteva Agriscience', amount: 11200, category: 'pesticides', date: '2024-03-20', sku: 'COR-ENLIST-2.5GAL', productName: 'Enlist Duo Herbicide 2.5 Gallon' },
      { id: '8', merchant: 'BASF Agricultural', amount: 6800, category: 'pesticides', date: '2024-03-22', sku: 'BAS-ENGENIA-2.5GAL', productName: 'Engenia Herbicide 2.5 Gallon' },
      { id: '9', merchant: 'FMC Corporation', amount: 5400, category: 'pesticides', date: '2024-03-25', sku: 'FMC-INSECT-ACE-1GAL', productName: 'Acephate Insecticide 1 Gallon' },
      
      // Equipment & Parts - Maintenance and upgrades
      { id: '10', merchant: 'John Deere Parts', amount: 15200, category: 'equipment', date: '2024-03-10', sku: 'JD-PLOW-DISC-8FT', productName: 'John Deere Disc Plow 8ft Attachment' },
      { id: '11', merchant: 'Case IH Dealer', amount: 9800, category: 'equipment', date: '2024-03-14', sku: 'CIH-PLANTER-ROW-12', productName: 'Case IH 12-Row Planter Unit' },
      { id: '12', merchant: 'New Holland Parts', amount: 4200, category: 'equipment', date: '2024-03-16', sku: 'NH-HARROW-DISC-10FT', productName: 'New Holland Disc Harrow 10ft' },
      { id: '13', merchant: 'Tractor Supply Co', amount: 1850, category: 'equipment', date: '2024-03-19', sku: 'TS-HYDRAULIC-HOSE-3/4', productName: 'Hydraulic Hose 3/4" x 20ft' },
      
      // Fuel - Diesel for tractors and equipment
      { id: '14', merchant: 'Shell Fuel Station', amount: 3200, category: 'fuel', date: '2024-03-11', sku: 'SHELL-DIESEL-200GAL', productName: 'Shell Diesel Fuel 200 Gallons' },
      { id: '15', merchant: 'Chevron Farm Co-op', amount: 2800, category: 'fuel', date: '2024-03-13', sku: 'CHEV-DIESEL-175GAL', productName: 'Chevron Diesel Fuel 175 Gallons' },
      { id: '16', merchant: 'Local Farm Co-op', amount: 2400, category: 'fuel', date: '2024-03-17', sku: 'COOP-DIESEL-150GAL', productName: 'Farm Co-op Diesel 150 Gallons' },
      
      // Other supplies
      { id: '17', merchant: 'Tractor Supply Co', amount: 1200, category: 'other', date: '2024-03-21', sku: 'TS-FENCING-WIRE-500FT', productName: 'Farm Fencing Wire 500ft Roll' },
      { id: '18', merchant: 'Farm & Fleet', amount: 850, category: 'other', date: '2024-03-23', sku: 'FF-LIVESTOCK-FEED-50LB', productName: 'Livestock Feed 50lb Bag' },
    ]
  }

  const analyzeTransactions = (txns: Transaction[]) => {
    const categoryMap: Record<string, { total: number; count: number; txns: Transaction[] }> = {}

    txns.forEach(txn => {
      if (!categoryMap[txn.category]) {
        categoryMap[txn.category] = { total: 0, count: 0, txns: [] }
      }
      categoryMap[txn.category].total += txn.amount
      categoryMap[txn.category].count += 1
      categoryMap[txn.category].txns.push(txn)
    })

    // Analyze profit impact based on category and regenerative practices
    const profitAnalysis: Record<string, { impact: 'positive' | 'negative' | 'neutral'; amount: number }> = {
      fertilizer: { impact: 'negative', amount: -12500 }, // High fertilizer = negative (regenerative farms use less)
      seeds: { impact: 'neutral', amount: 0 },
      equipment: { impact: 'neutral', amount: 0 },
      pesticides: { impact: 'negative', amount: -4200 }, // Pesticides = negative (regenerative farms avoid)
      fuel: { impact: 'negative', amount: -2800 }, // Fuel = negative (regenerative farms use less)
      other: { impact: 'neutral', amount: 0 },
    }

    const insightsList: TransactionInsight[] = Object.entries(categoryMap).map(([category, data]) => {
      const analysis = profitAnalysis[category] || { impact: 'neutral', amount: 0 }
      
      let recommendation = ''
      if (category === 'fertilizer' && data.total > 10000) {
        recommendation = 'High fertilizer spending detected. Consider cover crops and compost to reduce dependency by 60-80%.'
      } else if (category === 'pesticides' && data.total > 3000) {
        recommendation = 'Pesticide spending is high. Beneficial insects and crop rotation can eliminate most pesticide needs.'
      } else if (category === 'fuel' && data.total > 2000) {
        recommendation = 'Reduce fuel costs by implementing no-till practices and optimizing field routes.'
      } else if (category === 'seeds') {
        recommendation = 'Seed investment is good. Consider heirloom varieties for better nutrient density.'
      } else {
        recommendation = 'Spending in this category is within normal range.'
      }

      return {
        category,
        totalSpent: data.total,
        transactions: data.count,
        profitImpact: analysis.impact,
        profitAmount: analysis.amount,
        recommendation,
      }
    })

    setInsights(insightsList)
  }

  const filteredTransactions = transactions.filter(txn => {
    if (selectedCategory !== 'all' && txn.category !== selectedCategory) return false
    // Add date filtering if needed
    return true
  })

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0)
  const totalNegativeImpact = insights
    .filter(i => i.profitImpact === 'negative')
    .reduce((sum, i) => sum + Math.abs(i.profitAmount), 0)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fertilizer: 'bg-red-100 text-red-800 border-red-300',
      seeds: 'bg-blue-100 text-blue-800 border-blue-300',
      equipment: 'bg-purple-100 text-purple-800 border-purple-300',
      fuel: 'bg-orange-100 text-orange-800 border-orange-300',
      pesticides: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      other: 'bg-gray-100 text-gray-800 border-gray-300',
    }
    return colors[category] || colors.other
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Transaction History & Insights</h1>
              <p className="text-gray-600">Track spending, analyze profit impact, and get AI recommendations</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                KNOT
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Spent</p>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">${totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">This season</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Potential Savings</p>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">${totalNegativeImpact.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">From regenerative practices</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Transactions</p>
              <ShoppingCart className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">Tracked via Knot</p>
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-800">Profit Impact Analysis</h2>
          </div>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${getCategoryColor(insight.category)}`}>
                      {insight.category}
                    </span>
                    {insight.profitImpact === 'negative' ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : insight.profitImpact === 'positive' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <BarChart3 className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">${insight.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{insight.transactions} transactions</p>
                  </div>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                  <p className="text-sm text-blue-800">{insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Transaction History</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Categories</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="seeds">Seeds</option>
                <option value="equipment">Equipment</option>
                <option value="pesticides">Pesticides</option>
                <option value="fuel">Fuel</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="font-semibold text-gray-800">{txn.merchant}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(txn.category)}`}>
                        {txn.category}
                      </span>
                    </div>
                    {txn.sku && (
                      <div className="bg-blue-50 border border-blue-200 rounded px-2 py-1 mt-1 mb-1 inline-block">
                        <p className="text-xs font-semibold text-blue-800">
                          SKU: <span className="font-mono">{txn.sku}</span>
                        </p>
                      </div>
                    )}
                    {txn.productName && (
                      <p className="text-xs text-gray-500">{txn.productName}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(txn.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">${txn.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No transactions found</p>
              </div>
            )}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-2">Future Transaction Safety Tips</h3>
              <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                <li>Review spending patterns monthly to identify unnecessary purchases</li>
                <li>Compare prices across multiple suppliers before large purchases</li>
                <li>Consider bulk buying for frequently used items to save costs</li>
                <li>Track ROI of each purchase category to optimize spending</li>
                <li>Set spending alerts for categories exceeding budget thresholds</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

