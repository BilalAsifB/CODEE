import { describe, test, expect, jest } from "@jest/globals";
import { validateRequestBody } from "../../middlewares/validation.middlewares.js";

describe("Validation Middleware", () => {
  describe("validateRequestBody", () => {
    test("should call next() for valid request with prompt", () => {
      const req = {
        body: { prompt: "Write a function to reverse a string" },
      };
      const res = {};
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith();
    });

    test("should return 400 error for missing prompt", () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt is required",
        details: "Please provide a coding-related prompt",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 error for empty string prompt", () => {
      const req = { body: { prompt: "" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt is required",
        details: "Please provide a coding-related prompt",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 error for whitespace-only prompt", () => {
      const req = { body: { prompt: "   " } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt cannot be empty",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 error for non-string prompt", () => {
      const req = { body: { prompt: 12345 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt must be a string",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 error for array prompt", () => {
      const req = { body: { prompt: ["test"] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt must be a string",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 error for object prompt", () => {
      const req = { body: { prompt: { text: "test" } } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt must be a string",
      });
      expect(next).not.toHaveBeenCalled();
    });

    test("should return 400 error for null prompt", () => {
      const req = { body: { prompt: null } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      validateRequestBody(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Prompt is required",
        details: "Please provide a coding-related prompt",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
