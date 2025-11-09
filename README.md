# 🌾 FarmWise - AI-Powered Agricultural Dashboard

An intelligent, accessible dashboard that empowers farmers with AI-driven insights for crop yield predictions, soil health analysis, personalized planting advice, and real-time farm management.

## 🎯 Features

### Core Functionality
- **🌾 Crop Yield Predictions**: AI-powered forecasts with historical comparisons
- **🌱 Soil Health Analysis**: Comprehensive metrics with regenerative agriculture recommendations
- **📅 Planting & Harvesting Advice**: Personalized calendar with optimal timing windows
- **💰 Financial Tracking**: Transaction analysis with AI-powered spending insights
- **🌤️ Weather Integration**: Real-time conditions and 4-day forecasts
- **🔊 Voice Assistant**: Natural language interaction for farm queries
- **📊 Real-time Dashboard**: Easy-to-read metrics and visualizations

### AI-Powered Features
- **Smart Recommendations**: AI analyzes spending patterns and provides cost-effective suggestions
- **Dedalus AI Integration**: Advanced AI for intelligent responses
- **Google Gemini**: Enhanced AI capabilities for insights
- **ElevenLabs TTS/STT**: Voice interaction support

### Financial Integration
- **Knot API**: Transaction linking and analysis
- **Capital One**: Financial services integration
- **Spending Analytics**: AI-powered expenditure insights

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **date-fns** - Date utilities

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hackprinceton
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file with:
```env
# Add your API keys here
NEXT_PUBLIC_DEDALUS_API_KEY=your_key
GEMINI_API_KEY=your_key
ELEVENLABS_API_KEY=your_key
KNOT_CLIENT_ID=your_key
KNOT_CLIENT_SECRET=your_key
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository at [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
npm run build
npm start
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── gemini/       # Gemini AI integration
│   │   ├── dedalus/      # Dedalus AI integration
│   │   ├── elevenlabs-*/ # Voice services
│   │   ├── knot-*/       # Financial services
│   │   └── ...
│   ├── login/              # Authentication
│   ├── transactions/      # Financial tracking
│   └── page.tsx          # Main dashboard
├── components/
│   ├── Dashboard.tsx           # Main dashboard
│   ├── VoiceAssistant.tsx     # Voice AI
│   ├── SpendingTracker.tsx    # Financial tracking
│   ├── CropYieldPrediction.tsx
│   ├── SoilHealth.tsx
│   └── ...
├── lib/
│   ├── ai-response.ts    # AI response generation
│   └── knot-config.ts    # Knot API config
└── types/                # TypeScript definitions
```

## 🔌 API Endpoints

### Core APIs
- `GET /api/farm-data` - Farm information
- `GET /api/yield-prediction` - Crop yield predictions
- `GET /api/soil-health` - Soil health metrics
- `GET /api/planting-advice` - Planting recommendations
- `GET /api/weather` - Weather data
- `GET /api/usda-data` - USDA agricultural data

### AI Services
- `POST /api/gemini` - Google Gemini AI
- `POST /api/dedalus` - Dedalus AI
- `POST /api/elevenlabs-tts` - Text-to-speech
- `POST /api/elevenlabs-stt` - Speech-to-text
- `POST /api/imessage` - iMessage integration

### Financial Services
- `GET /api/knot-session` - Knot session management
- `GET /api/knot-transactions` - Transaction data
- `GET /api/marketplace-analysis` - Market insights

## 🎨 Key Features in Detail

### Voice Assistant
Natural language interaction for farm queries. Ask questions about:
- Soil health
- Crop yields
- Weather forecasts
- Spending patterns
- Planting advice

### Financial Tracking
- Link bank accounts via Knot API
- Analyze transactions
- Get AI-powered spending insights
- Track farm expenditures
- Cost-effective recommendations

### Soil Health Dashboard
- Comprehensive soil metrics
- Regenerative agriculture recommendations
- Carbon sequestration tracking
- Biodiversity metrics
- Nutrient density analysis

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint      # Run ESLint
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Pre-build linting enforced

## 📝 License

MIT

## 🙏 Acknowledgments

Built for HackPrinceton 2024

---

**Made with ❤️ for farmers**
