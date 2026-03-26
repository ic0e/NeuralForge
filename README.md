# NeuralForge

A visual neural network training platform built with React + PyTorch. Design, train, and test CNN models through an intuitive web interface.

## Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **CUDA** (optional, for GPU acceleration)
- **Firebase API key** (optional, for saving user data)

### 1. Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app runs on `http://localhost:5173`

NeuralForge is currently in an early development stage. To bypass temporary CORS limitations, please use a browser with security features disabled (for example; Chrome with the `--disable-web-security` flag).

---

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | Flask |
| TypeScript | PyTorch |
| Vite | CUDA |
| TailwindCSS | Matplotlib/Plotly |
| MUI Components | NumPy/Pandas |
---
