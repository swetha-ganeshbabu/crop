# Photon iMessage Kit - Complete Installation Guide

## 🎯 Your Webhook URL (Ready to Use!)

```
https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
```

**✅ This endpoint is tested and working!**

---

## 📱 Step-by-Step Installation

### Step 1: Install Photon iMessage Kit

#### Option A: Using Homebrew (macOS - Recommended)

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Photon iMessage Kit
brew install photon-hq/imessage-kit/photon-imessage
```

#### Option B: Download from GitHub

1. Go to: https://github.com/photon-hq/imessage-kit
2. Click **Releases**
3. Download the latest `.dmg` or `.pkg` file
4. Install the application

#### Option C: Build from Source

```bash
# Clone the repository
git clone https://github.com/photon-hq/imessage-kit.git
cd imessage-kit

# Follow their build instructions
# (Check their README for specific steps)
```

---

### Step 2: Configure Photon

1. **Open Photon iMessage Kit** application on your Mac

2. **Set Webhook URL**:
   ```
   https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
   ```

3. **Enter Your iPhone Phone Number**:
   - Format: `+1234567890` (with country code)
   - Example: `+15551234567`

4. **Grant Permissions**:
   - Allow Photon to access iMessage
   - Allow network access (for webhook calls)

5. **Save Configuration**

---

### Step 3: Test the Integration

#### Test 1: Verify Endpoint (Already Done ✅)

```bash
curl https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
```

#### Test 2: Send Test Message

1. **Open iMessage** on your iPhone
2. **Send a message** to the number Photon is monitoring
3. **Check Vercel logs** - you should see:
   ```
   [iMessage] Received from +1234567890: Your message here
   ```
4. **Receive AI response** in iMessage!

---

## 🧪 Testing Without Real iMessage

If you want to test before setting up Photon:

### Option 1: Use Test Page

Visit: `https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/test-imessage`

### Option 2: Use curl

```bash
curl -X POST https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How is my soil health?",
    "userId": "test-farmer-123"
  }'
```

---

## 📋 Example Messages to Try

Once Photon is set up, try these in iMessage:

- "How's my soil health?"
- "Show me my spending"
- "What should I plant?"
- "Status"
- "Tell me about my carbon impact"
- "What's my water usage?"
- "Hello"

---

## 🔍 Troubleshooting

### Issue: Photon can't connect to webhook

**Solution**: 
1. Verify webhook URL is correct
2. Check Vercel deployment is live
3. Test endpoint with curl (see above)

### Issue: No response in iMessage

**Solution**:
1. Check Vercel logs for errors
2. Verify Photon is running
3. Check phone number is correct
4. Ensure permissions are granted

### Issue: "Message is required" error

**Solution**: 
- Our endpoint supports multiple formats
- Try: `{"message": "..."}`, `{"text": "..."}`, or `{"body": "..."}`

---

## 📊 Monitoring

### Check Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Select your project: `crop`
3. Go to **Deployments** → Click latest deployment
4. View **Function Logs**

You should see:
```
[iMessage] Received from +1234567890: How's my soil health?
```

---

## ✅ Checklist

- [ ] Photon iMessage Kit installed
- [ ] Webhook URL configured
- [ ] Phone number entered
- [ ] Permissions granted
- [ ] Test message sent
- [ ] Response received in iMessage

---

## 🎯 For Hackathon Demo

### If Photon is Working:
- ✅ Show real iMessage conversation
- ✅ Demonstrate AI responding
- ✅ Explain the integration

### If Photon Setup is Complex:
- ✅ Show `/test-imessage` page
- ✅ Explain: "Backend ready, same endpoint iMessage uses"
- ✅ Show code integration
- ✅ Demonstrate with curl

**Both approaches are valid for the hackathon!** 🚀

---

## 🔗 Useful Links

- **Photon GitHub**: https://github.com/photon-hq/imessage-kit
- **Photon Docs**: https://photon.codes
- **Your App**: https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app
- **Test Page**: https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/test-imessage
- **Vercel Dashboard**: https://vercel.com/dashboard

---

## 📝 Quick Reference

**Webhook URL**:
```
https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
```

**Health Check**:
```bash
curl https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage
```

**Test Message**:
```bash
curl -X POST https://crop-6lhvbf828-swethas-projects-9933e285.vercel.app/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "userId": "test"}'
```

---

**Status**: ✅ Backend ready! Just install and configure Photon! 🚀

