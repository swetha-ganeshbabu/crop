'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calculator, TrendingUp, Clock, DollarSign, CheckCircle, AlertTriangle, ArrowRight, LandPlot, Sprout, X, Loader2, Banknote, Calendar, FileText } from 'lucide-react'

interface FeasibilityAnalysis {
  isFeasible: boolean
  totalCost: number
  timeToComplete: string
  breakdown: {
    landPreparation: number
    seeds: number
    fertilizer: number
    equipment: number
    labor: number
    irrigation: number
    other: number
  }
  loanRequired: number
  monthlyPayment?: number
  roi: number
  recommendations: string[]
}

export default function StarterKitPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    cropType: 'corn',
    acres: '',
    currentBudget: '',
    hasEquipment: false,
    hasIrrigation: false,
    location: '',
  })
  const [analysis, setAnalysis] = useState<FeasibilityAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [showLoan, setShowLoan] = useState(false)
  const [loanModal, setLoanModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'loading'
    title: string
    message: string
    loanDetails?: {
      amount: number
      status: string
      monthlyPayment: number
      loanId?: string
    }
    errorDetails?: string
  } | null>(null)

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

  const calculateFeasibility = async () => {
    setLoading(true)
    
    // Simulate AI analysis (in production, this would call an AI service)
    await new Promise(resolve => setTimeout(resolve, 1500))

    const acres = parseFloat(formData.acres) || 0
    const currentBudget = parseFloat(formData.currentBudget) || 0

    // Cost estimates per acre (varies by crop)
    const costPerAcre: Record<string, number> = {
      corn: 450,
      soybeans: 380,
      wheat: 320,
      vegetables: 1200,
      fruits: 2000,
    }

    const baseCostPerAcre = costPerAcre[formData.cropType] || 450
    const totalBaseCost = baseCostPerAcre * acres

    // Breakdown
    const breakdown = {
      landPreparation: Math.round(totalBaseCost * 0.15),
      seeds: Math.round(totalBaseCost * 0.25),
      fertilizer: Math.round(totalBaseCost * 0.20),
      equipment: formData.hasEquipment ? 0 : Math.round(totalBaseCost * 0.15),
      labor: Math.round(totalBaseCost * 0.15),
      irrigation: formData.hasIrrigation ? 0 : Math.round(totalBaseCost * 0.08),
      other: Math.round(totalBaseCost * 0.02),
    }

    const totalCost = Object.values(breakdown).reduce((sum, val) => sum + val, 0)
    const loanRequired = Math.max(0, totalCost - currentBudget)
    const isFeasible = loanRequired <= currentBudget * 2 // Can borrow up to 2x current budget

    // Time estimate (months)
    const timeByCrop: Record<string, string> = {
      corn: '4-5 months',
      soybeans: '3-4 months',
      wheat: '3-4 months',
      vegetables: '2-6 months',
      fruits: '12-24 months',
    }
    const timeToComplete = timeByCrop[formData.cropType] || '4-5 months'

    // ROI estimate (conservative)
    const revenuePerAcre: Record<string, number> = {
      corn: 925, // 185 bushels * $5
      soybeans: 520, // 52 bushels * $10
      wheat: 340, // 68 bushels * $5
      vegetables: 3000,
      fruits: 5000,
    }
    const estimatedRevenue = (revenuePerAcre[formData.cropType] || 925) * acres
    const roi = ((estimatedRevenue - totalCost) / totalCost) * 100

    const recommendations: string[] = []
    if (!isFeasible) {
      recommendations.push('Consider starting with fewer acres or a different crop type')
      recommendations.push('Explore government grants and subsidies for new farmers')
    }
    if (loanRequired > 0) {
      recommendations.push(`You may need a loan of $${loanRequired.toLocaleString()}`)
    }
    if (roi < 20) {
      recommendations.push('ROI is moderate - consider optimizing costs or choosing higher-value crops')
    }
    if (!formData.hasEquipment) {
      recommendations.push('Consider renting equipment initially to reduce upfront costs')
    }

    setAnalysis({
      isFeasible,
      totalCost,
      timeToComplete,
      breakdown,
      loanRequired,
      roi,
      recommendations,
    })
    setLoading(false)
  }

  const handleLoanApplication = async () => {
    if (!analysis || analysis.loanRequired <= 0) return

    setLoading(true)
    setLoanModal({
      isOpen: true,
      type: 'loading',
      title: 'Processing Loan Application',
      message: 'Creating your Capital One account and processing your loan application...',
    })
    try {
      // Step 1: Create or get customer in Capital One
      const userData = user || {}
      const customerResponse = await fetch('/api/capital-one/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: userData.name?.split(' ')[0] || 'Farmer',
          lastName: userData.name?.split(' ')[1] || 'User',
          city: formData.location || 'Farm City',
          state: formData.location || 'IA',
          email: userData.email || '',
        }),
      })

      const customerData = await customerResponse.json()
      const customerId = customerData.customerId || customerData.customer?._id

      if (!customerId) {
        setLoanModal({
          isOpen: true,
          type: 'error',
          title: 'Customer Creation Failed',
          message: 'Failed to create customer account.',
          errorDetails: 'Please check your Capital One API key and try again.',
        })
        setLoading(false)
        return
      }

      // Step 2: Create a regular account first (required for loans)
      const accountResponse = await fetch('/api/capital-one/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_account',
          customerId: customerId,
          accountType: 'Savings',
          initialDeposit: 0,
          nickname: `Farm Account - ${userData.name || 'Farmer'}`,
        }),
      })

      const accountData = await accountResponse.json()
      
      if (!accountData.success) {
        setLoanModal({
          isOpen: true,
          type: 'error',
          title: 'Account Creation Failed',
          message: accountData.error || 'Failed to create account',
          errorDetails: accountData.details || 'Please try again.',
        })
        setLoading(false)
        return
      }

      const accountId = accountData.accountId || accountData.account?._id

      if (!accountId) {
        console.error('Account creation response:', accountData)
        setLoanModal({
          isOpen: true,
          type: 'error',
          title: 'Account Creation Failed',
          message: 'Failed to create account.',
          errorDetails: 'Please check the console for details.',
        })
        setLoading(false)
        return
      }

      // Step 3: Create loan using the proper loan endpoint
      const loanResponse = await fetch('/api/capital-one/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: accountId,
          type: 'home', // Loan type
          amount: analysis.loanRequired,
          monthlyPayment: Math.round(analysis.loanRequired / 60), // 5-year loan estimate
          creditScore: 687, // Default credit score
          description: `Farm loan for ${formData.cropType} cultivation on ${formData.acres} acres`,
        }),
      })

      const loanData = await loanResponse.json()

      if (loanData.success) {
        setShowLoan(true)
        setLoanModal({
          isOpen: true,
          type: 'success',
          title: 'Loan Application Successful! 🎉',
          message: 'Your loan application has been submitted to Capital One.',
          loanDetails: {
            amount: analysis.loanRequired,
            status: loanData.loan?.status || 'pending',
            monthlyPayment: Math.round(analysis.loanRequired / 60),
            loanId: loanData.loanId,
          },
        })
      } else {
        setLoanModal({
          isOpen: true,
          type: 'error',
          title: 'Loan Application Failed',
          message: loanData.error || 'Failed to create loan',
          errorDetails: loanData.details || 'Please try again.',
        })
      }
    } catch (error) {
      console.error('Loan application error:', error)
      setLoanModal({
        isOpen: true,
        type: 'error',
        title: 'Application Error',
        message: 'Failed to process loan application.',
        errorDetails: 'Please try again or contact support if the issue persists.',
      })
    } finally {
      setLoading(false)
    }
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
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">New Land Starter Kit</h1>
              <p className="text-gray-600">Plan your new farm venture with AI-powered feasibility analysis</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Project Details</h2>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); calculateFeasibility(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                >
                  <option value="corn">Corn</option>
                  <option value="soybeans">Soybeans</option>
                  <option value="wheat">Wheat</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acres to Develop</label>
                <input
                  type="number"
                  value={formData.acres}
                  onChange={(e) => setFormData({ ...formData, acres: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  placeholder="e.g., 50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Budget ($)</label>
                <input
                  type="number"
                  value={formData.currentBudget}
                  onChange={(e) => setFormData({ ...formData, currentBudget: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  placeholder="e.g., 50000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
                  placeholder="State or Region"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasEquipment}
                    onChange={(e) => setFormData({ ...formData, hasEquipment: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">I already have necessary equipment</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasIrrigation}
                    onChange={(e) => setFormData({ ...formData, hasIrrigation: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Irrigation system is already in place</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5" />
                    <span>Calculate Feasibility</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Feasibility Status */}
              <div className={`rounded-lg shadow-md p-6 ${analysis.isFeasible ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  {analysis.isFeasible ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {analysis.isFeasible ? 'Project is Feasible!' : 'Project Needs Adjustment'}
                    </h3>
                    <p className="text-sm text-gray-600">Based on AI analysis</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Cost</p>
                    <p className="text-2xl font-bold text-gray-800">${analysis.totalCost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Time to Complete</p>
                    <p className="text-2xl font-bold text-gray-800">{analysis.timeToComplete}</p>
                  </div>
                </div>

                {analysis.loanRequired > 0 && (
                  <div className="bg-white rounded p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Loan Required</p>
                    <p className="text-3xl font-bold text-green-600">${analysis.loanRequired.toLocaleString()}</p>
                    <button
                      onClick={handleLoanApplication}
                      disabled={loading}
                      className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4" />
                          <span>Apply for Capital One Loan</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    {showLoan && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                        <p className="text-sm text-green-800">
                          ✅ Loan application submitted! Check your Capital One account for details.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white rounded p-4">
                  <p className="text-sm text-gray-600 mb-1">Estimated ROI</p>
                  <p className={`text-2xl font-bold ${analysis.roi > 30 ? 'text-green-600' : analysis.roi > 15 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {analysis.roi.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(analysis.breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-semibold text-gray-800">${value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-800 mb-2">AI Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!analysis && (
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <Calculator className="h-16 w-16 mx-auto mb-4" />
                <p>Fill out the form and click &quot;Calculate Feasibility&quot; to see your analysis</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loan Application Modal */}
      {loanModal && loanModal.isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setLoanModal(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-md w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 rounded-t-lg ${
              loanModal.type === 'success' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-700' 
                : loanModal.type === 'error'
                ? 'bg-gradient-to-r from-red-600 to-rose-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-700'
            } text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {loanModal.type === 'success' ? (
                    <CheckCircle className="h-8 w-8" />
                  ) : loanModal.type === 'error' ? (
                    <AlertTriangle className="h-8 w-8" />
                  ) : (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  )}
                  <h2 className="text-2xl font-bold">{loanModal.title}</h2>
                </div>
                <button
                  onClick={() => setLoanModal(null)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {loanModal.type === 'loading' ? (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">{loanModal.message}</p>
                </div>
              ) : loanModal.type === 'success' && loanModal.loanDetails ? (
                <div className="space-y-4">
                  <p className="text-gray-700">{loanModal.message}</p>
                  
                  {/* Loan Details Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Banknote className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">Loan Amount</span>
                        </div>
                        <span className="text-2xl font-bold text-green-700">
                          ${loanModal.loanDetails.amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">Monthly Payment</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-800">
                          ${loanModal.loanDetails.monthlyPayment.toLocaleString()}/mo
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">Status</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          loanModal.loanDetails.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {loanModal.loanDetails.status.toUpperCase()}
                        </span>
                      </div>

                      {loanModal.loanDetails.loanId && (
                        <div className="pt-3 border-t border-green-200">
                          <p className="text-xs text-gray-500">Loan ID: {loanModal.loanDetails.loanId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <p className="text-sm text-blue-800">
                      ✅ Your loan application has been submitted. You'll receive updates via email.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">{loanModal.message}</p>
                  {loanModal.errorDetails && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                      <p className="text-sm text-red-800">{loanModal.errorDetails}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                {loanModal.type === 'error' && (
                  <button
                    onClick={() => {
                      setLoanModal(null)
                      handleLoanApplication()
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={() => setLoanModal(null)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    loanModal.type === 'success'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {loanModal.type === 'success' ? 'Great!' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

