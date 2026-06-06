import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
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

// ------------------ API ROUTES ------------------

// 1. Unified Health / Settings endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// 2. Chat endpoint (AI Coach)
app.post("/api/gemini/coach", async (req, res): Promise<any> => {
  try {
    const { history, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    // Reconstruct conversation history compatible with Type
    const contents: any[] = [];
    if (Array.isArray(history)) {
      history.forEach((msg: { role: string; text: string }) => {
        contents.push({
          role: msg.role === "ai" ? "model" : "user",
          parts: [{ text: msg.text }],
        });
      });
    }
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini API" });
  }
});

// 3. Stress Trigger Analysis Endpoint
app.post("/api/gemini/triggers", async (req, res): Promise<any> => {
  try {
    const { inputs } = req.body;
    if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
      return res.status(400).json({ error: "Triggers array is required" });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Gemini Triggers Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini API" });
  }
});

// 4. Daily Motivation Generator
app.post("/api/gemini/motivation", async (req, res): Promise<any> => {
  try {
    const { mood, stressLevel, reflection } = req.body;

    const ai = getGeminiClient();

    const promptText = `
      Please generate personalized student motivation.
      - Current Mood: ${mood || "Not reported"}
      - Stress Level: ${stressLevel || "Not reported"}/10
      - Todays Reflection: ${reflection || "Not reported"}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Gemini Motivation Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini API" });
  }
});

// 5. AI Study-Life Balance Suggestions
app.post("/api/gemini/balance", async (req, res): Promise<any> => {
  try {
    const { examName, hoursStudied, sleepHours } = req.body;
    if (!examName || hoursStudied === undefined || sleepHours === undefined) {
      return res.status(400).json({ error: "Missing required fields: examName, hoursStudied, sleepHours" });
    }

    const ai = getGeminiClient();

    const promptText = `
      Provide healthy study-life balance feedback for a student preparing for: ${examName}.
      - Devoted Study Hours: ${hoursStudied} hours/day
      - Sleep Hours: ${sleepHours} hours/day
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
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
    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Gemini Balance Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini API" });
  }
});

// ------------------ STANDALONE SERVER / VITE setup ------------------

async function run() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode - Serve Static Files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MindMate Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

run().catch((err) => {
  console.error("Failed to start server:", err);
});
