import { describe, it, expect } from "vitest";
import { calculateWellnessScore, getWellnessGrade, getMoodScore, validateChatMessage } from "../utils/wellness";

/**
 * MindMate Student — Hackathon Testing Readiness Suite
 * 
 * To execute these tests, run:
 * npx vitest run src/tests/wellness.test.ts
 */

describe("Wellness Score Math Calculator", () => {
  it("should reward positive moods paired with minimum stress levels", () => {
    const score = calculateWellnessScore("😀 Great", 1);
    expect(score).toBe(100);
  });

  it("should output average points for Good mood and mild stress levels", () => {
    const score = calculateWellnessScore("🙂 Good", 4);
    // Mood points: 80, penalty: (4 - 1) * 8 = 24. Expected: 56.
    expect(score).toBe(56);
  });

  it("should apply severe stress penalty and clip at absolute zero", () => {
    const score = calculateWellnessScore("😭 Overwhelmed", 10);
    // Mood points: 20, penalty: (10 - 1) * 8 = 72. 20 - 72 is negative, should be 0.
    expect(score).toBe(0);
  });
});

describe("Wellness Report Card Grade Mapping", () => {
  it("should classify 90%+ scores as A+ performance indicators", () => {
    expect(getWellnessGrade(95)).toBe("A+");
    expect(getWellnessGrade(90)).toBe("A+");
  });

  it("should assign F grades strictly to scores below 45%", () => {
    expect(getWellnessGrade(40)).toBe("F");
    expect(getWellnessGrade(10)).toBe("F");
  });
});

describe("Mood Emoji Score Transformer", () => {
  it("should translate Great mood strings to numeric value 5", () => {
    expect(getMoodScore("😀 Great")).toBe(5);
  });

  it("should fall back safely in case of unsupported inputs", () => {
    expect(getMoodScore("Unsupported Mood")).toBe(3);
  });
});

describe("Client Input String Cleaners & Guards", () => {
  it("should reject messages consisting entirely of blank lines", () => {
    const result = validateChatMessage("   ");
    expect(result.valid).toBe(false);
    expect(result.error).toContain("cannot be empty");
  });

  it("should trim and validate safe messages correctly", () => {
    const result = validateChatMessage("  I feel a bit overwhelmed but ready to study.  ");
    expect(result.valid).toBe(true);
    expect(result.cleanText).toBe("I feel a bit overwhelmed but ready to study.");
  });

  it("should intercept and truncate spam inputs exceeding char ceilings", () => {
    const veryLongSpam = "A".repeat(600);
    const result = validateChatMessage(veryLongSpam);
    expect(result.valid).toBe(false);
    expect(result.cleanText.length).toBe(500);
  });
});
