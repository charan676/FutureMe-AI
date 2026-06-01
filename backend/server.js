const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Gemini API Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here' || apiKey.startsWith('replace_with')) {
    throw new Error('Gemini API key is not configured. Please add your GEMINI_API_KEY in backend/.env');
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Utility to extract and parse JSON from Gemini's response safely.
 * Handles potential markdown wrappers like ```json ... ```
 */
function parseGeminiJSON(text) {
  let cleaned = text.trim();
  
  // Remove markdown code block markers if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\s*```$/, '');
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Direct JSON parsing failed. Attempting structural recovery. Raw Text:', text);
    
    // Attempt recovery by locating the outer object bounds
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const recoveredCandidate = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(recoveredCandidate);
      } catch (recError) {
        throw new Error(`JSON recovery failed: ${recError.message}. Content was: ${recoveredCandidate}`);
      }
    }
    throw new Error(`Could not locate a JSON object in output: ${error.message}`);
  }
}

// 1. POST /api/generate-futureme
app.post('/api/generate-futureme', async (req, res) => {
  try {
    const { name, age, goal, struggle, oneYearVision, tone } = req.body;

    // Validate fields
    if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required reflection details. Please complete all fields.'
      });
    }

    console.log(`[FutureMe] Generating reflection for ${name} (${age}) with tone: ${tone}`);

    const ai = getGeminiClient();
    // Use gemini-2.5-flash as default (working model for active quota)
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt = `You are FutureMe, the future successful version of the user. You are not a generic motivational coach. You speak with emotional intelligence, clarity, and deep personal understanding. Your job is to help the user see who they are becoming, what they must change, and what they should do next.

Write as if you are the user's future self speaking directly to their current self.

Tone selected by user: ${tone}
(Note: Adapt your tone specifically: 
 - "Motivational" should be warm, inspiring, deeply supportive, and elevating.
 - "Brutally Honest" should be direct, sharp, no excuses, calling out self-handicapping behaviors.
 - "Calm Mentor" should be peaceful, wise, grounded, patient, and reflective.
 - "CEO Mode" should be highly strategic, focused on high-performance execution, systems, and metrics.)

User details:
Name: ${name}
Age: ${age}
Goal: ${goal}
Current struggle: ${struggle}
One-year vision: ${oneYearVision}

Return only valid JSON in this exact format:
{
  "message": "A powerful 120-180 word message from the future self.",
  "futureIdentity": "A concise description of who the user is becoming.",
  "nextMoves": ["Action 1", "Action 2", "Action 3"],
  "habit": "One small daily habit they should start today.",
  "warning": "One mistake their future self warns them about.",
  "mantra": "A short memorable line they can repeat daily.",
  "dailyPlan": [
    {
      "timeSlot": "e.g. 07:00 AM - 08:30 AM (Focus Block)",
      "task": "A concrete, outcome-oriented task relevant to their goal.",
      "motivation": "A short, highly tailored, emotional prompt from their future self urging them past their specific struggle.",
      "energyLevel": "High"
    },
    {
      "timeSlot": "e.g. 01:00 PM - 02:30 PM (Execution & Alignment)",
      "task": "A task focused on core execution, validation, or learning.",
      "motivation": "A supportive or direct advice item that directly addresses their struggle (e.g. inconsistency, fear).",
      "energyLevel": "Medium"
    },
    {
      "timeSlot": "e.g. 05:00 PM - 06:00 PM (Reflection & System Setup)",
      "task": "A task designed to log metrics, reflect, and prepare the next day.",
      "motivation": "Supportive mentoring focusing on consistency and long-term pacing.",
      "energyLevel": "Low"
    }
  ]
}

Make it specific. Avoid generic motivation. Avoid clichés. Make it emotional but practical. Must contain exactly 3 slots in dailyPlan.`;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    console.log('[FutureMe] Raw response received from Gemini.');
    const parsedData = parseGeminiJSON(responseText);

    return res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('[FutureMe API Error]:', error.message);
    
    // Provide user-friendly response for API key missing cases
    if (error.message.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Gemini API key is not configured. Please add your GEMINI_API_KEY in the backend/.env file.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'FutureMe could not respond right now. Try again.'
    });
  }
});

// 2. POST /api/chat-futureme
app.post('/api/chat-futureme', async (req, res) => {
  try {
    const { userProfile, chatHistory, question } = req.body;

    if (!userProfile || !question) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request body. User profile and question are required.'
      });
    }

    console.log(`[FutureMe Chat] Continuing conversation with ${userProfile.name}`);

    // Format previous chat history for Gemini's context
    const formattedHistory = (chatHistory || [])
      .map(chat => `${chat.role === 'user' ? 'User' : 'FutureMe'}: ${chat.message}`)
      .join('\n');

    const ai = getGeminiClient();
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chatPrompt = `You are FutureMe, the future version of the user who already achieved their one-year vision. Reply directly to the user's question. Be personal, sharp, honest, and useful. Do not sound like a normal AI assistant. Do not mention that you are Gemini or an AI model. Speak like the future self.

User profile:
Name: ${userProfile.name}
Age: ${userProfile.age}
Goal: ${userProfile.goal}
Struggle: ${userProfile.struggle}
One-year vision: ${userProfile.oneYearVision}
Tone: ${userProfile.tone}
(Note: Respond in the style of the chosen tone: ${userProfile.tone})

Recent chat history:
${formattedHistory || '(No previous history)'}

Current question:
${question}

Reply in 2-5 short paragraphs. Give at least one clear action.`;

    const result = await model.generateContent(chatPrompt);
    const replyText = result.response.text().trim();

    return res.status(200).json({
      success: true,
      reply: replyText
    });

  } catch (error) {
    console.error('[FutureMe Chat Error]:', error.message);
    
    if (error.message.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Gemini API key is not configured. Please add your GEMINI_API_KEY in the backend/.env file.'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'FutureMe could not respond right now. Try again.'
    });
  }
});

// Fallback: serve frontend index.html for undefined routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Conditional startup: Only listen on a port when executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(` FutureMe app running on http://localhost:${PORT} `);
    console.log(`=================================================`);
  });
}

// Export Express app for serverless function importing
module.exports = app;

