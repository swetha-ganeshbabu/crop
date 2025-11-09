/**
 * Knot API Configuration
 * 
 * Centralized configuration for Knot Transaction Link API
 * Dev environment credentials for hackathon
 */

export const KNOT_CONFIG = {
  // Dev Environment Credentials
  CLIENT_ID: 'dda0778d-9486-47f8-bd80-6f2512f9bcdb',
  SECRET: 'ff5e51b6dcf84a829898d37449cbc47a',
  
  // API Endpoints
  SESSION_URL: 'https://development.knotapi.com/session/create',
  TRANSACTIONS_URL: 'https://development.knotapi.com/transactions/sync',
  
  // Environment
  ENVIRONMENT: 'development' as const,
  
  // Generate Basic Auth header
  getAuthHeader: (): string => {
    const authString = Buffer.from(`${KNOT_CONFIG.CLIENT_ID}:${KNOT_CONFIG.SECRET}`).toString('base64')
    return `Basic ${authString}`
  },
}

