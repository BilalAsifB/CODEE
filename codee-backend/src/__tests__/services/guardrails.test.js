import { describe, test, expect } from "@jest/globals";
import {
  validatePrompt,
  quickValidatePrompt,
  checkUnsafeKeywords,
  checkCodingRelevance,
  checkNonCodingContent,
} from "../../services/guardrails.js";

describe("Guardrails Service", () => {
  describe("validatePrompt", () => {
    test("should accept valid coding prompt", () => {
      const result = validatePrompt(
        "Write a Python function to calculate factorial"
      );
      expect(result.valid).toBe(true);
    });

    test("should reject prompt that is too short", () => {
      const result = validatePrompt("code");
      expect(result.valid).toBe(false);
      expect(result.type).toBe("length");
      expect(result.reason).toContain("too short");
    });

    test("should reject prompt that is too long", () => {
      const longPrompt = "a".repeat(5001);
      const result = validatePrompt(longPrompt);
      expect(result.valid).toBe(false);
      expect(result.type).toBe("length");
      expect(result.reason).toContain("too long");
    });

    test("should reject prompt with unsafe keywords", () => {
      const result = validatePrompt("Write code to create a malware program");
      expect(result.valid).toBe(false);
      expect(result.type).toBe("unsafe");
    });

    test("should reject non-coding requests", () => {
      const result = validatePrompt("Write me a love letter to my girlfriend");
      expect(result.valid).toBe(false);
      expect(result.type).toBe("non-coding");
    });

    test("should reject prompts without coding keywords", () => {
      const result = validatePrompt(
        "Tell me about the weather today in New York"
      );
      expect(result.valid).toBe(false);
      expect(result.type).toBe("relevance");
    });

    test("should trim whitespace before validation", () => {
      const result = validatePrompt("   Write a function to sort an array   ");
      expect(result.valid).toBe(true);
    });

    test("should accept prompts with mixed case coding keywords", () => {
      const result = validatePrompt("Create a JavaScript API endpoint");
      expect(result.valid).toBe(true);
    });
  });

  describe("quickValidatePrompt", () => {
    test("should return valid status for good prompt", () => {
      const result = quickValidatePrompt(
        "Write a function to reverse a string"
      );
      expect(result.valid).toBe(true);
      expect(result.checks.length.valid).toBe(true);
    });

    test("should return invalid for short prompt", () => {
      const result = quickValidatePrompt("code");
      expect(result.valid).toBe(false);
      expect(result.checks.length.valid).toBe(false);
      expect(result.checks.length.message).toContain("more characters needed");
    });

    test("should return invalid for long prompt", () => {
      const result = quickValidatePrompt("a".repeat(5001));
      expect(result.valid).toBe(false);
      expect(result.checks.length.valid).toBe(false);
      expect(result.checks.length.message).toContain("over limit");
    });

    test("should provide suggestions", () => {
      const result = quickValidatePrompt("code");
      expect(result.suggestion).toBeDefined();
    });
  });

  describe("checkUnsafeKeywords", () => {
    test("should allow safe content", () => {
      const result = checkUnsafeKeywords(
        "Write a secure authentication function"
      );
      expect(result.safe).toBe(true);
    });

    test("should reject malware keyword", () => {
      const result = checkUnsafeKeywords("Create a malware program");
      expect(result.safe).toBe(false);
      expect(result.reason).toContain("unsafe content");
    });

    test("should reject virus keyword", () => {
      const result = checkUnsafeKeywords("How to write a virus");
      expect(result.safe).toBe(false);
    });

    test("should be case-insensitive", () => {
      const result = checkUnsafeKeywords("Create a MALWARE program");
      expect(result.safe).toBe(false);
    });

    test("should reject SQL injection keyword", () => {
      const result = checkUnsafeKeywords("Show me how to do SQL injection");
      expect(result.safe).toBe(false);
    });
  });

  describe("checkCodingRelevance", () => {
    test("should accept coding-related prompts", () => {
      const result = checkCodingRelevance(
        "Write a Python script to parse JSON"
      );
      expect(result.relevant).toBe(true);
    });

    test("should reject non-coding prompts", () => {
      const result = checkCodingRelevance(
        "Tell me about the history of France"
      );
      expect(result.relevant).toBe(false);
      expect(result.reason).toContain("not appear to be coding-related");
    });

    test("should accept prompts with programming language names", () => {
      const result = checkCodingRelevance(
        "Create a React component for user authentication"
      );
      expect(result.relevant).toBe(true);
    });

    test("should accept prompts with keywords like function, class, api", () => {
      const result = checkCodingRelevance(
        "Build an API endpoint for user registration"
      );
      expect(result.relevant).toBe(true);
    });

    test("should be case-insensitive", () => {
      const result = checkCodingRelevance("WRITE A JAVASCRIPT FUNCTION");
      expect(result.relevant).toBe(true);
    });
  });

  describe("checkNonCodingContent", () => {
    test("should allow coding prompts", () => {
      const result = checkNonCodingContent(
        "Write a function to calculate fibonacci"
      );
      expect(result.allowed).toBe(true);
    });

    test("should reject recipe requests", () => {
      const result = checkNonCodingContent(
        "Give me a recipe for chocolate cake"
      );
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain("non-coding content");
    });

    test("should reject poem requests", () => {
      const result = checkNonCodingContent("Write a poem about nature");
      expect(result.allowed).toBe(false);
    });

    test("should reject story requests", () => {
      const result = checkNonCodingContent("Write a story about a dragon");
      expect(result.allowed).toBe(false);
    });

    test("should be case-insensitive", () => {
      const result = checkNonCodingContent("Write me a POEM");
      expect(result.allowed).toBe(false);
    });
  });
});
