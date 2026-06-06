/**
 * Wellness Helper Utilities
 * Pure functions with zero side-effects to ensure effortless unit testing
 */

/**
 * Calculates a wellness score (0 - 100) based on mood and stress level.
 * Great mood + lower stress leads to a higher score.
 * 
 * @param moodString - Current mood (e.g. '😀 Great', '🙂 Good')
 * @param stressLevel - Numeric stress indicator (1 to 10)
 */
export function calculateWellnessScore(moodString: string, stressLevel: number): number {
  const normalizedMood = moodString || "🙂 Good";
  const normalizedStress = Math.max(1, Math.min(10, stressLevel));

  let moodPoints = 80; // default 'Good'
  
  if (normalizedMood.includes("Great")) {
    moodPoints = 100;
  } else if (normalizedMood.includes("Good")) {
    moodPoints = 80;
  } else if (normalizedMood.includes("Okay")) {
    moodPoints = 60;
  } else if (normalizedMood.includes("Stressed")) {
    moodPoints = 40;
  } else if (normalizedMood.includes("Overwhelmed")) {
    moodPoints = 20;
  }

  // Stress scales from 1 (optimal) to 10.
  // Penalty scales up with stress points offset from 1.
  const stressPenalty = (normalizedStress - 1) * 8;
  return Math.max(0, Math.min(100, moodPoints - stressPenalty));
}

/**
 * Converts a numeric score to a standardized letter grade.
 */
export function getWellnessGrade(score: number): "A+" | "A" | "B+" | "C" | "F" {
  if (score >= 90) return "A+";
  if (score >= 75) return "A";
  if (score >= 60) return "B+";
  if (score >= 45) return "C";
  return "F";
}

/**
 * Map mood strings to numerical coordinates for charts and metrics.
 */
export function getMoodScore(moodStr: string): number {
  if (moodStr.includes("Great")) return 5;
  if (moodStr.includes("Good")) return 4;
  if (moodStr.includes("Okay")) return 3;
  if (moodStr.includes("Stressed")) return 2;
  if (moodStr.includes("Overwhelmed")) return 1;
  return 3;
}

/**
 * Return legible localized label matching a numeric mood code.
 */
export function getMoodLabel(score: number): string {
  switch (score) {
    case 5: return "😀 Great";
    case 4: return "🙂 Good";
    case 3: return "😐 Okay";
    case 2: return "😔 Stressed";
    case 1: return "😭 Overwhelmed";
    default: return "😐 Okay";
  }
}

/**
 * Input sanitization & character clamp validations.
 */
export function validateReflectionText(text: string): { valid: boolean; error: string | null; cleanText: string } {
  const trimmed = (text || "").trim();
  if (trimmed.length > 2000) {
    return {
      valid: false,
      error: "Reflection text is too long (maximum 2000 characters). Please condense your thoughts.",
      cleanText: trimmed.substring(0, 2000)
    };
  }
  return {
    valid: true,
    error: null,
    cleanText: trimmed
  };
}

export function validateChatMessage(text: string): { valid: boolean; error: string | null; cleanText: string } {
  const trimmed = (text || "").trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: "Message cannot be empty.",
      cleanText: ""
    };
  }
  if (trimmed.length > 500) {
    return {
      valid: false,
      error: "Message is too long (maximum 500 characters). Please send a shorter summary.",
      cleanText: trimmed.substring(0, 500)
    };
  }
  return {
    valid: true,
    error: null,
    cleanText: trimmed
  };
}

export function validateStressorInput(text: string): { valid: boolean; error: string | null; cleanText: string } {
  const trimmed = (text || "").trim();
  if (trimmed.length === 0) {
    return {
      valid: false,
      error: "Stressor name cannot be empty.",
      cleanText: ""
    };
  }
  if (trimmed.length > 50) {
    return {
      valid: false,
      error: "Stressor name cannot exceed 50 characters.",
      cleanText: trimmed.substring(0, 50)
    };
  }
  return {
    valid: true,
    error: null,
    cleanText: trimmed
  };
}
