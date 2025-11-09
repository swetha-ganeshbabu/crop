# Photon iMessage Kit Integration - Setup Guide

## 🎯 What We Just Built

We've created the backend infrastructure for Photon iMessage Kit integration. Here's what each file does:

### **1. `/app/api/imessage/route.ts`** - The Main Endpoint
**What it does**: This is the "receptionist" that receives messages from Photon iMessage Kit.

**How it works**:
- When a farmer sends a message via iMessage, Photon forwards it to this endpoint
- We process the message using our AI
- We send back a formatted response

**Example**:
```
Farmer (iMessage): "How's my soil health?"
    ↓
Photon forwards to: POST /api/imessage
    ↓
Our AI generates response
    ↓
Response sent back to iMessage
```

### **2. `/lib/ai-response.ts`** - The AI Brain
**What it does**: This is the shared "brain" that generates AI responses.

**Why it's important**: 
- Used by ChatBot (web)
- Used by iMessage (iPhone)
- Used by Voice Assistant (voice)
- **One brain, three interfaces!**

### **3. `/lib/imessage-handler.ts`** - Helper Functions
**What it does**: Helper functions specifically for iMessage formatting.

---

## 📱 How to Connect Photon iMessage Kit

### **Step 1: Install Photon iMessage Kit**

Based on Photon's documentation, you'll need to:

1. **Clone the Photon iMessage Kit repository**:
   ```bash
   git clone https://github.com/photon-hq/imessage-kit.git
   cd imessage-kit
   ```

2. **Follow their setup instructions** from the examples folder

### **Step 2: Configure Photon to Point to Your App**

In Photon's configuration, set your webhook URL to:
```
https://your-app-url.com/api/imessage
```

For local testing:
```
http://localhost:3000/api/imessage
```

### **Step 3: Test the Integration**

You can test the endpoint directly:

```bash
# Test with curl
curl -X POST http://localhost:3000/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "How is my soil health?", "userId": "test-farmer"}'
```

Expected response:
```json
{
  "text": "Your soil health is excellent! Your fungal-to-bacterial ratio is 0.8:1...",
  "actions": [
    {"type": "link", "label": "View Soil Health", "url": "/#soil-health"}
  ],
  "timestamp": "2024-01-XX..."
}
```

---

## 🧪 Testing Without Real iMessage

Since we can't test with real iMessage during development, we can create a test page:

### **Test Page**: `/app/test-imessage/page.tsx`

This page simulates what Photon would send, so you can test the integration.

---

## 🔄 How Messages Flow

```
┌─────────────────┐
│  Farmer's iPhone│
│   (iMessage)    │
└────────┬────────┘
         │ "How's my soil health?"
         ↓
┌─────────────────┐
│  Photon iMessage│
│      Kit        │
└────────┬────────┘
         │ Forwards to webhook
         ↓
┌─────────────────┐
│  /api/imessage  │ ← Our endpoint
│  (route.ts)     │
└────────┬────────┘
         │ Processes message
         ↓
┌─────────────────┐
│  AI Response    │ ← Uses shared AI brain
│  Generator      │
└────────┬────────┘
         │ Generates response
         ↓
┌─────────────────┐
│  Formatted      │
│  Response       │
└────────┬────────┘
         │ Sends back
         ↓
┌─────────────────┐
│  Photon iMessage│
│      Kit        │
└────────┬────────┘
         │ Delivers to iPhone
         ↓
┌─────────────────┐
│  Farmer's iPhone│
│   (iMessage)    │
│  "Your soil..." │
└─────────────────┘
```

---

## ✅ What's Ready

- ✅ API endpoint created (`/api/imessage`)
- ✅ Shared AI response function
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Response formatting for iMessage

## 🔜 What's Next

1. **Install Photon iMessage Kit** (follow their GitHub instructions)
2. **Configure webhook** to point to your `/api/imessage` endpoint
3. **Test with real iMessage** (once Photon is set up)
4. **Add proactive alerts** (send alerts without being asked)

---

## 📝 Example Messages You Can Test

Try these messages (via test page or curl):

- "How's my soil health?"
- "Show me my spending"
- "What should I plant?"
- "Status"
- "Tell me about my carbon impact"
- "What's my water usage?"

All of these will work because we've connected to your existing AI! 🎉

---

**Status**: Backend is ready! Just need to connect Photon iMessage Kit on their end. 🚀

