'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ShoppingCart, Filter, Calendar, BarChart3, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react'

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

// Component to format AI recommendations with proper structure
function FormattedRecommendation({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)
  
  // Parse the recommendation text into structured sections
  const parseRecommendation = (text: string): { title?: string; type: 'summary' | 'list' | 'paragraph' | 'checklist'; content: string[] }[] => {
    const sections: { title?: string; type: 'summary' | 'list' | 'paragraph' | 'checklist'; content: string[] }[] = []
    
    // Split by double newlines or section patterns
    const parts = text.split(/\n\s*\n/).filter(p => p.trim())
    
    parts.forEach(part => {
      const lines = part.split('\n').filter(line => line.trim())
      if (lines.length === 0) return
      
      const firstLine = lines[0].trim()
      
      // Check if this is a section header (ends with colon, or starts with common section keywords)
      const isSectionHeader = firstLine.match(/^(Quick Read|Practical steps|Cost-effective|Regenerative|Specific actionable|Quick examples|If you want|\d+-\d+\s+days?)[:]/i) ||
                             (firstLine.endsWith(':') && firstLine.length < 80 && !firstLine.includes('→'))
      
      if (isSectionHeader) {
        const title = firstLine.replace(/:/, '').trim()
        const content = lines.slice(1)
        
        // Determine section type
        let type: 'summary' | 'list' | 'paragraph' | 'checklist' = 'list'
        if (title.toLowerCase().includes('quick read')) {
          type = 'summary'
        } else if (title.toLowerCase().includes('days') || title.toLowerCase().includes('actionable')) {
          type = 'checklist'
        }
        
        sections.push({
          title,
          type,
          content: content.length > 0 ? content : []
        })
      } else {
        // This is content - check if it's a list or paragraph
        const hasBullets = lines.some(l => l.trim().match(/^[*•\-]\s/) || l.trim().match(/^\d+\.\s/))
        
        if (hasBullets) {
          // List section
          sections.push({
            type: 'list',
            content: lines.map(l => l.trim().replace(/^[*•\-]\s*/, '').replace(/^\d+\.\s*/, ''))
          })
        } else {
          // Paragraph section
          sections.push({
            type: 'paragraph',
            content: [lines.join(' ')]
          })
        }
      }
    })
    
    // If no structure found, try to parse as simple text with line breaks
    if (sections.length === 0) {
      const lines = text.split('\n').filter(l => l.trim())
      const hasStructure = lines.some(l => l.trim().match(/^[*•\-]/) || l.trim().match(/^\d+\./))
      
      if (hasStructure) {
        return [{
          type: 'list',
          content: lines.map(l => l.trim().replace(/^[*•\-]\s*/, '').replace(/^\d+\.\s*/, ''))
        }]
      }
      
      return [{ type: 'paragraph' as const, content: [text] }]
    }
    
    return sections
  }
  
  const sections = parseRecommendation(text)
  const hasMultipleSections = sections.length > 1
  const summary = sections.find(s => s.title?.toLowerCase().includes('quick read') || (!s.title && s.type === 'paragraph' && sections.length === 1))
  const details = sections.filter(s => s !== summary)
  
  return (
    <div className="space-y-3">
      {/* Summary - Always visible */}
      {summary && (
        <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
          {summary.title && (
            <h4 className="text-sm font-semibold text-blue-900 mb-2">{summary.title}</h4>
          )}
          <div className="text-sm text-gray-800 leading-relaxed">
            {summary.type === 'list' ? (
              <ul className="space-y-1.5">
                {summary.content.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-line">{summary.content.join('\n')}</p>
            )}
          </div>
        </div>
      )}
      
      {/* Detailed sections - Collapsible */}
      {hasMultipleSections && details.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center space-x-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors w-full text-left"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span>{expanded ? 'Hide' : 'Show'} Detailed Recommendations ({details.length} sections)</span>
          </button>
          
          {expanded && (
            <div className="space-y-3 pl-6 border-l-2 border-blue-200">
              {details.map((section, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                  {section.title && (
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      <span>{section.title}</span>
                    </h4>
                  )}
                  {section.type === 'list' || section.type === 'checklist' ? (
                    <ul className="space-y-2">
                      {section.content.map((item, itemIdx) => (
                        <li key={itemIdx} className="text-sm text-gray-700 flex items-start space-x-2">
                          <span className="text-blue-600 mt-1.5 font-bold">•</span>
                          <span className="flex-1 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content.join('\n')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Simple format if no structure detected */}
      {!hasMultipleSections && !summary && (
        <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
            {text}
          </p>
        </div>
      )}
    </div>
  )
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

  const analyzeTransactions = useCallback(async (txns: Transaction[]) => {
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
      fertilizer: { impact: 'negative', amount: -19500 }, // High fertilizer = negative (regenerative farms use less)
      seeds: { impact: 'neutral', amount: 0 },
      equipment: { impact: 'neutral', amount: 0 },
      pesticides: { impact: 'negative', amount: -4200 }, // Pesticides = negative (regenerative farms avoid)
      fuel: { impact: 'negative', amount: -2800 }, // Fuel = negative (regenerative farms use less)
      other: { impact: 'neutral', amount: 0 },
    }

    // Use Dedalus AI for intelligent spending analysis
    const insightsList: TransactionInsight[] = await Promise.all(
      Object.entries(categoryMap).map(async ([category, data]) => {
        const analysis = profitAnalysis[category] || { impact: 'neutral', amount: 0 }
        
        // Get AI recommendation from Dedalus
        let recommendation = ''
        try {
          const dedalusResponse = await fetch('/api/dedalus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              input: `Analyze this farmer's spending in the ${category} category:
              
Total Spent: $${data.total.toLocaleString()}
Number of Transactions: ${data.count}
Category: ${category}
Sample Products: ${data.txns.slice(0, 3).map(t => t.productName || t.merchant).join(', ')}

Provide a cost-effective recommendation for this farmer. Focus on:
1. How to optimize spending in this category
2. Cost-effective alternatives or practices
3. Regenerative farming approaches that could reduce costs
4. Specific actionable advice for a farmer

Keep the response concise and practical.`,
            }),
          })

          if (dedalusResponse.ok) {
            const dedalusData = await dedalusResponse.json()
            recommendation = dedalusData.final_output || generateFallbackRecommendation(category, data)
          } else {
            recommendation = generateFallbackRecommendation(category, data)
          }
        } catch (error) {
          console.error('Dedalus API error:', error)
          recommendation = generateFallbackRecommendation(category, data)
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
    )

    setInsights(insightsList)
  }, [])

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
        await analyzeTransactions(mappedTransactions)
      } else {
        // Use mock data
        const mockTransactions = getMockTransactions()
        setTransactions(mockTransactions)
        await analyzeTransactions(mockTransactions)
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      const mockTransactions = getMockTransactions()
      setTransactions(mockTransactions)
      await analyzeTransactions(mockTransactions)
    } finally {
      setLoading(false)
    }
  }, [user, analyzeTransactions])

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
      
      // Fertilizer - Pre-planting and side-dress applications (more realistic farming data)
      { id: '4', merchant: 'Tractor Supply Co', amount: 12450, category: 'fertilizer', date: '2024-03-12', sku: 'TS-FERT-NPK-10-10-10-50LB', productName: 'NPK 10-10-10 Balanced Fertilizer 50lb Bag' },
      { id: '5', merchant: 'Rural King Supply', amount: 8750, category: 'fertilizer', date: '2024-03-15', sku: 'RK-UREA-46N-50LB', productName: 'Urea 46-0-0 Nitrogen Fertilizer 50lb Bag' },
      { id: '6', merchant: 'Farm & Fleet', amount: 6200, category: 'fertilizer', date: '2024-03-18', sku: 'FF-PHOS-0-46-0-50LB', productName: 'Triple Super Phosphate 0-46-0 Fertilizer 50lb' },
      { id: '19', merchant: 'Agrium Crop Nutrition', amount: 15200, category: 'fertilizer', date: '2024-04-02', sku: 'AGR-AMMONIUM-NITRATE-34-0-0', productName: 'Ammonium Nitrate 34-0-0 Fertilizer 50lb' },
      { id: '20', merchant: 'Yara North America', amount: 11200, category: 'fertilizer', date: '2024-04-10', sku: 'YAR-POTASH-0-0-60-50LB', productName: 'Muriate of Potash 0-0-60 Fertilizer 50lb' },
      { id: '21', merchant: 'Nutrien Ag Solutions', amount: 9800, category: 'fertilizer', date: '2024-04-15', sku: 'NUT-DAP-18-46-0-50LB', productName: 'Diammonium Phosphate DAP 18-46-0 50lb' },
      { id: '22', merchant: 'Simplot Grower Solutions', amount: 13400, category: 'fertilizer', date: '2024-04-20', sku: 'SIM-MAP-11-52-0-50LB', productName: 'Monoammonium Phosphate MAP 11-52-0 50lb' },
      { id: '23', merchant: 'CF Industries', amount: 8900, category: 'fertilizer', date: '2024-04-25', sku: 'CF-ANHYDROUS-AMMONIA-82-0-0', productName: 'Anhydrous Ammonia 82-0-0 Fertilizer Bulk' },
      { id: '24', merchant: 'Tractor Supply Co', amount: 7200, category: 'fertilizer', date: '2024-05-01', sku: 'TS-LIME-AGRICULTURAL-50LB', productName: 'Agricultural Lime pH Amendment 50lb Bag' },
      { id: '25', merchant: 'Rural King Supply', amount: 5600, category: 'fertilizer', date: '2024-05-05', sku: 'RK-MICRONUTRIENTS-ZN-MN-5LB', productName: 'Zinc & Manganese Micronutrient Mix 5lb' },
      
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


  const generateFallbackRecommendation = (category: string, data: { total: number; count: number }): string => {
    if (category === 'fertilizer' && data.total > 50000) {
      return 'Your fertilizer spending is significant. Consider implementing cover crops, compost application, and crop rotation to reduce synthetic fertilizer dependency by 60-80%. This could save $30,000+ annually while improving soil health.'
    } else if (category === 'fertilizer' && data.total > 20000) {
      return 'Moderate fertilizer spending detected. Explore organic alternatives like compost tea, manure application, and legume cover crops to reduce costs by 40-60% while maintaining yields.'
    } else if (category === 'pesticides' && data.total > 3000) {
      return 'Pesticide spending is high. Beneficial insects, crop rotation, and integrated pest management can eliminate 70-90% of pesticide needs, saving thousands while improving ecosystem health.'
    } else if (category === 'fuel' && data.total > 2000) {
      return 'Reduce fuel costs by implementing no-till practices, optimizing field routes, and using cover crops to reduce tillage passes. Potential savings: $2,000-3,000 per season.'
    } else if (category === 'seeds') {
      return 'Seed investment is essential. Consider heirloom varieties and seed saving programs for long-term cost reduction. Your current seed spending is appropriate for quality yields.'
    } else {
      return 'Spending in this category is within normal range. Continue monitoring for optimization opportunities.'
    }
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Farmer Expenditure Analysis</h1>
              <p className="text-gray-600">We analyze your farm spending patterns using AI to identify cost-effective opportunities and optimize your operational expenses</p>
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
              <p className="text-sm text-gray-600">Total Farm Expenditures</p>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">${totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Analyzed this growing season</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">AI-Identified Savings</p>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">${totalNegativeImpact.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Cost-effective opportunities found</p>
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
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-800">AI-Powered Spending Habits Analysis</h2>
            </div>
            <p className="text-sm text-gray-600 ml-8">Dedalus AI analyzes your expenditure patterns to identify cost-effective farming practices and spending optimization opportunities</p>
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-blue-900 mb-3">AI-Powered Cost-Effective Recommendation:</p>
                      <div className="prose prose-sm max-w-none">
                        <FormattedRecommendation text={insight.recommendation} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Detailed Farm Purchase History</h2>
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

