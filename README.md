# MindMate Student — AI Wellness Companion 🧠✨

MindMate Student is a beautifully crafted, highly responsive digital wellness companion designed to help students (ages 14-25) navigate the emotional, cognitive, and physical pressures of competitive exams (like JEE, NEET, UPSC, Board exams, and postgraduate entrance cycles).

---

## 🎨 Visual Identity: The "Frosted Glass" Theme
The interface utilizes an elegant **Frosted Glass** aesthetic prioritizing focus, calm, and generous negative space:
- **Immersive Gradient Canvas**: Wrapped in a smooth, custom desktop-first linear background (`#e0eafc` to `#cfdef3`).
- **Translucent Sheet Layouts**: Elements utilize highly polished `backdrop-blur-xl` panels, offset by delicate `border-white/40` trims and subtle high-utility shadows.
- **Color Accent Rhythm**: Styled with calming Indigo and friendly Emerald highlights mapped to healthy wellness milestones.
- **Responsive Navigation**: Includes floating header bars for desktop sizing matched with touch-safe, thumb-friendly navigation sheets on mobile platforms.

---

## 🏗️ Architecture & Direct Frontend Integration
The app operates on a modern, ultra-portable **frontend-only SPA (Single Page Application)** mode built with **React, TypeScript, and Vite**:
- **Zero Express Dependency**: The standard Node/Express backend has been completely removed to ensure fast runtime loading, ease of self-hosting, and instant client-side initialization.
- **Direct Web Gemini Integration**: Embedded with the next-generation `@google/genai` SDK communicating directly from the browser layer.
- **`gemini-3.5-flash` Engine**: Operates with high token efficiency and zero latency, delivering real-time responses to student reflections.
- **Environment Management**: Utilizes `VITE_GEMINI_API_KEY` for local setups, mapped in standard env templates.

---

## 🔋 Core Feature Modules

### 1. Daily Season Mood Check-In & Diagnostics
- Log current mood states overlaid with a specialized **Stress Intensity Slider**.
- Dynamically calculate an instant **Daily Wellness Score** graded from `A+` to `F`, incorporating a premium circular progress panel and immediate contextual advice.
- Record personal, raw thoughts using a **Today's Reflection** card offering rotating inspirational prompt triggers to encourage journaling.

### 2. Chronological Stress & Mood Grid History
- Keep track of mood changes, stress values, and calculated wellness scores stored directly in local client persistence.
- Easily filter, locate, and clean up past logs to manage trends without any cloud databases.

### 3. AI Student Wellness Coach Chat
- A dedicated, warm counseling companion focused strictly on student struggles.
- Optimized with predefined query starters ("mock test fears", "family expectations", "retaining syllabus facts") to make conversations immediate and effortless.

### 4. Active Stress Reliever Suite
- **Interactive Box Breathing (4-4-4)**: A real-time breathing bubble visualizer guiding inhale-hold-exhale loops to calm mock-test panics.
- **AI Stress Trigger Analyzer**: Isolate arbitrary stressors (such as chemistry, long commutes, peer pressure, or bad scores) to get custom structural coping advice.
- **AI Daily Motivation Booster**: Fuses your immediate check-in logs and reflection snippets into personalized motivational pep talks and matching habits.
- **AI Study-Life Balance Suggester**: A regulatory calculator verifying study density ratios to safeguard sleep cycles.

---

## 🛠️ Local Development & Configuration

### Prerequisites
1. Ensure you have Node.js and npm installed.
2. Clone the folder and add a `.env` file containing your companion credentials:
   ```env
   VITE_GEMINI_API_KEY="your_actual_gemini_api_key_here"
   ```

### Execution Commands
```bash
# Install required developer packages
npm install

# Boot development environment immediately
npm run dev

# Run TypeScript safety validation linting checks
npm run lint

# Build optimized production bundle
npm run build
```
