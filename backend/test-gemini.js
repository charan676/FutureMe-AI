const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');

dotenv.config();

// Re-use the exact parse utility from server.js
function parseGeminiJSON(text) {
  let cleaned = text.trim();
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
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const recoveredCandidate = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(recoveredCandidate);
    }
    throw error;
  }
}

async function testFullPipeline() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API key is not configured!');
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    console.log('Initiating dry run of FutureMe Prompt with gemini-2.5-flash...');

    const systemPrompt = `You are FutureMe, the future successful version of the user. You are not a generic motivational coach. You speak with emotional intelligence, clarity, and deep personal understanding. Your job is to help the user see who they are becoming, what they must change, and what they should do next.

Write as if you are the user's future self speaking directly to their current self.

Tone selected by user: Brutally Honest

User details:
Name: Alex
Age: 23
Goal: Build a successful AI startup
Current struggle: Lack of consistency
One-year vision: Running a profitable AI company

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
    const text = result.response.text();
    console.log('\n=== Raw response from Gemini ===');
    console.log(text);
    console.log('================================\n');

    console.log('Attempting to parse response...');
    const parsed = parseGeminiJSON(text);
    console.log('🎉 SUCCESS! Parsed Output structure:');
    console.log(JSON.stringify(parsed, null, 2));

  } catch (error) {
    console.error('Pipeline test failed!');
    console.error('Error Details:', error);
  }
}

testFullPipeline();
