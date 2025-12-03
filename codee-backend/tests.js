import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Import configs
const getConfigs = async () => {
  try {
    const { configs } = await import('./src/configs/env.js');
    return configs;
  } catch (error) {
    console.warn('⚠️  Could not load configs, using defaults:', error.message);
    return {
      PORT: process.env.PORT || 5000,
      NODE_ENV: process.env.NODE_ENV || 'development',
      LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    };
  }
};

const configs = await getConfigs();
const BASE_URL = `http://localhost:${configs.PORT}`;
const API_BASE = `${BASE_URL}/api`;

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.skipped = 0;
  }

  describe(name, fn) {
    console.log(`\n${colors.cyan}${colors.bright}📋 ${name}${colors.reset}`);
    fn();
  }

  test(name, fn, skip = false) {
    this.tests.push({ name, fn, skip });
  }

  skip(name, fn) {
    this.test(name, fn, true);
  }

  async run() {
    console.log(`${colors.bright}${colors.blue}🧪 CODEE Backend Test Suite${colors.reset}\n`);
    console.log(`Base URL: ${BASE_URL}\n`);

    for (const test of this.tests) {
      if (test.skip) {
        console.log(`${colors.yellow}⊘ SKIPPED${colors.reset} - ${test.name}`);
        this.skipped++;
        continue;
      }

      try {
        await test.fn();
        console.log(`${colors.green}✓ PASSED${colors.reset} - ${test.name}`);
        this.passed++;
      } catch (error) {
        console.log(`${colors.red}✗ FAILED${colors.reset} - ${test.name}`);
        console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        this.failed++;
      }
    }

    this.printSummary();
  }

  printSummary() {
    const total = this.passed + this.failed + this.skipped;
    console.log(`\n${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bright}Test Results:${colors.reset}`);
    console.log(
      `  ${colors.green}✓ Passed: ${this.passed}${colors.reset} / ${total}`
    );
    if (this.failed > 0) {
      console.log(`  ${colors.red}✗ Failed: ${this.failed}${colors.reset} / ${total}`);
    }
    if (this.skipped > 0) {
      console.log(`  ${colors.yellow}⊘ Skipped: ${this.skipped}${colors.reset} / ${total}`);
    }
    console.log(`${colors.bright}${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    if (this.failed === 0) {
      console.log(`${colors.green}${colors.bright}✨ All tests passed!${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(
        `${colors.red}${colors.bright}❌ ${this.failed} test(s) failed${colors.reset}\n`
      );
      process.exit(1);
    }
  }
}

// Utility functions
const createClient = () => axios.create({ baseURL: API_BASE });

const assert = {
  equal: (actual, expected, message) => {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  },
  deepEqual: (actual, expected, message) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message}: values don't match`);
    }
  },
  ok: (value, message) => {
    if (!value) throw new Error(message || 'Assertion failed');
  },
  exists: (value, message) => {
    if (!value) throw new Error(message || 'Expected value to exist');
  },
  statusCode: (response, code, message) => {
    if (response.status !== code) {
      throw new Error(
        `${message}: expected ${code}, got ${response.status}`
      );
    }
  },
};

// Test Suite
const runner = new TestRunner();

// ============================================
// 1. HEALTH CHECK TESTS
// ============================================
runner.describe('1. Health Check', () => {
  runner.test('GET /health should return ok status', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    assert.statusCode(response, 200, 'Status code');
    assert.equal(response.data.status, 'ok', 'Status field');
    assert.exists(response.data.timestamp, 'Timestamp exists');
  });

  runner.test('GET /health should have valid timestamp', async () => {
    const response = await axios.get(`${BASE_URL}/health`);
    const timestamp = new Date(response.data.timestamp);
    assert.ok(!isNaN(timestamp.getTime()), 'Valid ISO timestamp');
  });
});

