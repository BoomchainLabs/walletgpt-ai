# WalletGPT

WalletGPT is a next-generation Web3 dashboard and AI companion built on the **Base** blockchain. It integrates **Google's Gemini 3 Flash** model to provide users with an intelligent assistant capable of analyzing blockchain assets, explaining complex Web3 concepts, and performing visual analysis on uploaded images.

## 🚀 Features

- **AI-Powered Companion**: Chat with a context-aware AI that knows your wallet address and can guide you through the Web3 ecosystem.
- **Multimodal Capabilities**: Drag and drop images (NFTs, charts, screenshots) into the chat for instant AI analysis using Gemini's vision capabilities.
- **Unified Wallet Login**: Powered by **Sequence Kit**, supporting email login, MetaMask, Coinbase Wallet, and WalletConnect.
- **NFT Portfolio**: Automatically fetches and displays your NFT collection on Base Mainnet using the Sequence Indexer.
- **Interactive Dashboard**: View simulated token balances, global rank, and network status.
- **Daily Faucet**: A simulated reward system to claim WGPT tokens.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google GenAI SDK (`@google/genai`) - Gemini 3 Flash Preview
- **Web3 / Auth**: Sequence Kit (`@0xsequence/connect`)
- **Icons**: Lucide React

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/walletgpt.git
   cd walletgpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   This application requires a Google Gemini API Key.
   
   Create a `.env` file in the root directory:
   ```env
   # Your Google Gemini API Key
   API_KEY=AIzaSy...
   ```

   *Note: The application uses `process.env.API_KEY` to authenticate with the Gemini API.*

4. **Start the Development Server**
   ```bash
   npm start
   ```

## 🎮 How to Use

1. **Connect**: Click "Connect Wallet" on the home page. You can sign in with Google, Discord, or an existing Web3 wallet.
2. **Chat**: Use the interface to ask questions like "How do I optimize gas fees on Base?" or "Explain my portfolio."
3. **Analyze Images**: Click the image icon or drag-and-drop an image file onto the chat window to have Gemini analyze it.
4. **View Assets**: Scroll down to the "Your Collection" section to see your Base NFTs.

## 📄 License

MIT
