# CODEE Frontend

A **React-based user interface** for the AI Coding Assistant, offering a modern, responsive environment for generating and refining code using the **Qwen 2.5 3B Coder** model.

---

## 🚀 Features

* **💻 Modern UI** — Clean, dark-themed interface built with React and custom CSS.
* **⚡ Real-time Feedback** — Visual status indicators for validation, generation, and criticism stages.
* **🛡️ Guardrail Alerts** — User-friendly error messages for unsafe or irrelevant prompts.
* **📝 Code Display** — Formatted code blocks with one-click copy functionality.
* **📱 Responsive Design** — Optimized layout for both desktop and mobile.
* **🔄 Code Improvement** — View raw model output and critic-improved code side-by-side.

---

## 📦 Prerequisites

* **Node.js 16+**
* **npm or yarn**
* A running instance of the **Coding Assistant Backend**

---

## 🛠️ Installation

### 1. Navigate to project directory

```bash
cd codee-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy example env:

```bash
cp .env.example .env
```

Edit `.env` and set your backend URL:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_DEBUG=false
```

### 4. Run the application

**Development** ([http://localhost:3000](http://localhost:3000)):

```bash
npm start
```

**Production build**:

```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CodingAssistant.jsx   # Main controller component
│   ├── InputForm.jsx          # Prompt input area
│   ├── CodeDisplay.jsx        # Renders generated & improved code
│   ├── StatusIndicator.jsx    # Validation -> Generation -> Critic stages
│   └── ErrorMessage.jsx       # Guardrail rejection UI
├── services/
│   └── api.js                 # Backend HTTP requests
├── hooks/
│   ├── useCodeGeneration.js   # State machine for AI generation flow
│   └── useAsync.js            # Generic async handler
├── styles/                    # Component-specific CSS
├── utils/
│   ├── formatters.js          # Text & code formatting helpers
│   └── validators.js          # Client-side prompt validators
└── config/
    └── api.js                 # API endpoint settings
```

---

## 🌐 API Integration

The frontend communicates with backend endpoints defined in `src/config/api.js`:

| Action          | Endpoint             | Method |
| --------------- | -------------------- | ------ |
| Generate code   | `/api/generate-code` | POST   |
| Validate prompt | `/api/validate`      | POST   |
| Health check    | `/api/health`        | GET    |

---

## 🔑 Key Components

### **CodingAssistant**

Handles:

* Prompt submission
* Calling validation + generation + critic endpoints
* Managing multi-step loading states
* Showing results or guardrail errors

### **StatusIndicator**

Animated progress through:

1. **Validating**
2. **Generating**
3. **Improving**

---

## 🐞 Troubleshooting

### **❌ "Failed to connect to server"**

* Ensure backend is running
* Confirm `REACT_APP_API_BASE_URL` is correct
* Check browser console for **CORS** issues

### **🎨 Styling problems**

* Components use CSS modules in `src/styles/`
* Global styles: `src/index.css`, `src/App.css`

---

## 🚢 Deployment

### **Static Hosting (Netlify, Vercel, GitHub Pages, S3, etc.)**

```bash
npm run build
# Deploy the /build folder
```

### **Docker + Nginx**

Build production assets, then serve via Nginx or any static server.

---

## 📄 License

MIT