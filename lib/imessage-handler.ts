/**
 * iMessage Handler Library
 * 
 * This file contains helper functions for processing iMessage requests
 * and formatting responses for Photon iMessage Kit.
 * 
 * Beginner Explanation:
 * - This is like a "translator" between iMessage and our app
 * - It takes messages from iMessage and converts them to work with our AI
 * - It also formats our AI responses so iMessage can display them nicely
 */

// Import the shared AI response function
// This will be used by both iMessage and web interfaces
import { generateAIResponse } from './ai-response'

/**
 * Process an incoming iMessage
 * 
 * @param message - The text message from the farmer
 * @param userId - Optional user ID for context
 * @returns Formatted response for iMessage
 */
export async function processiMessage(
  message: string,
  userId?: string
): Promise<{
  text: string
  actions?: Array<{ type: string; label: string; url: string }>
  images?: string[]
}> {
  // Get AI response
  const response = await generateAIResponse(message, userId)

  // Format for iMessage
  return {
    text: response.text,
    actions: response.actions || [],
  }
}

/**
 * Format a response for iMessage with rich content
 */
export function formatiMessageResponse(
  text: string,
  actions?: Array<{ type: string; label: string; url: string }>
) {
  return {
    text,
    actions: actions || [],
    timestamp: new Date().toISOString(),
  }
}

