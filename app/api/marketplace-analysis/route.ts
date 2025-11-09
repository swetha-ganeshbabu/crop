import { NextResponse } from 'next/server'

// Marketplace Price Analysis using Dedalus Labs AI
// Analyzes farmer prices vs. consumer market prices and provides AI-powered recommendations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { farmerPrice, productName, category, consumerPrices } = body

    // Step 1: Get consumer prices from Amazon Nova
    let marketPrices: any[] = []
    let averageMarketPrice = farmerPrice * 1.2 // Default estimate

    try {
      const novaResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/amazon-nova`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productName, category }),
        }
      )

      if (novaResponse.ok) {
        const novaData = await novaResponse.json()
        marketPrices = novaData.prices || []
        averageMarketPrice = novaData.averagePrice || averageMarketPrice
      }
    } catch (error) {
      console.error('Amazon Nova fetch error:', error)
      // Use provided consumerPrices or generate fallback
      marketPrices = consumerPrices || []
    }

    // Step 2: Calculate price comparison metrics
    const priceDifference = averageMarketPrice - farmerPrice
    const priceDifferencePercent = ((priceDifference / averageMarketPrice) * 100).toFixed(1)
    const isCompetitive = farmerPrice <= averageMarketPrice * 1.1 // Within 10% of market
    const savingsPercent = priceDifference > 0 
      ? ((priceDifference / averageMarketPrice) * 100).toFixed(1)
      : '0'

    // Step 3: Use Dedalus Labs for AI-powered analysis
    let aiAnalysis = ''
    let aiRecommendation = ''

    try {
      const dedalusResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dedalus`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: `You are a marketplace pricing analyst for a farmer-to-consumer agricultural marketplace. Analyze this pricing scenario:

**Product Details:**
- Product: ${productName}
- Category: ${category}
- Farmer's Price: $${farmerPrice}

**Market Analysis:**
- Average Consumer Market Price: $${averageMarketPrice.toFixed(2)}
- Price Difference: $${priceDifference.toFixed(2)} (${priceDifferencePercent}%)
- Market Prices from Retailers: ${marketPrices.map((p: any) => `${p.site}: $${p.price}`).join(', ')}

**Your Task:**
Provide a comprehensive analysis with:
1. Competitive positioning: Is the farmer's price competitive compared to retail?
2. Pricing recommendation: Should the farmer adjust their price? If so, by how much?
3. Market positioning advice: How should the farmer position their product?
4. Value proposition: What unique value does buying from a farmer offer vs. retail (local, fresh, direct, supporting local economy)?

Format your response as a clear, actionable analysis that helps the farmer make informed pricing decisions.`,
          }),
        }
      )

      if (dedalusResponse.ok) {
        const dedalusData = await dedalusResponse.json()
        aiAnalysis = dedalusData.final_output || ''
        
        // Extract recommendation from AI analysis
        if (aiAnalysis) {
          // Try to extract a concise recommendation
          const recommendationMatch = aiAnalysis.match(/recommendation[:\s]+([^\.]+)/i) ||
                                    aiAnalysis.match(/should[^\.]+(?:price|adjust)[^\.]+/i)
          aiRecommendation = recommendationMatch 
            ? recommendationMatch[1].trim() 
            : generateFallbackRecommendation(farmerPrice, averageMarketPrice, priceDifferencePercent)
        }
      }
    } catch (error) {
      console.error('Dedalus API error:', error)
      aiAnalysis = generateFallbackAnalysis(farmerPrice, averageMarketPrice, priceDifferencePercent)
      aiRecommendation = generateFallbackRecommendation(farmerPrice, averageMarketPrice, priceDifferencePercent)
    }

    // If AI analysis failed, use fallback
    if (!aiAnalysis) {
      aiAnalysis = generateFallbackAnalysis(farmerPrice, averageMarketPrice, priceDifferencePercent)
      aiRecommendation = generateFallbackRecommendation(farmerPrice, averageMarketPrice, priceDifferencePercent)
    }

    return NextResponse.json({
      success: true,
      farmerPrice,
      marketAverage: Math.round(averageMarketPrice * 100) / 100,
      priceDifference: Math.round(priceDifference * 100) / 100,
      priceDifferencePercent: parseFloat(priceDifferencePercent),
      savingsPercent: parseFloat(savingsPercent),
      isCompetitive,
      marketPrices,
      aiAnalysis,
      recommendation: aiRecommendation || generateFallbackRecommendation(farmerPrice, averageMarketPrice, priceDifferencePercent),
      valueProposition: generateValueProposition(category, priceDifference > 0),
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Marketplace analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze marketplace pricing' },
      { status: 500 }
    )
  }
}

