# 🧪 ElevenLabs Integration Testing Guide

## ✅ What's Integrated

1. **Text-to-Speech (TTS)**: Converts AI responses to natural voice
2. **Speech-to-Text (STT)**: Converts your voice to text for input

---

## 🧪 How to Test

### Test 1: Text-to-Speech (TTS)

**Method 1: Via ChatBot**
1. Open your app: `http://localhost:3000`
2. Click the ChatBot button (bottom-right corner)
3. Type a message or click a quick question
4. **Listen** - You should hear **natural, human-like voice** (ElevenLabs)

**Method 2: Via API**
```bash
curl -X POST http://localhost:3000/api/elevenlabs-tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello, this is a test.","voice_id":"21m00Tcm4TlvDq8ikWAM"}' \
  -o test.mp3

# Play the audio file
open test.mp3  # macOS
```

**Expected Result**: 
- ✅ Natural, human-like voice
- ✅ Clear pronunciation
- ✅ Smooth speech

---

### Test 2: Speech-to-Text (STT)

**Method 1: Via ChatBot**
1. Open ChatBot
2. Click "Tap to Talk"
3. **Speak clearly**: "How is my soil health?"
4. **Wait** for transcription
5. Should see your words appear as text

**Method 2: Via API** (requires audio file)
```bash
# Record audio first, then:
curl -X POST http://localhost:3000/api/elevenlabs-stt \
  -F "audio=@your-audio-file.webm" \
  -H "xi-api-key: YOUR_KEY"
```

**Expected Result**:
- ✅ Accurate transcription
- ✅ Fast response
- ✅ Handles natural speech

---

### Test 3: Full Voice Conversation

1. Open ChatBot
2. Click "Tap to Talk"
3. **Say**: "What is my carbon impact?"
4. **Wait** for:
   - STT to transcribe your voice
   - AI to generate response
   - TTS to speak the response
5. **You should hear**: Natural voice response!

**Complete Flow**:
```
You speak → ElevenLabs STT → Text → AI → Response → ElevenLabs TTS → You hear
```

---

## 🔍 Troubleshooting

### Problem: No voice output (TTS)

**Check:**
1. API key is set in `.env.local`
2. Server restarted after adding key
3. Browser console for errors (F12)
4. Network tab - should see `/api/elevenlabs-tts` call

**Solutions:**
- Verify API key: `cat .env.local | grep ELEVENLABS`
- Restart server: `npm run dev`
- Check browser console for errors

---

### Problem: Voice input not working (STT)

**Check:**
1. Microphone permissions granted
2. Browser supports MediaRecorder
3. API key is set
4. Network tab - should see `/api/elevenlabs-stt` call

**Solutions:**
- Grant microphone permissions in browser
- Try different browser (Chrome recommended)
- Check browser console for errors

---

### Problem: Using Web Speech API instead of ElevenLabs

**This is normal!** The app has fallback:
- If ElevenLabs fails → Uses Web Speech API
- If API key missing → Uses Web Speech API
- **App still works!**

**To force ElevenLabs:**
- Make sure API key is set
- Restart server
- Check API calls in network tab

---

## 📊 What to Look For

### ✅ Success Indicators:

**TTS:**
- Natural, human-like voice
- No robotic sound
- Smooth speech flow

**STT:**
- Accurate transcription
- Fast response (< 2 seconds)
- Handles natural speech patterns

**Full Integration:**
- Seamless voice conversation
- No delays
- Natural back-and-forth

---

## 🎯 Quick Test Checklist

- [ ] TTS works (hear natural voice)
- [ ] STT works (voice transcribed accurately)
- [ ] Full conversation works (speak → hear response)
- [ ] Fallback works (if API fails, Web Speech API takes over)
- [ ] No errors in browser console
- [ ] API calls visible in network tab

---

## 📝 Test Messages to Try

**For TTS:**
- "How is my soil health?"
- "What is my carbon impact?"
- "Show me my spending analysis"

**For STT:**
- Speak naturally
- Try different accents
- Test with background noise

**For Full Integration:**
- "Tell me about my farm"
- "What should I plant next?"
- "How much water am I saving?"

---

## ✅ Summary

**Both integrations are complete!**

- ✅ TTS: Natural voice output
- ✅ STT: Accurate voice input
- ✅ Fallback: Web Speech API backup
- ✅ Error handling: Graceful failures

**Status**: Ready to test! 🚀

