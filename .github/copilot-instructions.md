# CODEE - Copilot Instructions

CODEE is a full-stack AI coding assistant using fine-tuned Qwen 2.5 models (0.5B & 3B) with a Node.js/Express backend and React frontend.

## Monorepo Structure

```
CODEE/
├── codee-backend/      # Express API (port 5000)
├── codee-frontend/     # React UI (port 3000)
└── notebooks/          # Jupyter notebooks for model fine-tuning
```

## Build, Test, and Run Commands

### Backend (codee-backend/)

```bash
# Install dependencies
npm install

# Development (with hot reload)
npm run dev

# Production
npm start

# Manual testing
node tests.js  # Integration tests against running server
```

**Environment setup**: Copy `.env.example` to `.env` and configure:
- `HUGGING_FACE_TOKEN` (required)
- `MODEL_ID` or `INFERENCE_API` for HuggingFace
- `PORT` (default: 5000)
- `NODE_ENV` (development/production)

### Frontend (codee-frontend/)

```bash
# Install dependencies
npm install

# Development server
npm start

# Production build
npm run build

# Run tests
npm test  # All tests with watch mode
npm test -- --testPathPattern=App.test.js  # Single test file
```

**Environment setup**: Copy `.env.example` to `.env` and set:
- `REACT_APP_API_BASE_URL` (e.g., http://localhost:5000/api)
- `REACT_APP_DEBUG` (true/false)

### Notebooks

```bash
jupyter lab  # or jupyter notebook
```

## Architecture

### Backend Flow

The backend implements a three-stage AI code generation pipeline:

1. **Validation (Guardrails)** → 2. **Generation** → 3. **Criticism (Improvement)**

**Request flow:**
```
POST /api/generate-code
  ↓
middleware: validateRequestBody (checks JSON structure)
  ↓
controller: generateCodeHandler
  ↓
service: validatePrompt (guardrails check)
  ↓
service: generateCode (calls HuggingFace API)
  ↓
service: improveCode (critic model refinement)
  ↓
response: { generated_code, improved_code, improvements }
```

**Key layers:**
- **routes/**: Express route definitions
- **controllers/**: Request handlers (thin layer, delegates to services)
- **services/**: Business logic
  - `guardrails.js` - Multi-layer prompt validation
  - `generationService.js` - Code generation via HuggingFace
  - `criticService.js` - Code improvement/refinement
  - `modelService.js` - Low-level HuggingFace API calls
- **middlewares/**: Request validation, logging, error handling
- **configs/**: Environment configuration
- **utils/**: Constants, helpers, prompt templates

### Frontend Architecture

React app with component-based structure:

**Main component hierarchy:**
```
App.js
  └── CodingAssistant.jsx (main container)
        ├── InputForm.jsx (prompt input)
        ├── StatusIndicator.jsx (3-stage progress: Validation → Generation → Criticism)
        ├── CodeDisplay.jsx (generated code with copy button)
        ├── CodeDisplay.jsx (improved code with copy button)
        └── ErrorMessage.jsx (validation/API errors)
```

**Services:**
- `services/api.js` - Axios-based API client for backend communication

**State flow:** User input → Validate → Generate → Improve → Display results

## Key Conventions

### Naming Patterns

- **Backend files**: `name.category.js` (e.g., `codeRoutes.routers.js`, `codeContollers.contollers.js`)
- **Frontend files**: `ComponentName.jsx` for React components
- **Services**: Descriptive names ending in `Service.js` (backend) or `.js` (frontend)

### Code Style

**Backend (Prettier config):**
- Double quotes for strings
- 2-space indentation
- Semicolons required
- ES modules (`import`/`export`)

**Frontend:**
- ESLint extends `react-app` and `react-app/jest`
- Uses `lucide-react` for icons
- CSS modules in `styles/` directory

### Guardrails System

The backend implements multi-layer prompt validation in `services/guardrails.js`:

1. **Length validation**: 10-5000 characters
2. **Unsafe content filter**: Blocks malware, exploits, illegal content (see `UNSAFE_KEYWORDS` in `utils/constants.js`)
3. **Coding relevance check**: Rejects non-coding requests like recipes, poems, medical advice (see `NON_CODING_KEYWORDS`)

**Important**: When working on guardrails, maintain the three-layer validation approach. Keywords are centralized in `utils/constants.js`.

### Error Handling

- **Backend**: Centralized error handler in `middlewares/errorHandler.middlewares.js`
- **Controllers**: Try-catch blocks with descriptive error messages
- **Frontend**: Error states managed in component state and displayed via `ErrorMessage.jsx`

### API Integration

**HuggingFace API configuration** is in `configs/huggingface.js`. The system supports two modes:
- Public HuggingFace Inference API (`api-inference.huggingface.co`)
- Custom inference endpoints (via `INFERENCE_API` env var)

Model calls use `callHuggingFaceAPI()` from `services/modelService.js` with standardized parameters from the config.

### Environment Variables

Both frontend and backend require environment setup before running. Always check `.env.example` files for required variables. The backend will throw an error on startup if `HUGGING_FACE_TOKEN` is missing.

## Testing

- **Backend**: Manual integration tests in `tests.js` (run against live server)
- **Frontend**: React Testing Library tests in `src/` alongside components

No automated test suite is currently configured. Run manual tests after changes to core services.

## Model Fine-Tuning

The `notebooks/` directory contains supervised fine-tuning (SFT) workflows for Qwen 2.5:
- `CODEE_qwen_2_5_0_5_SFT.ipynb` - 0.5B model (lightweight, fast prototyping)
- `CODEE_qwen_2_5_3_SFT.ipynb` - 3B model (better reasoning, same structure)

Both notebooks include dataset preparation, training loops, evaluation, and model export utilities.

**Important**: Notebooks should not have widget metadata to avoid GitHub rendering errors.
