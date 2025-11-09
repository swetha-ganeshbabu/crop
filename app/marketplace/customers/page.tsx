'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Search, Filter, User, Mail, Package, DollarSign, Calendar, TrendingDown, Sparkles, MapPin, Star } from 'lucide-react'

interface MarketplaceItem {
  id: string
  farmerName: string
  farmName: string
  itemName: string
  category: 'fertilizer' | 'seeds' | 'equipment' | 'crops' | 'other'
  description: string
  price: number
  quantity: string
  location: string
  postedDate: string
  contactEmail: string
  contactPhone?: string
  imageUrl?: string
}

interface PriceAnalysis {
  farmerPrice: number
  marketAverage: number
  priceDifference: number
  savingsPercent: number
  isCompetitive: boolean
  valueProposition: string[]
}

export default function CustomerMarketplacePage() {
  const router = useRouter()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MarketplaceItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [priceAnalysis, setPriceAnalysis] = useState<Record<string, PriceAnalysis>>({})

  useEffect(() => {
    // Load marketplace items (same as farmer marketplace)
    const mockItems: MarketplaceItem[] = [
      {
        id: '1',
        farmerName: 'John Smith',
        farmName: 'Green Valley Farm',
        itemName: 'Organic NPK Fertilizer',
        category: 'fertilizer',
        description: 'High-quality organic fertilizer, 50lb bags. Extra supply from last season.',
        price: 45,
        quantity: '10 bags',
        location: 'Iowa',
        postedDate: '2024-03-20',
        contactEmail: 'john@greenvalley.com',
        contactPhone: '(555) 123-4567',
      },
      {
        id: '2',
        farmerName: 'Sarah Johnson',
        farmName: 'Sunrise Acres',
        itemName: 'Corn Hybrid Seeds',
        category: 'seeds',
        description: 'Premium corn hybrid seeds, 50lb bag. Based on our yield predictions, we have extra.',
        price: 320,
        quantity: '3 bags',
        location: 'Nebraska',
        postedDate: '2024-03-19',
        contactEmail: 'sarah@sunrise.com',
      },
      {
        id: '3',
        farmerName: 'Mike Davis',
        farmName: 'Davis Family Farm',
        itemName: 'Fresh Organic Tomatoes',
        category: 'crops',
        description: 'Fresh organic tomatoes, picked daily. Grown using regenerative farming practices.',
        price: 25,
        quantity: '20 lbs',
        location: 'Kansas',
        postedDate: '2024-03-18',
        contactEmail: 'mike@davisfarm.com',
        contactPhone: '(555) 987-6543',
      },
    ]
    setItems(mockItems)
    setFilteredItems(mockItems)

    // Fetch price analysis for all items
    mockItems.forEach(item => {
      fetchPriceAnalysis(item)
    })
  }, [])

  useEffect(() => {
    // Filter items based on search and category
    let filtered = items

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }, [searchTerm, selectedCategory, items])

  const fetchPriceAnalysis = async (item: MarketplaceItem) => {
    try {
      const response = await fetch('/api/marketplace-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerPrice: item.price,
          productName: item.itemName,
          category: item.category,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setPriceAnalysis(prev => ({ ...prev, [item.id]: data }))
      }
    } catch (error) {
      console.error('Price analysis error:', error)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      fertilizer: 'bg-red-100 text-red-800',
      seeds: 'bg-blue-100 text-blue-800',
      equipment: 'bg-purple-100 text-purple-800',
      crops: 'bg-green-100 text-green-800',
      other: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || colors.other
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Buy from Local Farmers</h1>
              <p className="text-gray-600">Fresh, local products directly from farmers - Better prices, better quality</p>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Price Intelligence</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for fresh produce, seeds, fertilizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Categories</option>
                <option value="crops">Fresh Produce</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="seeds">Seeds</option>
                <option value="equipment">Equipment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Marketplace Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{item.itemName}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-bold text-green-600 text-lg">${item.price}</span>
                </div>
                {priceAnalysis[item.id] && priceAnalysis[item.id].priceDifference > 0 && (
                  <div className="flex items-center justify-between text-sm bg-green-50 p-2 rounded">
                    <span className="text-green-700 font-medium">You Save:</span>
                    <span className="font-bold text-green-600 flex items-center space-x-1">
                      <TrendingDown className="h-4 w-4" />
                      <span>${priceAnalysis[item.id].priceDifference.toFixed(2)} ({priceAnalysis[item.id].savingsPercent}%)</span>
                    </span>
                  </div>
                )}
                {priceAnalysis[item.id] && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>vs. Market Average:</span>
                    <span>${priceAnalysis[item.id].marketAverage.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.location}</span>
                  </span>
                </div>
              </div>

              {priceAnalysis[item.id] && priceAnalysis[item.id].valueProposition.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="h-3 w-3 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-900">Why Buy from Farmers:</span>
                  </div>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {priceAnalysis[item.id].valueProposition.slice(0, 3).map((prop, idx) => (
                      <li key={idx} className="flex items-start space-x-1">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{prop}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.farmerName}</p>
                    <p className="text-xs text-gray-500">{item.farmName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                  <Calendar className="h-3 w-3" />
                  <span>Posted {new Date(item.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={`mailto:${item.contactEmail}`}
                    className="flex-1 px-3 py-2 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contact Farmer</span>
                  </a>
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No items found. Check back soon for fresh local products!</p>
          </div>
        )}
      </div>
    </div>
  )
}

