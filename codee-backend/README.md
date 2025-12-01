# CODEE Backend

Node.js/Express backend for AI Coding Assistant powered by Qwen 2.5 3B Coder model.

## Features

- ✅ Multi-layer safety guardrails
- ✅ Code generation using Qwen model
- ✅ Automatic code improvement/criticism
- ✅ RESTful API endpoints
- ✅ Error handling and logging
- ✅ Environment configuration

## Prerequisites

- Node.js 16+ 
- npm or yarn
- Hugging Face API token (free from https://huggingface.co/settings/tokens)

## Installation

### 1. Clone and setup

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your Hugging Face token:

```
HUGGING_FACE_TOKEN=your_token_here
PORT=5000
NODE_ENV=development
```

### 3. Run server

**Development** (with auto-reload):
```bash
npm run dev
```

**Production**:
```bash
npm start
```

Server will start on `http://localhost:5000`

## API Endpoints

### POST /api/generate-code

Generate code with guardrails and improvements.

**Request:**
```json
{
  "prompt": "Write a Python function to reverse a string"
}
```

**Response:**
```json
{
  "generated_code": "def reverse_string(s):\n    return s[::-1]",
  "improved_code": "def reverse_string(s: str) -> str:\n    \"\"\"Reverse a string.\"\"\"\n    return s[::-1]",
  "improvements": "Added type hints and docstring..."
}
```

**Error Response (400):**
```json
{
  "error": "Your request appears to be for non-coding content."
}
```

### POST /api/validate

Validate a prompt without generating code.

**Request:**
```json
{
  "prompt": "Write a Python function"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "Prompt is valid and safe for code generation"
}
```

### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-10T12:30:45.123Z"
}
```

## Project Structure

```
src/
├── server.js              # Entry point
├── config/
│   ├── env.js            # Environment config
│   └── huggingface.js    # HF API config
├── middleware/
│   ├── logger.js         # Request logging
│   ├── errorHandler.js   # Error handling
│   └── validation.js     # Request validation
├── routes/
│   └── codeRoutes.js     # API routes
├── controllers/
│   └── codeController.js # Request handlers
├── services/
│   ├── guardrails.js     # Safety checks
│   ├── modelService.js   # HF API calls
│   ├── generationService.js  # Code generation
│   └── criticService.js  # Code improvement
└── utils/
    ├── constants.js      # Keywords, config
    ├── prompts.js        # Prompt templates
    └── helpers.js        # Utility functions
```

## Guardrails

The system implements multi-layer safety:

1. **Unsafe Keywords**: Rejects malware, exploits, hacking requests
2. **Coding Relevance**: Requires coding-related keywords
3. **Non-Coding Filters**: Rejects recipes, poems, stories, etc.
4. **Length Validation**: Enforces min/max prompt length

See `/src/utils/constants.js` for keyword lists.

## Troubleshooting

### Model Loading Timeout

First request takes 30-60s as model loads. Increase timeout in `.env` if needed.

### Rate Limit Errors

HF free tier has usage limits. Upgrade to HF Pro for production.

### Invalid Token

Verify HUGGING_FACE_TOKEN is set correctly:
```bash
echo $HUGGING_FACE_TOKEN
```

### CORS Errors

Ensure frontend origin is allowed (default allows all).

## Configuration

Edit `src/config/huggingface.js` to adjust:

- `max_new_tokens`: Max length of generated code (default: 500)
- `temperature`: Creativity level (default: 0.7)
- `top_p`: Nucleus sampling (default: 0.9)

## Testing

```bash
# Manual test with curl
curl -X POST http://localhost:5000/api/generate-code \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a Python function to calculate factorial"}'
```

## Deployment

### Docker

```bash
docker build -f docker/Dockerfile.backend -t coding-assistant-backend .
docker run -p 5000:5000 -e HUGGING_FACE_TOKEN=your_token coding-assistant-backend
```

### Railway / Render

1. Push to GitHub
2. Connect repo in Railway/Render
3. Set environment variables
4. Deploy

## License

MIT