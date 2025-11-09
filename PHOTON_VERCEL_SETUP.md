# Photon Integration - Vercel Setup Guide

## 🎯 Your Vercel URL

**Base URL**: `https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app`

**Webhook URL for Photon**: 
```
https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
```

---

## ⚠️ Important: Vercel Authentication Protection

Your Vercel deployment currently has **authentication protection enabled**. This blocks Photon from accessing your webhook.

### Solution: Disable Protection for API Routes

You need to **disable Vercel's deployment protection** or configure it to allow public access to the `/api/imessage` endpoint.

### How to Fix:

#### Option 1: Disable Protection (Recommended for Hackathon)

1. Go to **Vercel Dashboard**: https://vercel.com/dashboard
2. Select your project: `crop`
3. Go to **Settings** → **Deployment Protection**
4. **Disable** deployment protection (or set it to "Public" for API routes)

#### Option 2: Configure Protection Bypass

1. Go to **Vercel Dashboard** → Your Project → **Settings**
2. Go to **Deployment Protection**
3. Add a bypass rule for `/api/*` routes
4. Or add specific bypass for `/api/imessage`

#### Option 3: Use Vercel CLI (If you have access)

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Disable protection for API routes
# (This might require Vercel Pro plan or specific settings)
```

---

## ✅ After Fixing Protection

### Test Your Endpoint:

```bash
# Health check (should return JSON, not HTML)
curl https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage

# Expected response:
# {"status":"ok","service":"FarmWise iMessage Integration",...}

# Test with message
curl -X POST https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "How is my soil health?", "userId": "test-farmer"}'
```

---

## 📱 Next Steps for Photon

### Step 1: Install Photon iMessage Kit

1. Go to: https://github.com/photon-hq/imessage-kit
2. Follow their installation instructions
3. May require:
   - Downloading an app
   - Homebrew installation
   - Building from source

### Step 2: Configure Photon

1. Open Photon app
2. Set **Webhook URL** to:
   ```
   https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
   ```
3. Enter your **iPhone phone number**
4. Save configuration

### Step 3: Test

1. Send iMessage from your iPhone
2. Check Vercel logs (should see: `[iMessage] Received from...`)
3. Receive AI response in iMessage!

---

## 🧪 Alternative: Test Locally First

If Vercel protection is complex to disable, you can:

1. **Test locally** with ngrok:
   ```bash
   # Terminal 1: Start your local server
   npm run dev
   
   # Terminal 2: Start ngrok
   ngrok http 3000
   
   # Use ngrok URL for Photon webhook
   # Example: https://abc123.ngrok.io/api/imessage
   ```

2. **Then deploy** to Vercel without protection

---

## 📋 Quick Checklist

- [ ] Disable Vercel deployment protection (or configure bypass)
- [ ] Test endpoint: `curl https://your-app.vercel.app/api/imessage`
- [ ] Install Photon iMessage Kit
- [ ] Configure Photon webhook URL
- [ ] Test with real iMessage

---

## 🎯 For Hackathon Demo

If Photon setup is taking too long:

1. **Show the test page**: `https://your-app.vercel.app/test-imessage`
2. **Explain**: "This is the same endpoint iMessage uses - backend is ready!"
3. **Show code**: Demonstrate the `/api/imessage` integration
4. **Show Vercel logs**: If you can access them during demo

**This still demonstrates the integration!** ✅

---

## 🔗 Useful Links

- **Photon GitHub**: https://github.com/photon-hq/imessage-kit
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Protection Docs**: https://vercel.com/docs/deployment-protection
- **Your App**: https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app

---

## ✅ Status

- ✅ Backend endpoint ready: `/api/imessage`
- ✅ AI integration connected
- ✅ Response formatting configured
- ⚠️ **Need to disable Vercel protection** (or configure bypass)
- ⏳ Install Photon iMessage Kit
- ⏳ Configure Photon webhook

**Next Action**: Disable Vercel deployment protection for API routes! 🚀

