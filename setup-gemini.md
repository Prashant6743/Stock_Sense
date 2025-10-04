# 🤖 Setup Gemini AI for Stock Sense Chatbot

## Quick Setup (2 minutes):

### Step 1: Get Your Gemini API Key
1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the generated key (starts with "AIza...")

### Step 2: Create Environment File
Create a file named `.env.local` in the root directory with:

```env
# Google Gemini API for AI chatbot
GEMINI_API_KEY=AIzaSyC-your-actual-api-key-here

# Alpha Vantage API for stock data (if you have one)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
```

### Step 3: Restart the Server
```bash
npm run dev
```

## ✅ Test Your Setup:
1. Open the chatbot
2. Ask: "What should I invest in today?"
3. You should get a personalized, specific response!

## 🆓 Free Tier Limits:
- Gemini API: 15 requests per minute (free)
- Perfect for testing and personal use

## 🔧 Troubleshooting:
- Make sure `.env.local` is in the root directory (same level as package.json)
- Restart the server after adding the API key
- Check the browser console for any error messages

## 💡 Without API Key:
The chatbot still works with enhanced local responses, but Gemini AI provides much more specific and contextual answers!
