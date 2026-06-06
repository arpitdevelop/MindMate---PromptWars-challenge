import { GoogleGenAI, Type } from "@google/genai";
import { StressTriggerAnalysis, DailyMotivation, StudyLifeBalance } from "../types";

// User-specified model alias
const GEMINI_MODEL = "gemini-3.5-flash";

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) {
      throw new Error(
        "VITE_GEMINI_API_KEY is missing. Please add VITE_GEMINI_API_KEY to your env/secrets settings."
      );
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * 1. AI Coach Chat response generator
 */
export async function generateCoachResponse(
  history: { role: string; text: string }[],
  message: string
): Promise<string> {
  const ai = getGeminiClient();

  // Reconstruct conversation history compatible with the SDK format
  const contents: any[] = [];
  if (Array.isArray(history)) {
    history.forEach((msg) => {
      contents.push({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      });
    });
  }
  contents.push({ role: "user", parts: [{ text: message }] });

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: contents,
    config: {
      systemInstruction: `You are a supportive student wellness coach.

Your role is to:
- Help students manage stress, anxiety, mock scores, exam fear, and results.
- Encourage healthy study habits.
- Promote self-reflection.
- Give motivational but realistic advice.
- Suggest relaxation techniques.
- Never shame students.
- Never diagnose mental illnesses.
- Never give medical advice.
- Keep responses empathetic, supportive, and actionable.
- Use simple, friendly, Gen-Z accessible language suitable for students aged 14-25.

Format your response in simple paragraphs with:
1. Empathy & Understanding: Validate the emotion.
2. Practical advice: Actionable tips.
3. A small actionable step for today.

Keep your response friendly, clear, and strictly under 200 words. Do not use complex formatting.`,
    },
  });

  return response.text || "I am here supporting you. Try taking a deep breath.";
}

/**
 * 2. AI Stress Trigger Analyzer
 */
export async function generateTriggerAnalysis(inputs: string[]): Promise<StressTriggerAnalysis> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Perform stress trigger analysis for a student feeling overwhelmed. The student listed the following stressors: ${inputs.join(", ")}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          primaryTriggers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "The primary underlying root causes parsed from the student input.",
          },
          suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Practical, Gen-Z accessible, highly actionable steps the student can take to address these triggers.",
          },
          encouragement: {
            type: Type.STRING,
            description: "Uplifting, empathetic, highly reassuring brief motivational note (30-50 words max).",
          },
        },
        required: ["primaryTriggers", "suggestions", "encouragement"],
      },
    },
  });

  const resultText = response.text || "{}";
  return JSON.parse(resultText.trim()) as StressTriggerAnalysis;
}

/**
 * 3. Daily Motivation Generator
 */
export async function generateDailyMotivation(
  mood: string,
  stressLevel: number,
  reflection: string
): Promise<DailyMotivation> {
  const ai = getGeminiClient();

  const promptText = `
    Please generate personalized student motivation.
    - Current Mood: ${mood || "Not reported"}
    - Stress Level: ${stressLevel || "Not reported"}/10
    - Today's Reflection: ${reflection || "Not reported"}
  `;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          motivation: {
            type: Type.STRING,
            description: "An uplifting, extremely supportive speech customized to their mood and stress level.",
          },
          studyTip: {
            type: Type.STRING,
            description: "A highly actionable, specific study technique appropriate for a student in this state.",
          },
          wellnessTip: {
            type: Type.STRING,
            description: "A simple stress-relieving mental wellness technique to do right now.",
          },
        },
        required: ["motivation", "studyTip", "wellnessTip"],
      },
    },
  });

  const resultText = response.text || "{}";
  return JSON.parse(resultText.trim()) as DailyMotivation;
}

/**
 * 4. AI Study-Life Balance Suggestions
 */
export async function generateBalanceSuggestions(
  examName: string,
  hoursStudied: number,
  sleepHours: number
): Promise<StudyLifeBalance> {
  const ai = getGeminiClient();

  const promptText = `
    Provide healthy study-life balance feedback for a student preparing for: ${examName}.
    - Devoted Study Hours: ${hoursStudied} hours/day
    - Sleep Hours: ${sleepHours} hours/day
  `;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: promptText,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feedback: {
            type: Type.STRING,
            description: "Feedback explaining if their ratio of study and sleep is healthy and sustainable.",
          },
          sleepSuggestions: {
            type: Type.STRING,
            description: "Tips on optimizing quality sleep for a student aiming for high academic performance.",
          },
          breakRecommendations: {
            type: Type.STRING,
            description: "Break patterns (e.g. 50/10 intervals, physical pauses) matching their schedule density.",
          },
        },
        required: ["feedback", "sleepSuggestions", "breakRecommendations"],
      },
    },
  });

  const resultText = response.text || "{}";
  return JSON.parse(resultText.trim()) as StudyLifeBalance;
}
