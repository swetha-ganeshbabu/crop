# Photon Track Integration Plan - FarmWise

## 🎯 Track: Exploring Hybrid Intelligence

**Goal**: Make FarmWise AI feel present, context-aware, and seamlessly integrated into farmers' daily workflows via iMessage.

---

## ✅ Current AI Features (Already Built)

### 1. **ChatBot Component** (`components/ChatBot.tsx`)
- ✅ Conversational AI assistant
- ✅ Voice input/output (ElevenLabs)
- ✅ Context-aware responses (Dedalus)
- ✅ Message history
- ✅ Floating popup interface

### 2. **InsightModal** (`components/InsightModal.tsx`)
- ✅ AI-powered insights (Gemini)
- ✅ Voice read-aloud (ElevenLabs)
- ✅ Context-aware analysis

### 3. **VoiceAlerts** (`components/VoiceAlerts.tsx`)
- ✅ Real-time alerts
- ✅ Voice notifications

### 4. **AI Integrations**
- ✅ Dedalus Labs (smart AI responses)
- ✅ Google Gemini (content analysis)
- ✅ ElevenLabs (natural voice)

---

## 🚀 Integration Strategy: iMessage Kit

### **Required**: Must integrate iMessage Kit to qualify

### **Approach**: Make FarmWise AI available in iMessage conversations

---

## 📱 Integration Ideas for Photon Track

### **1. iMessage Agent: "FarmWise Assistant"** ⭐ PRIMARY

**Concept**: AI agent that joins iMessage conversations naturally

**Features**:
- **Context-Aware**: Remembers farm data, previous conversations
- **Proactive**: Sends alerts about critical farm events
- **Conversational**: Participates in group chats with other farmers
- **Actionable**: Can trigger actions (e.g., "Check soil health" → sends dashboard link)

**Implementation**:
```typescript
// iMessage integration
- User texts: "How's my soil health?"
- FarmWise AI responds with real-time data
- Can send images, charts, links
- Remembers context across conversations
```

**Use Cases**:
1. **Solo Conversations**: Farmer chats with FarmWise AI directly
2. **Group Chats**: AI joins farmer groups, provides insights
3. **Proactive Alerts**: "⚠️ Field C needs irrigation - moisture at 38%"
4. **Quick Actions**: "Show me spending" → sends transaction summary

---

### **2. Context Persistence Across Platforms** ⭐

**Concept**: AI remembers context from dashboard → iMessage → voice

**Features**:
- User asks about soil health in dashboard
- Later asks in iMessage: "What about that field?"
- AI knows which field from previous context
- Context persists across all interfaces

**Implementation**:
- Store conversation context in database
- Link user sessions across platforms
- Maintain context window for each user

---

### **3. Multi-Agent Collaboration** ⭐

**Concept**: Multiple AI agents work together

**Agents**:
- **Soil Health Agent**: Monitors soil metrics
- **Weather Agent**: Tracks weather patterns
- **Spending Agent**: Analyzes transactions
- **Sustainability Agent**: Tracks carbon impact

**How They Collaborate**:
- Soil Agent: "Field A needs fertilizer"
- Spending Agent: "You spent $12,450 on fertilizer this month"
- Sustainability Agent: "Consider cover crops to reduce fertilizer costs"
- All agents contribute to one cohesive response

---

### **4. Seamless Interface Switching** ⭐

**Concept**: Start conversation in iMessage, continue in dashboard

**Flow**:
1. Farmer texts: "What's my carbon impact?"
2. AI responds in iMessage with summary
3. Farmer: "Show me details"
4. AI sends link to dashboard with pre-loaded carbon section
5. Context carries over - dashboard knows what they asked

---

### **5. Proactive Presence** ⭐

**Concept**: AI doesn't wait to be asked - it participates naturally

**Examples**:
- **Morning Check-in**: "Good morning! Your fields look great. Field B needs planting in 3 days."
- **Weather Alerts**: "Heavy rain expected tomorrow - consider delaying harvest"
- **Spending Insights**: "You've saved $31,000 this month through regenerative practices! 🎉"
- **Group Chat Participation**: In farmer group chat, AI suggests: "Based on your discussion, cover crops could help with that issue"

---

## 🔧 Technical Implementation Plan

### **Phase 1: iMessage Kit Integration** (Required)

#### Step 1: Install iMessage Kit
```bash
npm install @photon/imessage-kit
# or
git clone https://github.com/photon-hq/imessage-kit
```

#### Step 2: Create iMessage Agent Service
**File**: `app/api/imessage/route.ts`
```typescript
// Handle incoming iMessage webhooks
// Process messages
// Generate AI responses
// Send replies via iMessage Kit
```

#### Step 3: Connect to Existing AI
- Use existing `ChatBot` logic
- Use existing `generateAIResponse` (Dedalus)
- Use existing context awareness

#### Step 4: Add iMessage UI Component
**File**: `components/iMessageAgent.tsx`
- Show iMessage integration status
- Display recent iMessage conversations
- Link to enable/disable agent

---

### **Phase 2: Context Persistence** (Bonus)

#### Step 1: Create Context Store
**File**: `lib/context-store.ts`
- Store conversation history
- Link user sessions
- Maintain context window

