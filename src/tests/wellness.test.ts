import { describe, it, expect } from "vitest";
import {
  calculateWellnessScore,
  getWellnessGrade,
  getMoodScore,
  getMoodLabel,
  validateReflectionText,
  validateChatMessage,
  validateStressorInput
} from "../utils/wellness";

/**
 * MindMate Student — Professional Hackathon Testing Suite
 * Exhaustive coverage checking every logical block, validation category,
 * clamping behavior, boundary transition, and fallback values.
 */

describe("Wellness Score Formula & Clamp Logic", () => {
  it("should return the perfect score of 100 on positive mood and lowest stress level", () => {
    // Great mood starts at 100. Stress offset = (1 - 1) = 0. Penalty = 0. Result: 100
    const score = calculateWellnessScore("😀 Great", 1);
    expect(score).toBe(100);
  });

  it("should default to 80 points (Good) if an empty list or invalid mood string is provided", () => {
    // Empty mood defaults to Good (80). Stress offset = (1 - 1) * 8 = 0.
    const scoreEmpty = calculateWellnessScore("", 1);
    expect(scoreEmpty).toBe(80);

    // Invalid mood defaults to Good (80). Stress level 2 offset = (2 - 1) * 8 = 8. Score = 72
    const scoreInvalid = calculateWellnessScore("Random mood text", 2);
    expect(scoreInvalid).toBe(72);
  });

  it("should calculate correct scores for all standardized moods under neutral stress level 5", () => {
    // Stress offset = (5 - 1) * 8 = 32 penalty
    
    // "Great" = 100 - 32 = 68
    expect(calculateWellnessScore("😀 Great", 5)).toBe(68);
    
    // "Good" = 80 - 32 = 48
    expect(calculateWellnessScore("🙂 Good", 5)).toBe(48);
    
    // "Okay" = 60 - 32 = 28
    expect(calculateWellnessScore("😐 Okay", 5)).toBe(28);
    
    // "Stressed" = 40 - 32 = 8
    expect(calculateWellnessScore("😔 Stressed", 5)).toBe(8);
    
    // "Overwhelmed" = 20 - 32 = -12 -> clamped to 0
    expect(calculateWellnessScore("😭 Overwhelmed", 5)).toBe(0);
  });

  it("should clamp the stress input on the lower boundary (values less than 1)", () => {
    // Stress 0 is clamped to 1. "Okay" = 60. Offset = (1 - 1) * 8 = 0. Expected: 60.
    expect(calculateWellnessScore("😐 Okay", 0)).toBe(60);
    
    // Stress -5 is clamped to 1. "Great" = 100. Expected: 100.
    expect(calculateWellnessScore("😀 Great", -5)).toBe(100);
  });

  it("should clamp the stress input on the upper boundary (values greater than 10)", () => {
    // Stress 11 is clamped to 10. "Good" = 80. Penalty = (10 - 1) * 8 = 72. Expected: 8.
    expect(calculateWellnessScore("🙂 Good", 11)).toBe(8);
    
    // Stress 100 is clamped to 10. "Great" = 100. Penalty = 72. Expected: 28.
    expect(calculateWellnessScore("😀 Great", 100)).toBe(28);
  });

  it("should never let the final score fall below 0 or exceed 100", () => {
    // "Overwhelmed" (20) with stress level 10 (72 penalty) = -52 -> clamped to 0
    expect(calculateWellnessScore("😭 Overwhelmed", 10)).toBe(0);
    
    // "Great" (100) with clamped lower stress level 0 (0 penalty) = 100
    expect(calculateWellnessScore("😀 Great", -1)).toBe(100);
  });
});

describe("Wellness Report Card Grade Mapping", () => {
  it("should correctly map grade boundaries for A+ range (>= 90)", () => {
    expect(getWellnessGrade(100)).toBe("A+");
    expect(getWellnessGrade(91)).toBe("A+");
    expect(getWellnessGrade(90)).toBe("A+");
  });

  it("should correctly map grade boundaries for A range (75 to 89)", () => {
    expect(getWellnessGrade(89)).toBe("A");
    expect(getWellnessGrade(76)).toBe("A");
    expect(getWellnessGrade(75)).toBe("A");
  });

  it("should correctly map grade boundaries for B+ range (60 to 74)", () => {
    expect(getWellnessGrade(74)).toBe("B+");
    expect(getWellnessGrade(61)).toBe("B+");
    expect(getWellnessGrade(60)).toBe("B+");
  });

  it("should correctly map grade boundaries for C range (45 to 59)", () => {
    expect(getWellnessGrade(59)).toBe("C");
    expect(getWellnessGrade(46)).toBe("C");
    expect(getWellnessGrade(45)).toBe("C");
  });

  it("should correctly map grade boundaries for F range (< 45)", () => {
    expect(getWellnessGrade(44)).toBe("F");
    expect(getWellnessGrade(20)).toBe("F");
    expect(getWellnessGrade(0)).toBe("F");
    expect(getWellnessGrade(-10)).toBe("F");
  });
});

