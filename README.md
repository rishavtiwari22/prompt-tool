# Prompt Learning Tool 🎨

An interactive prompt engineering learning game built with React + Vite. Learn to craft better AI image prompts through hands-on challenges with real-time AI feedback!

## ✨ Features

- 🎯 **Interactive Challenges**: Multiple levels to master prompt engineering
- 🤖 **AI-Powered Feedback**: Get detailed analysis on your generated images
- 📊 **Similarity Scoring**: See how close you are to the target image
- 💡 **Smart Suggestions**: AI tells you exactly how to improve your prompts
- 🎨 **Beautiful UI**: Paper-sketch design with smooth animations
- 🔊 **Audio Feedback**: Engaging sound effects for different actions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/navgurukul/prompt-learning-tool.git
   cd prompt-learning-tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your API keys:
   ```properties
   # Get SiliconFlow API key from: https://account.siliconflow.com/
   VITE_SILICONFLOW_API_KEY=your-siliconflow-api-key-here
   
   # Optional: Get Gemini API key from: https://makersuite.google.com/app/apikey
   VITE_GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🔑 API Keys

### SiliconFlow (Primary - Required)
- **Purpose**: AI-powered image comparison and feedback
- **Cost**: $0.05 per million tokens (very affordable!)
- **Get it**: [SiliconFlow Account](https://account.siliconflow.com/)
- **Model**: Qwen3-VL-8B-Instruct (vision model)

### Google Gemini (Optional - Backup)
- **Purpose**: Alternative image generation
- **Get it**: [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🎮 How to Play

1. **View the Target Image**: See what you need to recreate
2. **Write a Prompt**: Describe the image in detail
3. **Generate Image**: AI creates an image from your prompt
4. **Get Feedback**: See similarity score and AI suggestions
5. **Improve**: Refine your prompt based on feedback
6. **Progress**: Unlock new levels as you improve!

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS + Paper CSS
- **Icons**: Lucide React
- **AI APIs**: SiliconFlow (Qwen3-VL-8B), Google Gemini
- **Audio**: Custom audio manager utility

## 📁 Project Structure

```
prompt-learning-tool/
├── src/
│   ├── assets/           # Images and audio files
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── styles/          # CSS files
│   ├── utils/           # Utility functions
│   │   ├── audioManager.js
│   │   ├── imageComparison.js
│   │   └── imageGeneration.js
│   └── main.jsx
├── .env.example         # Environment template
├── .gitignore
└── README.md
```

## 🔐 Security

- **Never commit `.env`**: Your API keys are precious!
- The `.env.example` file shows required variables without exposing secrets
- `.env` is in `.gitignore` to prevent accidental commits

## 📚 Documentation

- [AI Feedback Implementation Guide](./AI_FEEDBACK_UI_IMPLEMENTATION.md)
- [How to Add AI Feedback](./HOW_TO_ADD_AI_FEEDBACK.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- SiliconFlow for affordable vision AI
- NavGurukul for the project
- React and Vite communities

---

Made with ❤️ for learning prompt engineering!
