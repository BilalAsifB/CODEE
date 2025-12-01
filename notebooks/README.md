# CODEE Notebooks

This directory contains research, experimentation, and fine-tuning notebooks used to develop and refine the **CODEE AI Coding Assistant**.
These notebooks are separate from the production backend/frontend and serve as an **R&D environment** for:

* Model experimentation
* Prompt engineering
* Supervised fine-tuning (SFT)
* Evaluation and benchmarking
* Dataset preparation

---

## 📚 Contents

### **1. `CODEE_qwen_2_5_0_5_SFT.ipynb`**

Supervised fine-tuning workflow for the **Qwen 2.5 0.5B** model (small-scale model for fast prototyping and experimentation).

Includes:

* Dataset exploration & preprocessing
* CODEE instruction-response format
* SFT training loop (Transformers + Accelerate)
* Loss plots & evaluation samples
* Model saving/exporting
* Inference helpers for testing CODEE-style prompts

Use this notebook when:

* You want fast iteration on new prompts
* You are testing new guardrail ideas
* You want a lightweight baseline before scaling to larger models

---

### **2. `CODEE_qwen_2_5_3_SFT.ipynb`**

Supervised fine-tuning workflow for the **Qwen 2.5 3B** model.

This notebook is **identical in structure** to the 0.5B notebook, but uses the **larger 3B variant** for higher-quality instruction tuning.

Differences from the 0.5B notebook:

* Larger model (3B parameters)
* Higher VRAM/compute requirements
* Better code reasoning, richer explanations, fewer hallucinations
* Improved critic behavior and adherence to CODEE formatting
* Optional 4-bit quantization support for mid-range GPUs

Use this notebook when:

* You want maximum model quality
* You are preparing models intended for production use
* You want to compare SFT results across scales (0.5B vs 3B)

---

## 🛠 Requirements

Most notebooks require:

* Python **3.10+**
* PyTorch (CUDA recommended)
* Hugging Face Transformers
* Hugging Face Datasets
* Accelerate
* BitsAndBytes (optional for 4-bit)
* Jupyter Notebook or Jupyter Lab

Install everything with:

```bash
pip install -r requirements-notebooks.txt
```

(If you want, I can generate a complete `requirements-notebooks.txt` based on your environment.)

---

## 🚀 Running the Notebooks

In the project root or inside `/notebooks`:

```bash
jupyter lab
```

or

```bash
jupyter notebook
```

VS Code users can simply open the notebook and select a Python interpreter.

---

## 🔬 Purpose of These Notebooks

The notebooks serve as your **research lab**, with typical uses like:

* Prototype prompt structures before adding them to the backend
* Test new critic behaviors
* Prepare SFT datasets
* Measure SFT improvements
* Explore new guardrail enforcement strategies
* Benchmark smaller and larger models

They enable fast iteration without touching production code.

---

## 🧩 How They Integrate With CODEE

R&D Flow:

1. **Experiment** in the notebook
   (fine-tuning, prompt strategies, safety constraints, etc.)

2. **Validate** results via test prompts

3. **Integrate** successful improvements into:

   * `backend/src/utils/prompts.js`
   * `backend/src/services/guardrails.js`
   * Qwen API parameters/config
   * The critic refinement logic

4. **Deploy** improved backend

5. **Frontend** automatically displays improved model responses

This workflow keeps production stable while encouraging experimentation.

---

## 📁 Suggested Notebook Organization

```
notebooks/
├── training/
│   ├── CODEE_qwen_2_5_0_5_SFT.ipynb
│   ├── CODEE_qwen_2_5_3_SFT.ipynb
│   └── ...
├── evaluation/
│   ├── critic_eval.ipynb
│   ├── prompt_ablation.ipynb
│   └── ...
└── datasets/
    ├── prepare_dataset.ipynb
    └── ...
```

If you'd like, I can automatically generate this structure with placeholder READMEs for each subfolder.

---

## 📄 License

MIT