#!/usr/bin/env node

/**
 * Photon iMessage Kit Integration Script
 * 
 * This script:
 * 1. Watches for new iMessages
 * 2. Forwards them to your webhook
 * 3. Optionally sends AI responses back to iMessage
 */

import { IMessageSDK } from '@photon-ai/imessage-kit'

// Your webhook URL (deployed on Vercel)
const WEBHOOK_URL = 'https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage'

// Your iPhone number (with country code)
const YOUR_PHONE_NUMBER = process.env.PHONE_NUMBER || '+17745784895'

// Track processed messages to avoid duplicates
const processedMessageIds = new Set<string>()

// Track last check time to only process new messages
let lastCheckTime = Date.now()

// Initialize SDK
const sdk = new IMessageSDK({
  debug: true,
  maxConcurrent: 5
})

/**
 * Forward message to webhook
 */
async function forwardToWebhook(message: string, sender: string): Promise<string | null> {
  try {
    console.log(`📤 Forwarding to webhook: "${message.substring(0, 50)}..." from ${sender}`)
    
    const payload = {
      event: 'new_message',
      message: {
        text: message,
        sender: sender,
        senderName: sender,
      },
    }
    
    // Debug: Log the payload being sent
    console.log('📦 Payload:', JSON.stringify(payload, null, 2).substring(0, 200) + '...')
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ Webhook error (${response.status}):`, errorText)
      console.error('📦 Failed payload:', JSON.stringify(payload, null, 2).substring(0, 300))
      return null
    }

    const data = await response.json()
    console.log(`✅ Webhook response received`)
    console.log(`📝 Response text: ${(data.text || data.message || '').substring(0, 100)}...`)
    
    // Return the AI response text
    return data.text || data.message || null
  } catch (error) {
    console.error('❌ Error calling webhook:', error)
    return null
  }
}

/**
 * Send response back to iMessage
 */
async function sendResponse(sender: string, responseText: string) {
  try {
    console.log(`📱 Sending response to ${sender}: "${responseText}"`)
    await sdk.send(sender, responseText)
    console.log(`✅ Response sent!`)
  } catch (error) {
    console.error(`❌ Error sending response:`, error)
  }
}

/**
 * Process a new message
 */
async function processMessage(message: any) {
  const messageId = message.guid || message.id || `${message.date}-${message.text}`
  
  // Skip if already processed
  if (processedMessageIds.has(messageId)) {
    return
  }
  
  // Skip if it's from us (to avoid loops)
  if (message.isFromMe) {
    return
  }
  
  // Skip if no text
  if (!message.text || message.text.trim().length === 0) {
    return
  }
  
  // Mark as processed
  processedMessageIds.add(messageId)
  
  const sender = message.handle?.id || message.sender || 'unknown'
  const text = message.text.trim()
  
  console.log(`\n📨 New message from ${sender}: "${text}"`)
  
  // Forward to webhook
  const aiResponse = await forwardToWebhook(text, sender)
  
  // Send response back to iMessage
  if (aiResponse) {
    await sendResponse(sender, aiResponse)
  } else {
    console.log(`⚠️  No response from webhook, skipping reply`)
  }
}

/**
 * Watch for new messages
 */
async function watchMessages() {
  console.log('👀 Watching for new messages...')
  console.log(`📱 Monitoring: ${YOUR_PHONE_NUMBER}`)
  console.log(`🌐 Webhook: ${WEBHOOK_URL}\n`)
  
  // Get initial unread messages
  try {
    const unreadMessages = await sdk.getUnreadMessages()
    console.log(`📬 Found ${unreadMessages.length} conversation(s) with unread messages`)
    
    for (const { sender, messages } of unreadMessages) {
      console.log(`  - ${sender}: ${messages.length} unread`)
      
      for (const message of messages) {
        await processMessage(message)
        // Update last check time to message date if available
        if (message.date) {
          const messageTime = new Date(message.date).getTime()
          if (messageTime > lastCheckTime) {
            lastCheckTime = messageTime
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Error getting unread messages:', error)
  }
  
  // Poll for new messages every 2 seconds
  let pollCount = 0
  setInterval(async () => {
    try {
      pollCount++
      const currentCheckTime = Date.now()
      
      // Get unread messages (primary method)
      const unreadMessages = await sdk.getUnreadMessages()
      
      let newMessagesFound = 0
      for (const { sender, messages } of unreadMessages) {
        for (const message of messages) {
          // Check if message is newer than last check
          if (message.date) {
            const messageTime = new Date(message.date).getTime()
            if (messageTime > lastCheckTime) {
              await processMessage(message)
              newMessagesFound++
              if (messageTime > lastCheckTime) {
                lastCheckTime = messageTime
              }
            }
          } else {
            // Process if no date (might be new)
            await processMessage(message)
            newMessagesFound++
          }
        }
      }
      
      // Log polling status every 10 polls (20 seconds)
      if (pollCount % 10 === 0) {
        console.log(`🔍 Polling... (${pollCount} polls, ${newMessagesFound} new messages this cycle)`)
      }
      
      // Update last check time
      lastCheckTime = currentCheckTime
    } catch (error) {
      console.error('❌ Error polling messages:', error)
    }
  }, 2000) // Poll every 2 seconds
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Photon iMessage Integration')
  console.log('=====================================\n')
  console.log(`📱 Phone Number: ${YOUR_PHONE_NUMBER}\n`)
  
  // Start watching
  await watchMessages()
  
  // Keep process alive
  console.log('\n✅ Integration running! Press Ctrl+C to stop.\n')
}

// Run main function
main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})