function generateFallbackAnalysis(farmerPrice: number, marketAverage: number, diffPercent: string): string {
  const diff = marketAverage - farmerPrice
  const percent = parseFloat(diffPercent)
  
  if (diff > 0 && percent > 15) {
    return `Your price of $${farmerPrice} is significantly below the market average of $${marketAverage.toFixed(2)} (${diffPercent}% lower). This is a strong competitive advantage! You're offering excellent value to customers while potentially leaving money on the table. Consider increasing your price by 5-10% while still maintaining a competitive edge.`
  } else if (diff > 0 && percent > 5) {
    return `Your price of $${farmerPrice} is below the market average of $${marketAverage.toFixed(2)} (${diffPercent}% lower). This competitive pricing will attract price-conscious customers. You can maintain this price to maximize sales volume, or consider a small increase (3-5%) to improve margins while staying competitive.`
  } else if (diff > 0) {
    return `Your price of $${farmerPrice} is slightly below the market average of $${marketAverage.toFixed(2)}. This is a good competitive position. You're offering value while maintaining reasonable margins. Consider maintaining this price or a small increase (2-3%) if demand is strong.`
  } else if (Math.abs(percent) > 15) {
    return `Your price of $${farmerPrice} is above the market average of $${marketAverage.toFixed(2)} (${Math.abs(percent).toFixed(1)}% higher). To remain competitive, consider reducing your price by 10-15%, or emphasize your unique value proposition: local sourcing, freshness, direct-from-farm quality, and supporting local agriculture.`
  } else {
    return `Your price of $${farmerPrice} is close to the market average of $${marketAverage.toFixed(2)}. This is a balanced position. Focus on highlighting your unique value: local, fresh, direct-from-farm benefits that retail can't match.`
  }
}

function generateFallbackRecommendation(farmerPrice: number, marketAverage: number, diffPercent: string): string {
  const diff = marketAverage - farmerPrice
  const percent = parseFloat(diffPercent)
  
  if (diff > 0 && percent > 15) {
    return 'Consider increasing price by 5-10% while maintaining competitive advantage'
  } else if (diff > 0 && percent > 5) {
    return 'Maintain current price or consider small increase (3-5%) if demand is strong'
  } else if (diff > 0) {
    return 'Current price is competitive. Maintain or consider small increase (2-3%)'
  } else if (Math.abs(percent) > 15) {
    return 'Consider reducing price by 10-15% or emphasize unique value proposition'
  } else {
    return 'Price is balanced. Focus on value proposition and quality differentiation'
  }
}

function generateValueProposition(category: string, isLowerPrice: boolean): string[] {
  const baseProps = [
    'Direct from farm - fresher than retail',
    'Support local agriculture and farmers',
    'Know your farmer - transparency and trust',
    'Often higher quality than mass-produced retail items',
  ]

  if (isLowerPrice) {
    baseProps.unshift(`Save ${isLowerPrice ? 'money' : ''} compared to retail stores`)
  }

  if (category === 'crops') {
    baseProps.push('Picked at peak ripeness for best flavor')
    baseProps.push('Reduced food miles - better for environment')
  } else if (category === 'fertilizer' || category === 'seeds') {
    baseProps.push('Expert advice from experienced farmers')
    baseProps.push('Products tested in real farming conditions')
  }

  return baseProps
}