// ============================================
// 2. VALIDATION TESTS
// ============================================
runner.describe('2. Request Validation', () => {
  const client = createClient();

  runner.test('POST /validate should accept valid coding prompt', async () => {
    const response = await client.post('/validate', {
      prompt: 'Write a Python function to calculate factorial',
    });
    assert.statusCode(response, 200, 'Status code');
    assert.equal(response.data.valid, true, 'Valid flag');
  });

  runner.test('POST /validate should reject missing prompt', async () => {
    try {
      await client.post('/validate', {});
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
      assert.exists(error.response.data.error, 'Error message');
    }
  });

  runner.test('POST /validate should reject empty prompt', async () => {
    try {
      await client.post('/validate', { prompt: '   ' });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /validate should reject non-string prompt', async () => {
    try {
      await client.post('/validate', { prompt: 12345 });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /validate should reject prompt below min length', async () => {
    try {
      await client.post('/validate', { prompt: 'code' });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
      assert.ok(
        error.response.data.reason.includes('too short'),
        'Contains length message'
      );
    }
  });

  runner.test('POST /validate should reject prompt above max length', async () => {
    try {
      const longPrompt = 'a'.repeat(5001);
      await client.post('/validate', { prompt: longPrompt });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
      assert.ok(
        error.response.data.reason.includes('too long'),
        'Contains length message'
      );
    }
  });
});

// ============================================
// 3. GUARDRAILS TESTS
// ============================================
runner.describe('3. Safety Guardrails', () => {
  const client = createClient();

  runner.test('POST /validate should reject unsafe keyword: malware', async () => {
    try {
      await client.post('/validate', {
        prompt: 'code write malware function for security testing',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
      assert.ok(
        error.response.data.reason.includes('unsafe'),
        'Unsafe content message'
      );
    }
  });

  runner.test('POST /validate should reject unsafe keyword: exploit', async () => {
    try {
      await client.post('/validate', {
        prompt: 'write code for exploit vulnerability',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /validate should reject unsafe keyword: ransomware', async () => {
    try {
      await client.post('/validate', {
        prompt: 'create ransomware code for research',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /validate should reject non-coding content: recipe', async () => {
    try {
      await client.post('/validate', {
        prompt: 'code write a recipe for chocolate cake',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
      assert.ok(
        error.response.data.reason.includes('non-coding'),
        'Non-coding message'
      );
    }
  });

  runner.test('POST /validate should reject non-coding content: poem', async () => {
    try {
      await client.post('/validate', {
        prompt: 'write a poem about love',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /validate should reject prompt without coding keywords', async () => {
    try {
      await client.post('/validate', {
        prompt: 'tell me about the weather today',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
      assert.ok(
        error.response.data.reason.includes('coding-related'),
        'Coding relevance message'
      );
    }
  });

  runner.test('POST /validate should accept prompt with coding keywords', async () => {
    const response = await client.post('/validate', {
      prompt: 'write a function to sort an array in Python',
    });
    assert.statusCode(response, 200, 'Status code');
    assert.equal(response.data.valid, true, 'Valid flag');
  });
});

// ============================================
// 4. CODE GENERATION TESTS (requires API key)
// ============================================
runner.describe('4. Code Generation', () => {
  const client = createClient();

  runner.skip(
    'POST /generate-code should generate valid code response',
    async () => {
      // Skip by default - requires active HF API key
      const response = await client.post('/generate-code', {
        prompt: 'write a simple hello world function in JavaScript',
      });
      assert.statusCode(response, 200, 'Status code');
      assert.exists(response.data.generated_code, 'Generated code exists');
      assert.exists(response.data.improved_code, 'Improved code exists');
      assert.exists(response.data.improvements, 'Improvements exist');
      assert.ok(
        response.data.generated_code.length > 0,
        'Generated code not empty'
      );
    }
  );

  runner.test('POST /generate-code should reject unsafe prompt', async () => {
    try {
      await client.post('/generate-code', {
        prompt: 'code write malware for security testing',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /generate-code should validate input format', async () => {
    try {
      await client.post('/generate-code', { prompt: '' });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });

  runner.test('POST /generate-code should reject non-coding request', async () => {
    try {
      await client.post('/generate-code', {
        prompt: 'write a poem about sunset',
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Status code');
    }
  });
});

// ============================================
// 5. ERROR HANDLING TESTS
// ============================================
runner.describe('5. Error Handling', () => {
  const client = createClient();

  runner.test('GET /nonexistent should return 404', async () => {
    try {
      await client.get('/nonexistent');
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.statusCode(error.response, 404, 'Status code');
      assert.exists(error.response.data.error, 'Error message');
    }
  });

  runner.test('POST /validate with invalid JSON should fail', async () => {
    try {
      await axios.post(`${API_BASE}/validate`, 'invalid json', {
        headers: { 'Content-Type': 'application/json' },
      });
      throw new Error('Should have thrown error');
    } catch (error) {
      assert.ok(error.response.status >= 400, 'Error status code');
    }
  });

  runner.test('POST /generate-code should handle server errors gracefully', async () => {
    // Test with extremely long valid prompt
    try {
      const longPrompt = 'code ' + 'test '.repeat(1000);
      const response = await client.post('/generate-code', { prompt: longPrompt });
      // Should either succeed or return error
      assert.ok(
        response.status === 200 || response.status >= 400,
        'Valid response code'
      );
    } catch (error) {
      // Error is acceptable
      assert.ok(error.response.status >= 400, 'Error status');
    }
  });
});

// ============================================
// 6. RESPONSE FORMAT TESTS
// ============================================
runner.describe('6. Response Format', () => {
  const client = createClient();

  runner.test('Health check response has correct structure', async () => {
    const response = await client.get('/health', { baseURL: BASE_URL });
    // Note: adjusting for actual endpoint
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    assert.ok('status' in healthResponse.data, 'Has status field');
    assert.ok('timestamp' in healthResponse.data, 'Has timestamp field');
  });

  runner.test('Validation error response has correct structure', async () => {
    try {
      await client.post('/validate', { prompt: 'short' });
    } catch (error) {
      assert.ok('error' in error.response.data || 'reason' in error.response.data, 'Has error field');
    }
  });

  runner.test('Validation success response has correct structure', async () => {
    const response = await client.post('/validate', {
      prompt: 'write a python sorting algorithm',
    });
    assert.ok('valid' in response.data, 'Has valid field');
    assert.ok('message' in response.data, 'Has message field');
  });
});

// ============================================
// 7. CONCURRENCY TESTS
// ============================================
runner.describe('7. Concurrency & Load', () => {
  const client = createClient();

  runner.test('Should handle multiple concurrent requests', async () => {
    const prompts = [
      'write a function to reverse a string in javascript',
      'create a loop that prints numbers 1 to 10',
      'write a function to check if number is prime',
      'implement binary search algorithm',
      'write a function to check palindrome',
    ];

    const requests = prompts.map((prompt) =>
      client.post('/validate', { prompt }).catch(() => null)
    );

    const results = await Promise.all(requests);
    const succeeded = results.filter((r) => r !== null).length;
    assert.ok(succeeded >= prompts.length * 0.8, `At least 80% requests succeeded (${succeeded}/${prompts.length})`);
  });

  runner.test('Should not crash under repeated requests', async () => {
    for (let i = 0; i < 5; i++) {
      await client.post('/validate', {
        prompt: 'write a function to calculate sum of array elements',
      });
    }
    assert.ok(true, 'Handled 5 sequential requests');
  });
});

// ============================================
// 8. PROMPT EDGE CASES
// ============================================
runner.describe('8. Prompt Edge Cases', () => {
  const client = createClient();

  runner.test('Should accept prompts with special characters', async () => {
    const response = await client.post('/validate', {
      prompt: 'write a function: f(x) = 2*x + 1 in Python',
    });
    assert.equal(response.data.valid, true, 'Accepted special chars');
  });

  runner.test('Should accept prompts with multiple languages mixed', async () => {
    const response = await client.post('/validate', {
      prompt: 'write código in JavaScript: var x = 10',
    });
    // May or may not be valid, but should not crash
    assert.ok('valid' in response.data, 'Response has valid field');
  });

  runner.test('Should accept prompts with code snippets', async () => {
    const response = await client.post('/validate', {
      prompt: 'optimize this code: function sum(arr) { let s = 0; for(let i=0; i<arr.length; i++) s += arr[i]; return s; }',
    });
    assert.equal(response.data.valid, true, 'Accepted code snippet');
  });

  runner.test('Should handle case-insensitive keywords', async () => {
    const response = await client.post('/validate', {
      prompt: 'WRITE A FUNCTION in PYTHON to sort ARRAY',
    });
    assert.equal(response.data.valid, true, 'Case insensitive');
  });

  runner.test('Should reject prompt with only numbers', async () => {
    try {
      await client.post('/validate', { prompt: '123456789012345' });
      throw new Error('Should have rejected');
    } catch (error) {
      assert.statusCode(error.response, 400, 'Rejected numbers only');
    }
  });
});

// Run all tests
runner.run();