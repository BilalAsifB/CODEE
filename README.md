# CODEE — AI Coding Assistant

CODEE is a full-stack **AI coding assistant** built with:

* **Qwen 2.5 (0.5B & 3B) fine-tuned models**
* **Node.js/Express backend** with safety guardrails
* **React frontend** with a modern, responsive UI

It provides safe, high-quality code generation, real-time feedback, automatic refinement via a critic model, and a clean developer experience.

---

## 🌟 Features

### 🔧 Backend (Node.js + Qwen)

* Multi-layer **prompt validation guardrails**
* Code generation with **Qwen 2.5 Coder**
* “Critic” system for improved, cleaner code
* Structured REST API (`/generate-code`, `/validate`)
* Logging, error handling, environment configuration

### 💻 Frontend (React)

* Dark-themed UI
* Real-time status steps:
  **Validation → Generation → Criticism**
* Side-by-side generated and improved code
* One-click copy blocks
* Mobile-responsive layout

### 📚 Research Notebooks

* SFT for **Qwen 2.5 0.5B**
* SFT for **Qwen 2.5 3B**
* Tools for dataset preparation, evaluation, and experimentation

---

## 📁 Monorepo Structure

```
CODEE/
├── backend/             # Express API server
│   ├── src/
│   ├── .env.example
│   └── package.json
│
├── frontend/            # React web UI
│   ├── src/
│   ├── .env.example
│   └── package.json
│
└── notebooks/           # SFT, evaluation, dataset prep
    ├── CODEE_qwen_2_5_0_5_SFT.ipynb
    ├── CODEE_qwen_2_5_3_SFT.ipynb
    └── README.md
```

---

# ⚙️ Installation & Setup

You can run both services locally for development.

---

## 1️⃣ Backend Setup (Node + Express)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
HUGGING_FACE_TOKEN=your_token_here
PORT=5000
NODE_ENV=development
```

Run server:

```bash
npm run dev   # dev mode (nodemon)
# or
npm start     # production
```

Backend runs at:

```
http://localhost:5000
```

---

## 2️⃣ Frontend Setup (React)

```bash
cd frontend
npm install
cp .env.example .env
```

Set backend API URL:

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
REACT_APP_DEBUG=false
```

Run client:

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

# 👨‍🔬 Notebooks (Model R&D)

Located in `/notebooks`.

### Included:

### **✔ `CODEE_qwen_2_5_0_5_SFT.ipynb`**

Lightweight 0.5B model fine-tuning notebook
→ Perfect for prototyping, fast iterations

### **✔ `CODEE_qwen_2_5_3_SFT.ipynb`**

Large 3B model fine-tuning notebook
→ Same structure as 0.5B SFT, but with more parameters and better reasoning

### These notebooks include:

* Dataset preparation
* Prompt/response formatting
* Supervised fine-tuning training loops
* Loss/evaluation plots
* Inference and model export tools

Run notebooks with:

```bash
jupyter lab
# or
jupyter notebook
```

---

# 🌐 API Endpoints

| Endpoint             | Method | Description                          |
| -------------------- | ------ | ------------------------------------ |
| `/api/generate-code` | POST   | Validate → Generate → Critic improve |
| `/api/validate`      | POST   | Run guardrails without generating    |
| `/health`            | GET    | Backend status                       |

Example request:

```json
{ "prompt": "Write a Python function to reverse a string" }
```

---

# 🚢 Deployment

### Static Frontend (Netlify, Vercel, GitHub Pages, S3)

```bash
npm run build
```

### Backend (Render, Railway, Docker)

Example Docker run:

```bash
docker build -f docker/Dockerfile.backend -t coding-assistant-backend .
docker run -p 5000:5000 -e HUGGING_FACE_TOKEN=your_token coding-assistant-backend
```

---

# 🐞 Troubleshooting

### ❌ Frontend can’t reach backend

* Backend not running
* Wrong `REACT_APP_API_BASE_URL`
* CORS issues

### ⏱ Slow first request

HF models cold-start; repeated calls are faster.

### ⚠️ Guardrail rejections

Triggered for non-coding and unsafe prompts.

---

# 📄 License

MIT 