# Weather API Setup Guide

## 🌤️ Where to Get Weather API Keys

### Option 1: OpenWeatherMap (Recommended) ⭐

**Why OpenWeatherMap?**
- ✅ Free tier available (1,000 calls/day)
- ✅ Easy to use
- ✅ Real-time weather data
- ✅ 5-day forecast included
- ✅ No credit card required for free tier

**Steps to Get API Key:**

1. **Sign Up**:
   - Go to: https://openweathermap.org/api
   - Click "Sign Up" (top right)
   - Create a free account

2. **Get Your API Key**:
   - After signing up, go to: https://home.openweathermap.org/api_keys
   - You'll see your API key (it may take a few minutes to activate)
   - Copy the key

3. **Add to Your Project**:
   ```bash
   # Add to .env.local:
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Free Tier Limits**:
   - 1,000 API calls/day
   - 60 calls/minute
   - Current weather + 5-day forecast
   - Perfect for hackathon demo!

---

### Option 2: Weather.gov (NOAA) - FREE, No Key Required! 🆓

**Why Weather.gov?**
- ✅ **Completely FREE**
- ✅ **No API key needed**
- ✅ **No signup required**
- ✅ Government data (reliable)
- ⚠️ Slightly more complex API

**How to Use**:
- No signup needed!
- Just use the API directly
- Example: `https://api.weather.gov/gridpoints/TOP/31,80/forecast`

**Note**: Weather.gov uses a different API structure, but it's free and works well.

---

### Option 3: WeatherAPI.com

**Why WeatherAPI.com?**
- ✅ Free tier (1 million calls/month!)
- ✅ Easy to use
- ✅ Good documentation

**Steps**:
1. Go to: https://www.weatherapi.com/signup.aspx
2. Sign up for free account
3. Get API key from dashboard
4. Add to `.env.local`:
   ```bash
   WEATHERAPI_KEY=your_key_here
   ```

---

## 🚀 Quick Start (OpenWeatherMap)

### Step 1: Sign Up
1. Visit: https://openweathermap.org/api
2. Click "Sign Up" → Create account
3. Verify email

### Step 2: Get API Key
1. Go to: https://home.openweathermap.org/api_keys
2. Copy your API key (starts with letters/numbers)
3. Wait 10-60 minutes for activation

### Step 3: Add to Project
```bash
# Add to .env.local:
OPENWEATHER_API_KEY=abc123def456ghi789jkl012mno345pq
```

### Step 4: Test It
```bash
# Test your API key:
curl "http://api.openweathermap.org/data/2.5/weather?q=NewYork&appid=YOUR_API_KEY&units=imperial"
```

---

## 📝 Recommended: OpenWeatherMap

**For Hackathon**: I recommend **OpenWeatherMap** because:
- ✅ Easiest to integrate
- ✅ Free tier is generous (1,000 calls/day)
- ✅ Good documentation
- ✅ Works immediately after signup

**Sign Up Link**: https://openweathermap.org/api

---

## 🔧 Integration Example

Once you have the API key, I can integrate it like this:

```typescript
// app/api/weather/route.ts
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
)
```

---

## 🎯 Quick Steps

1. **Go to**: https://openweathermap.org/api
2. **Click**: "Sign Up" (top right)
3. **Create**: Free account
4. **Get Key**: https://home.openweathermap.org/api_keys
5. **Copy Key**: Add to `.env.local` as `OPENWEATHER_API_KEY=your_key`
6. **Done!** ✅

---

## 💡 Pro Tip

**For Hackathon Demo**:
- OpenWeatherMap free tier is perfect (1,000 calls/day)
- No credit card needed
- API key activates in 10-60 minutes
- Works great for real-time weather!

**Sign Up Now**: https://openweathermap.org/api

