# 🔒 Knot SDK Cross-Origin Error - Solution

## ❌ The Problem

The console shows this error:
```
SecurityError: Failed to read a named property 'origin' from 'Window': 
Blocked a frame with origin "https://development-knotapi.vercel.app" 
from accessing a cross-origin frame.
```

**What this means:**
- The Knot SDK opens an iframe from `development-knotapi.vercel.app`
- The iframe tries to communicate with your parent window (`localhost:3000`)
- Browser security blocks this cross-origin communication
- This is a **domain allowlisting issue**

---

## ✅ Solutions

### **Option 1: Allowlist Your Domain (Recommended for Production)**

1. Go to Knot Dashboard: https://dashboard.knotapi.com
2. Navigate to **Settings** → **Allowed Domains**
3. Add your domain:
   - For local development: `http://localhost:3000`
   - For production: Your deployed URL (e.g., `https://your-app.vercel.app`)

**Note:** You may need to contact Knot support to get access to the dashboard or have them allowlist your domain.

---

### **Option 2: Use ngrok for Testing (Quick Fix)**

If you need to test immediately:

```bash
# Install ngrok (if not already installed)
# Then run:
ngrok http 3000

# Use the ngrok URL (e.g., https://abc123.ngrok.io) in Knot dashboard
```

This gives you a public HTTPS URL that can be allowlisted.

---

### **Option 3: Use Mock Data for Demo (Hackathon Workaround)**

For the hackathon demo, you can:
1. Show the SDK integration attempt (button, modal opening)
2. When it fails, gracefully fall back to mock data
3. Explain that real integration requires domain allowlisting

**Current Status:** The code already falls back to mock data when the SDK fails, so your demo will still work!

---

## 🔍 How to Verify

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for the SecurityError
   - Check if domain allowlisting fixes it

2. **Test SDK Connection:**
   - Click "Connect Knot Account"
   - If allowlisted: SDK should work
   - If not: You'll see the error, but mock data will still display

---

## 📋 Current Implementation

The code now:
- ✅ Detects cross-origin errors
- ✅ Shows helpful error messages
- ✅ Falls back to mock data automatically
- ✅ Logs detailed error information for debugging

**Your demo will work even with this error!** The mock data provides realistic farmer transaction data with SKU information.

---

## 🚀 For Hackathon

**You can still win the Knot track!** Here's why:

1. ✅ **Visual Representation**: Knot logo and "Connect Account" button are visible
2. ✅ **SKU Data**: Mock data includes SKU information (required)
3. ✅ **SDK Integration**: Code attempts real SDK connection (bonus points)
4. ✅ **Error Handling**: Graceful fallback to mock data

**Explain to judges:**
- "We've integrated the Knot SDK for real account linking"
- "For demo purposes, we're showing realistic mock data with SKU information"
- "Production deployment would require domain allowlisting in Knot dashboard"

---

## 📞 Need Help?

If you need Knot support to allowlist your domain:
- Contact Knot team at the hackathon
- Or email: support@knotapi.com
- Mention: "Need to allowlist domain for HackPrinceton project"

