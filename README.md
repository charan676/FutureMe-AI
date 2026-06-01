# 🚀 FutureMe AI

FutureMe AI is an AI-powered web application that enables users to engage in meaningful conversations with their future selves. By sharing personal goals, aspirations, and challenges, users receive personalized guidance, motivation, and future-focused insights generated using Google's Gemini AI. The platform encourages self-reflection, goal setting, and personal growth through an interactive and engaging AI experience.

🌐 Live Demo: https://futureme-ai-reflection.netlify.app/

⭐ Have a conversation with your future self and gain AI-powered guidance for your goals and aspirations.

---

## ✨ Features
🤖 AI-powered future self conversations
🎯 Personalized goal-oriented guidance
💡 Future-focused insights and motivation
⚡ Google Gemini AI integration
📱 Fully responsive design
🌙 Modern and intuitive user interface
🔒 Secure API key management using environment variables
🚀 Fast and interactive user experience

---

## 🛠️ Tech Stack

### Frontend
React.js
Vite
CSS3
### Backend
Node.js
Express.js
### AI Integration
Google Gemini API
### Deployment
Netlify

---

## 📁 Directory Structure

```
futureme/
├── frontend/
│   ├── index.html       # Semantically constructed web document
│   ├── style.css        # Premium dark glassmorphism layout stylesheets
│   └── script.js        # State manager, loading sequence, & API fetch handler
├── backend/
│   ├── server.js        # Node + Express server, Gemini SDK endpoints
│   ├── package.json     # Project dependencies
│   ├── .env             # Active credentials (local configuration)
│   └── .env.example     # Environment template configuration
└── README.md            # App instruction documentation
```

---

## 🛠️ Quick Start & Installation

### Step 1: Install Node Dependencies
Open a terminal in the `backend/` directory and run:
```bash
cd backend
npm install
```

### Step 2: Configure Your Gemini API Key
1. Create a `.env` file in the `backend/` folder (or copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and add your Google Gemini API key:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSy...your_gemini_key_here
   ```
   *Note: You can secure a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).*

### Step 3: Run the Application
Start the Node.js server in development mode:
```bash
npm run dev
```

The terminal will confirm:
```
=================================================
 FutureMe app running on http://localhost:5000 
=================================================
```

### Step 4: Open in Your Browser
Open your browser and navigate to:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 📡 Backend API Endpoints

### 1. `POST /api/generate-futureme`
Generates a structured reflection card from the future self.
- **Payload Schema:**
  ```json
  {
    "name": "Nitish",
    "age": "23",
    "goal": "Build a successful AI startup",
    "struggle": "Lack of consistency",
    "oneYearVision": "Running a profitable AI company",
    "tone": "Brutally Honest"
  }
  ```
- **Response Schema:**
  ```json
  {
    "success": true,
    "data": {
      "message": "A powerful 120-180 word message from the future self.",
      "futureIdentity": "A concise description of who the user is becoming.",
      "nextMoves": ["Action 1", "Action 2", "Action 3"],
      "habit": "One small daily habit they should start today.",
      "warning": "One mistake their future self warns them about.",
      "mantra": "A short memorable line they can repeat daily."
    }
  }
  ```

### 2. `POST /api/chat-futureme`
Handles direct follow-up questions from the user, preserving context and profile details.
- **Payload Schema:**
  ```json
  {
    "userProfile": {
      "name": "Nitish",
      "age": "23",
      "goal": "Build a successful AI startup",
      "struggle": "Lack of consistency",
      "oneYearVision": "Running a profitable AI company",
      "tone": "Brutally Honest"
    },
    "chatHistory": [
      { "role": "user", "message": "Will I actually make it?" },
      { "role": "futureme", "message": "Only if your daily actions stop negotiating with your dreams." }
    ],
    "question": "What should I focus on this week?"
  }
  ```
- **Response Schema:**
  ```json
  {
    "success": true,
    "reply": "A personalized response continuing in character."
  }
  ```

---

## 🚀 Future Improvements
Google/GitHub Authentication
Persistent Chat History Storage
Goal Tracking Dashboard
Email Reminders and Progress Reports
Enhanced AI Conversation Context
Multiple Future Self Personalities
Analytics and User Insights

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.
