# Stock Sense

Stock Sense is an AI-powered web application that provides real-time stock analysis and trend predictions. Users can enter a company name or a stock ticker symbol to get instant insights, including a buy, sell, or hold recommendation, the current stock price, trading volume, and an interactive chart showing the latest price movements.

![Stock Sense Screenshot](https://storage.googleapis.com/aip-dev-user-screenshots/287a9358-1517-4861-afa6-538f92150937.png)

## Features

- **AI-Powered Analysis**: Leverages a generative AI model to analyze historical data and provide a "buy," "sell," or "hold" recommendation.
- **Real-Time Data**: Fetches and displays up-to-the-minute stock prices and trading volumes using the Alpha Vantage API.
- **Intelligent Ticker Search**: Users can search by either company name (e.g., "Apple") or ticker symbol (e.g., "AAPL"), and the application will find the correct ticker.
- **Interactive Price Chart**: Visualizes the stock's price trend over the last 30 minutes with 1-minute intervals.
- **Recent Searches**: Keeps track of your last five searches for quick access.
- **Responsive Design**: A clean and modern user interface that works on both desktop and mobile devices.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Charting**: [Recharts](https://recharts.org/)
- **Data Source**: [Alpha Vantage API](https://www.alphavantage.co/)

## Getting Started

Follow these instructions to get a local copy of the project up and running.

### Prerequisites

- Node.js (v18 or later)
- npm, yarn, or pnpm

### Environment Variables

Before running the application, you need to set up your environment variables. Create a file named `.env` in the root of the project and add the following keys:

```bash
# Your Google AI API key for Genkit
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Your Alpha Vantage API key for stock data
ALPHA_VANTAGE_API_KEY="YOUR_ALPHA_VANTAGE_API_KEY"
```

You can obtain these keys from:
- [Google AI Studio](https://aistudio.google.com/app/apikey) for the `GEMINI_API_KEY`.
- [Alpha Vantage](https://www.alphavantage.co/support/#api-key) for the `ALPHA_VANTAGE_API_KEY`.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/stock-sense.git
   cd stock-sense
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the development server, run the following command:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.
