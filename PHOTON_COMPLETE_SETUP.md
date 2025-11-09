# 📱 Complete Photon iMessage Kit Setup Guide

## 🎯 Overview

Photon iMessage Kit is a **macOS application** that connects your iMessage to your web app. It's not a simple npm package - it's a separate app that runs on your Mac.

**How it works:**
```
Your iPhone (iMessage) 
    ↓
Photon App (runs on your Mac)
    ↓
Your Web App (/api/imessage)
    ↓
AI Response
    ↓
Back to iPhone (iMessage)
```

---

## ✅ Prerequisites

1. **macOS Computer** (required - Photon runs on Mac)
2. **iPhone with iMessage** (to test)
3. **Your app deployed** OR **ngrok** (for local testing)
4. **Both devices on same network** (for local testing)

---

## 📦 STEP 1: Install Photon iMessage Kit

### Option A: From GitHub (Recommended)

1. **Go to Photon's GitHub**:
   ```
   https://github.com/photon-hq/imessage-kit
   ```

2. **Check the README** for installation instructions:
   - They may have a downloadable app
   - Or installation via Homebrew
   - Or build from source

3. **Follow their specific instructions** (they may have changed)

### Option B: Check for npm Package

Some versions might be available via npm:
```bash
npm install @photon/imessage-kit
# or
npm install photon-imessage-kit
```

**Note**: If this doesn't work, you need to use their GitHub repo.

---

## 🔧 STEP 2: Deploy Your App (Required!)

Photon needs a **public URL** to send messages to. You have two options:

### Option A: Deploy to Vercel (Easiest - Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd /Users/swe/hackprinceton
   vercel
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Your app will be at: `https://your-app.vercel.app`

4. **Get your URL**: 
   ```
   https://your-app.vercel.app/api/imessage
   ```

### Option B: Use ngrok (For Local Testing)

If you want to test locally without deploying:

1. **Install ngrok**:
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from: https://ngrok.com/download
   ```

2. **Start your app**:
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

3. **Expose with ngrok**:
   ```bash
   ngrok http 3000
   ```

4. **Copy the ngrok URL**:
   ```
   https://abc123.ngrok.io/api/imessage
   ```

**⚠️ Note**: ngrok free tier gives you a random URL that changes each time. For hackathon demo, Vercel is better.

---

## ⚙️ STEP 3: Configure Photon

### 1. Open Photon iMessage Kit App

After installing, open the Photon app on your Mac.

### 2. Set Webhook URL

In Photon's settings/configuration, set:

**If deployed to Vercel:**
```
https://your-app.vercel.app/api/imessage
```

**If using ngrok:**
```
https://abc123.ngrok.io/api/imessage
```

### 3. Configure Other Settings

Photon may ask for:
- **Phone number** to monitor (your iPhone number)
- **API key** (if they require authentication)
- **Permissions** (iMessage access, etc.)

**Follow Photon's specific instructions** - they may have a dashboard or config file.

---

## 🧪 STEP 4: Test the Integration

### Test 1: Verify Your Endpoint Works

Before connecting Photon, test your endpoint:

```bash
# If deployed
curl -X POST https://your-app.vercel.app/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "How is my soil health?", "userId": "test"}'

# If using ngrok
curl -X POST https://abc123.ngrok.io/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "How is my soil health?", "userId": "test"}'
```

**Expected response:**
```json
{
  "text": "Your soil health is excellent!...",
  "actions": [...],
  "timestamp": "..."
}
```

### Test 2: Send Real iMessage

1. **Make sure Photon is running** on your Mac
2. **Send an iMessage** from your iPhone to the number Photon is monitoring
3. **Check your app logs** to see if the message was received
4. **You should get a response** in iMessage!

---

## 🔍 STEP 5: Verify Everything Works

### Check Your App Logs

When you send an iMessage, you should see in your app logs:
```
[iMessage] Received from user123: How is my soil health?
```

### Check Photon App

The Photon app should show:
- Connection status (connected/disconnected)
- Recent messages
- Any errors

### Test Messages to Try

Send these from your iPhone:
- "How's my soil health?"
- "Show me my spending"
- "What should I plant?"
- "Status"
- "Tell me about my carbon impact"

---

## 🆘 Troubleshooting

### Problem: Photon can't connect to your endpoint

**Solutions:**
1. **Check your URL is correct**: Make sure it's `https://` not `http://`
2. **Check endpoint exists**: Visit `https://your-app.vercel.app/api/imessage` in browser (should show health check)
3. **Check CORS**: Make sure your endpoint accepts POST requests
4. **Check logs**: Look at your app logs for errors

### Problem: Messages not being received

**Solutions:**
1. **Check Photon is running** on your Mac
2. **Check phone number** is correct in Photon config
3. **Check iMessage** is enabled on your iPhone
4. **Check network** - both devices need internet

### Problem: Responses not sending back

**Solutions:**
1. **Check response format**: Photon expects `{ text: "...", actions: [...] }`
2. **Check your endpoint** returns correct format
3. **Check Photon logs** for errors

### Problem: Can't install Photon

**Solutions:**
1. **Check macOS version** - may need specific macOS version
2. **Check GitHub** for latest installation instructions
3. **Contact Photon team** at hackathon for help
4. **Use test page** for demo instead (`/test-imessage`)

---

## 🎯 For Hackathon Demo

### If Photon is Working:

1. **Show real iMessage** conversation
2. **Demonstrate** AI responding
3. **Explain** how it connects to your dashboard

### If Photon is Not Working:

1. **Show test page** (`/test-imessage`)
2. **Explain**: "This is the same endpoint that real iMessage uses"
3. **Show code**: Demonstrate the integration
4. **Explain**: "Backend is ready, just needs Photon setup"

**Both approaches are valid for the hackathon!**

---

## 📋 Quick Checklist

- [ ] Installed Photon iMessage Kit on Mac
- [ ] Deployed app to Vercel (or set up ngrok)
- [ ] Configured Photon webhook URL
- [ ] Tested endpoint with curl
- [ ] Sent test iMessage
- [ ] Verified response received
- [ ] Tested multiple message types

---

## 🔗 Useful Links

- **Photon GitHub**: https://github.com/photon-hq/imessage-kit
- **Photon Examples**: https://github.com/photon-hq/imessage-kit/tree/main/examples
- **Vercel**: https://vercel.com
- **ngrok**: https://ngrok.com

---

## 💡 Important Notes

1. **Photon requires macOS** - won't work on Windows/Linux
2. **Need public URL** - can't use localhost directly
3. **Both devices need internet** - for webhook to work
4. **Test page works without Photon** - good for demo if Photon setup is complex

---

## ✅ Your Backend is Ready!

Your `/api/imessage` endpoint is already:
- ✅ Receiving messages
- ✅ Using Dedalus AI
- ✅ Formatting responses
- ✅ Handling errors
- ✅ Health check working

**You just need to connect Photon!** 🚀

