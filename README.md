# NeuralForge
[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-v2.0+-ee4c2c?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Flask](https://img.shields.io/badge/Flask-WSGI-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![NumPy](https://img.shields.io/badge/NumPy-Array-013243?style=flat-square&logo=numpy&logoColor=white)](https://numpy.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)


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
