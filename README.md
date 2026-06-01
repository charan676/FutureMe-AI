# ✨ FutureMe — A Conversation with Your Future Self

FutureMe is an immersive, AI-powered personal reflection platform. Built with an Apple-style, dark glassmorphic UI, it allows users to reflect on their current struggles, goals, and ambition, and generate an emotionally intelligent, personalized, and highly actionable letter from their future successful self. 

Users can also enter a direct, immersive chat session with their future self to ask follow-up questions, with responses dynamically shifting tone based on selected persona modes.

---

## 🚀 Key Features

- **Apple-inspired Dark UI:** Sleek glassmorphism cards, customized radial glows, beautiful custom typography (Outfit + Inter), and fluid responsiveness.
- **Dynamic Loader Stages:** A starry cosmic loading animation that morphs through distinct phases (calibrating timeline matrices, connecting self frequencies).
- **Dynamic Personality Tones:** Integrated Gemini API prompt styles mapping to 4 distinct modes:
  - ✨ **Motivational:** Warm, supportive, uplifting, and encouraging.
  - 🔥 **Brutally Honest:** Ultra-direct, accountable, sharp, calling out excuses.
  - 🌱 **Calm Mentor:** Wise, grounded, peaceful, and mindful of long-term alignments.
  - 💼 **CEO Mode:** Tactical operational metrics, systems-oriented, high-performance.
- **Immersion Dialogue (Chat):** Direct chat pane below the letter allowing users to message their future self with dynamic typing indicators and context retention.
- **Copy & Share Widgets:** Minimalist, Apple-style toast notifying users when their formatted ASCII letter has been copied to their clipboard.
- **Unified Port Architecture:** Single-server execution model. The Express backend serves the static frontend seamlessly, avoiding CORS difficulties.

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

## 🌟 Demo Guide for Sunday Session

1. **Setup beforehand:** Run `npm run dev` and ensure the terminal console shows port `5000`.
2. **First view:** Highlight the dark, glass-blur design and status indicators that give it an ultra-premium feel.
3. **Trigger transition:** Fill in the reflection inputs, select the *Brutally Honest* or *CEO Mode* tone, and hit the generate button.
4. **Showcase loading:** Call attention to the custom temporal portal phase shifts (calibrating, aligning, translating) that make the AI load time feel like an organic experience.
5. **The Letter Reveal:** Show the layout, highlighting semantic panels like the "Emerald Habit Card" and "Amber Warning Card", showing they aren't generic motivational lists.
6. **Live Conversation:** Hit "Speak to Your Future Self" and ask a live question (e.g. *"What if I fail?"*). Demonstrate how the AI keeps recent history in context and stays locked into its selected personality tone.
7. **Copy Action:** Click "Copy Full Result" to showcase the minimalist slide-up copy toast and show the beautifully formatted ASCII structure in another text view.
