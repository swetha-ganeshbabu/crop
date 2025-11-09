# 🚀 Photon iMessage Kit - Quick Start Guide

## ✅ What You Have Ready

- ✅ Backend endpoint: `/api/imessage` 
- ✅ AI integration: Dedalus + fallback
- ✅ Test page: `/test-imessage`
- ✅ ngrok installed (for local testing)

---

## 📱 STEP 1: Install Photon iMessage Kit

### Go to Photon's GitHub:
```
https://github.com/photon-hq/imessage-kit
```

### Check Installation Options:

**Option A: Download App** (if available)
- Look for a `.dmg` or `.app` file
- Download and install like any Mac app

**Option B: Build from Source** (if needed)
```bash
git clone https://github.com/photon-hq/imessage-kit.git
cd imessage-kit
# Follow their README instructions
```

**Option C: Check Examples Folder**
- Look in `examples/` folder for setup instructions
- May have quick start guide

---

## 🌐 STEP 2: Get Public URL for Your App

You have **two options**:

### Option A: Use ngrok (Quick - For Testing)

1. **Start your app** (if not running):
   ```bash
   npm run dev
   ```

2. **In a new terminal, start ngrok**:
   ```bash
   ngrok http 3000
   ```

3. **Copy the HTTPS URL**:
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```
   
   Your webhook URL will be:
   ```
   https://abc123.ngrok.io/api/imessage
   ```

4. **Keep ngrok running** (don't close the terminal)

**⚠️ Note**: Free ngrok URLs change each time you restart. For hackathon demo, use Vercel.

### Option B: Deploy to Vercel (Better for Hackathon)

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
   - Press Enter to confirm
   - Link to existing project or create new
   - Your app will be live at: `https://your-app.vercel.app`

4. **Your webhook URL**:
   ```
   https://your-app.vercel.app/api/imessage
   ```

---

## ⚙️ STEP 3: Configure Photon

### 1. Open Photon App

After installing, open the Photon iMessage Kit app on your Mac.

### 2. Set Webhook URL

In Photon's configuration/settings, enter:

**If using ngrok:**
```
https://abc123.ngrok.io/api/imessage
```

**If using Vercel:**
```
https://your-app.vercel.app/api/imessage
```

### 3. Configure Phone Number

- Enter your iPhone phone number
- Or email address associated with iMessage
- This is the number Photon will monitor

### 4. Save Configuration

- Click Save/Apply
- Photon should show "Connected" or "Ready"

---

## 🧪 STEP 4: Test It!

### Test 1: Verify Endpoint Works

**If using ngrok:**
```bash
curl -X POST https://abc123.ngrok.io/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "How is my soil health?", "userId": "test"}'
```

**If using Vercel:**
```bash
curl -X POST https://your-app.vercel.app/api/imessage \
  -H "Content-Type: application/json" \
  -d '{"message": "How is my soil health?", "userId": "test"}'
```

**Expected**: JSON response with AI answer

### Test 2: Send Real iMessage

1. **Make sure**:
   - ✅ Your app is running (`npm run dev`)
   - ✅ ngrok is running (if using ngrok)
   - ✅ Photon app is open and connected
   - ✅ Your iPhone has iMessage enabled

2. **Send iMessage** from your iPhone:
   - Send to the phone number you configured in Photon
   - Try: "How's my soil health?"

3. **Check**:
   - Your app logs should show: `[iMessage] Received from...`
   - You should get a response in iMessage!

---

## 🎯 For Hackathon Demo

### If Everything Works:
- Show real iMessage conversation
- Demonstrate AI responding
- Explain the integration

### If Photon Setup is Complex:
- Show `/test-imessage` page
- Explain: "This is the same endpoint that real iMessage uses"
- Show the code integration
- **This is still valid for the hackathon!**

---

## 🆘 Quick Troubleshooting

### "Photon can't connect"
- Check webhook URL is correct (must be `https://`)
- Check your app is running
- Check ngrok is running (if using ngrok)
- Visit the URL in browser to verify it works

### "No response in iMessage"
- Check Photon app shows "Connected"
- Check your app logs for errors
- Verify phone number is correct
- Try the test page first: `/test-imessage`

### "Can't find Photon installation"
- Check Photon's GitHub README
- Look in `examples/` folder
- Ask Photon team at hackathon for help

---

## 📋 Quick Checklist

- [ ] Installed Photon iMessage Kit
- [ ] Got public URL (ngrok or Vercel)
- [ ] Configured Photon webhook
- [ ] Tested endpoint with curl
- [ ] Sent test iMessage
- [ ] Got response back

---

## 💡 Pro Tips

1. **For hackathon**: Deploy to Vercel (more stable than ngrok)
2. **Test first**: Use `/test-imessage` page to verify AI works
3. **Keep it simple**: If Photon setup is complex, demo the test page
4. **Documentation**: Show the code - judges love seeing the integration

---

**Your backend is 100% ready!** Just need to connect Photon. 🚀