#### Step 2: Update AI Responses
- Include context in all AI calls
- Remember previous questions
- Reference past conversations

---

### **Phase 3: Multi-Agent System** (Bonus)

#### Step 1: Create Agent Framework
**File**: `lib/agents/`
```
agents/
  - soil-health-agent.ts
  - weather-agent.ts
  - spending-agent.ts
  - sustainability-agent.ts
  - coordinator.ts (orchestrates all agents)
```

#### Step 2: Agent Coordination
- Each agent monitors specific data
- Coordinator combines insights
- Single unified response

---

### **Phase 4: Proactive Features** (Bonus)

#### Step 1: Event Monitoring
- Monitor farm data
- Detect significant changes
- Trigger proactive messages

#### Step 2: Smart Notifications
- Send alerts via iMessage
- Include actionable insights
- Link to relevant dashboard sections

---

## 📋 Implementation Checklist

### **Required (To Qualify)**:
- [ ] Install iMessage Kit
- [ ] Create iMessage webhook handler
- [ ] Connect to existing ChatBot AI
- [ ] Test basic iMessage conversation
- [ ] Deploy and verify integration

### **Bonus Features**:
- [ ] Context persistence across platforms
- [ ] Multi-agent collaboration
- [ ] Proactive alerts via iMessage
- [ ] Group chat participation
- [ ] Seamless dashboard ↔ iMessage switching

---

## 🎨 User Experience Flow

### **Scenario 1: Direct Conversation**
```
Farmer (iMessage): "How's my soil health?"
FarmWise AI: "Your soil health is excellent! Score: 82/100. 
              Organic matter: 4.2%, pH: 6.8. 
              Want details? [View Dashboard]"
```

### **Scenario 2: Proactive Alert**
```
FarmWise AI (iMessage): "🌧️ Weather Alert: Heavy rain expected 
                         tomorrow. Consider delaying harvest 
                         for Field C. [View Forecast]"
```

### **Scenario 3: Group Chat**
```
Farmer Group Chat:
  Farmer 1: "Anyone having issues with pests?"
  Farmer 2: "Yeah, aphids on my corn"
  FarmWise AI: "Based on regenerative practices, beneficial 
                insects can reduce aphids by 60%. Your 
                biodiversity index is 7.2 - you're on track! 
                [Learn More]"
```

### **Scenario 4: Context Continuity**
```
Dashboard: User views soil health
↓
iMessage: "What about that field?"
FarmWise AI: "Field A's soil health is excellent! 
              [Continues from dashboard context]"
```

---

## 🔗 Integration Points

### **1. Existing ChatBot → iMessage**
- Reuse `generateAIResponse` function
- Reuse Dedalus integration
- Reuse Gemini insights

### **2. Dashboard → iMessage**
- Share context via API
- Link dashboard sections
- Send summaries via iMessage

### **3. Voice → iMessage**
- Voice questions → iMessage responses
- iMessage questions → voice responses
- Unified context across both

---

## 🏆 Judging Criteria Alignment

### **Vision: Hybrid Intelligence** ✅
- AI feels present, not intrusive
- Participates naturally in conversations
- Understands context and emotion

### **Craft: Responsive & Tasteful** ✅
- Seamless integration
- Natural conversation flow
- Doesn't demand attention

### **Depth: Real-World Context** ✅
- Handles edge cases
- Remembers context
- Provides actionable insights

### **Traction: Ready for Users** ✅
- Works with real farm data
- Integrates with existing workflows
- Can run tomorrow

---

## 📦 Dependencies Needed

```json
{
  "dependencies": {
    "@photon/imessage-kit": "latest",
    // Existing dependencies remain
  }
}
```

---

## 🚀 Quick Start (Minimum Viable Integration)

### **Step 1: Install iMessage Kit**
```bash
npm install @photon/imessage-kit
```

### **Step 2: Create Basic Handler**
```typescript
// app/api/imessage/route.ts
export async function POST(request: Request) {
  const message = await request.json()
  
  // Use existing AI
  const response = await generateAIResponse(message.text)
  
  // Send via iMessage Kit
  return sendiMessage(response)
}
```

### **Step 3: Connect to ChatBot**
- Reuse existing `generateAIResponse`
- Reuse existing Dedalus/Gemini integration
- Add iMessage as new interface

### **Step 4: Test**
- Send test message
- Verify AI responds
- Check context awareness

---

## 💡 Unique Value Proposition

**What Makes FarmWise Special for Photon Track**:

1. **Real-World Context**: Uses actual farm data (soil, weather, spending)
2. **Multi-Modal**: Dashboard + Voice + iMessage (seamless switching)
3. **Proactive Intelligence**: Doesn't wait - actively helps farmers
4. **Regenerative Focus**: AI understands sustainability context
5. **Actionable**: Not just chat - triggers real actions

---

## 🎯 Next Steps

1. **Research iMessage Kit** - Check GitHub repo for exact API
2. **Install & Test** - Get basic integration working
3. **Enhance Context** - Add persistence
4. **Add Proactive Features** - Make it proactive
5. **Polish & Demo** - Make it feel magical

---

**Status**: Ready to implement! All AI infrastructure exists - just need to add iMessage interface.