describe("Mood Score & Emoji Coordinates Transformer", () => {
  it("should return correct scores for all recognized moods", () => {
    expect(getMoodScore("Great")).toBe(5);
    expect(getMoodScore("Good")).toBe(4);
    expect(getMoodScore("Okay")).toBe(3);
    expect(getMoodScore("Stressed")).toBe(2);
    expect(getMoodScore("Overwhelmed")).toBe(1);
  });

  it("should fall back safely to 3 (Okay) on unsupported mood text", () => {
    expect(getMoodScore("some random text")).toBe(3);
    expect(getMoodScore("")).toBe(3);
  });
});

describe("Mood Score To Labels Generator", () => {
  it("should correctly format exact user labels for valid scores 1-5", () => {
    expect(getMoodLabel(5)).toBe("😀 Great");
    expect(getMoodLabel(4)).toBe("🙂 Good");
    expect(getMoodLabel(3)).toBe("😐 Okay");
    expect(getMoodLabel(2)).toBe("😔 Stressed");
    expect(getMoodLabel(1)).toBe("😭 Overwhelmed");
  });

  it("should default to 😐 Okay when index values are out of bounds", () => {
    expect(getMoodLabel(0)).toBe("😐 Okay");
    expect(getMoodLabel(6)).toBe("😐 Okay");
    expect(getMoodLabel(-1)).toBe("😐 Okay");
  });
});

describe("Text Validation & Sanitizers", () => {
  describe("validateReflectionText", () => {
    it("should authorize safe strings and return trimmed outcomes", () => {
      const res = validateReflectionText("   Feeling positive and energetic.    ");
      expect(res.valid).toBe(true);
      expect(res.error).toBeNull();
      expect(res.cleanText).toBe("Feeling positive and energetic.");
    });

    it("should accept empty or missing reflection entries cleanly", () => {
      const res = validateReflectionText("");
      expect(res.valid).toBe(true);
      expect(res.cleanText).toBe("");
    });

    it("should validate and truncate over-long reflection texts greater than 2000 chars", () => {
      const longInput = "A".repeat(2100);
      const res = validateReflectionText(longInput);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("too long");
      expect(res.cleanText.length).toBe(2000);
    });
  });

  describe("validateChatMessage", () => {
    it("should block empty messages or whitespace entries", () => {
      const res = validateChatMessage("      ");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("cannot be empty");
    });

    it("should allow validated messages under 500 characters", () => {
      const valText = "I need exam preparation strategies.";
      const res = validateChatMessage(valText);
      expect(res.valid).toBe(true);
      expect(res.cleanText).toBe(valText);
    });

    it("should block and clamp messages exceeding 500 characters limit", () => {
      const spamVal = "B".repeat(505);
      const res = validateChatMessage(spamVal);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("too long");
      expect(res.cleanText.length).toBe(500);
    });
  });

  describe("validateStressorInput", () => {
    it("should block blank custom stressor names", () => {
      const res = validateStressorInput("   ");
      expect(res.valid).toBe(false);
      expect(res.error).toContain("cannot be empty");
    });

    it("should block stressor names larger than 50 characters", () => {
      const longStressor = "Chemistry exam combined with difficult physics lab mock papers which is crazy";
      const res = validateStressorInput(longStressor);
      expect(res.valid).toBe(false);
      expect(res.error).toContain("cannot exceed 50 characters");
      expect(res.cleanText.length).toBe(50);
    });

    it("should allow valid normal-sized stressor strings", () => {
      const res = validateStressorInput("  Mock Results Anxiety   ");
      expect(res.valid).toBe(true);
      expect(res.cleanText).toBe("Mock Results Anxiety");
    });
  });
});
