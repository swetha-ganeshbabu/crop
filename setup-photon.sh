#!/bin/bash

# Photon iMessage Kit Setup Script
# This script helps you get your public URL for Photon configuration

echo "🚀 Photon iMessage Kit Setup Helper"
echo "===================================="
echo ""

# Check if app is running
if ! lsof -ti:3000 > /dev/null 2>&1; then
    echo "❌ Your app is not running on port 3000"
    echo "   Start it with: npm run dev"
    exit 1
fi

echo "✅ App is running on port 3000"
echo ""

# Check for ngrok
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok is installed"
    
    # Check if ngrok is running
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' 2>/dev/null)
        if [ "$NGROK_URL" != "null" ] && [ -n "$NGROK_URL" ]; then
            echo "✅ ngrok is running"
            echo ""
            echo "📱 Your Photon Webhook URL:"
            echo "   ${NGROK_URL}/api/imessage"
            echo ""
            echo "🔗 ngrok Dashboard: http://localhost:4040"
        else
            echo "⏳ ngrok is starting..."
            echo "   Run this script again in a few seconds"
        fi
    else
        echo "⏳ Starting ngrok..."
        ngrok http 3000 > /tmp/ngrok.log 2>&1 &
        sleep 3
        NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' 2>/dev/null)
        if [ "$NGROK_URL" != "null" ] && [ -n "$NGROK_URL" ]; then
            echo "✅ ngrok started!"
            echo ""
            echo "📱 Your Photon Webhook URL:"
            echo "   ${NGROK_URL}/api/imessage"
            echo ""
            echo "🔗 ngrok Dashboard: http://localhost:4040"
        else
            echo "❌ Failed to start ngrok"
            echo "   Check /tmp/ngrok.log for errors"
        fi
    fi
else
    echo "❌ ngrok is not installed"
    echo "   Install with: brew install ngrok"
fi

echo ""
echo "🧪 Test your endpoint:"
echo "   curl -X POST http://localhost:3000/api/imessage \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"message\": \"test\", \"userId\": \"test\"}'"
echo ""
echo "📖 Next steps:"
echo "   1. Install Photon iMessage Kit from GitHub"
echo "   2. Configure webhook URL (shown above)"
echo "   3. Enter your iPhone number"
echo "   4. Test with real iMessage!"
echo ""

