# NeuralForge
> A visual neural network training platform built with React + PyTorch. Design, train, and test CNN models through an intuitive web interface.

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776ab?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-v2.0+-ee4c2c?style=flat-square&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Flask](https://img.shields.io/badge/Flask-WSGI-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![NumPy](https://img.shields.io/badge/NumPy-Array-013243?style=flat-square&logo=numpy&logoColor=white)](https://numpy.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

## Key Features & Showcase

### 1. Visual Architecture Builder
*Switch between dedicated dashboard panels instantly to configure datasets, map out layered convolutional neural networks (CNNs), and customize tracking layouts.*

<p align="center">
  <img width="800" height="381" alt="Visual Architecture Builder Demo" src="https://github.com/user-attachments/assets/4224c32c-8ccc-447a-9783-6466c3d1624f" />
</p>

<br>

---

### 2. Live Training Loops
*Monitor performance live as backpropagation updates network weights.*

<p align="center">
  <img width="800" height="379" alt="Live Training Loops Demo" src="https://github.com/user-attachments/assets/b88ea82b-e258-4b84-b8bf-bb5c9ec2eee9" />
</p>

<br>

---

### 3. Real-Time Inference Testing
*Evaluate trained model weights instantly via custom input testing, allowing for immediate sample checking or custom asset validation.*

<p align="center">
  <img width="800" height="378" alt="Real-Time Inference Hand Test Demo" src="https://github.com/user-attachments/assets/b695c1d4-33e0-4751-96cb-70b681240cf5" />
</p>

<br>

---

## Additional Core Features

### Local-First Features (Zero Setup Required)
Out of the box, NeuralForge runs entirely on your local machine with complete lifecycle management:
- **Local Training History:** Session metrics, loss logs, and accuracy data are cached locally so you can review past runs without manual tracking.
- **Default Architecture Presets:** Built-in templates for classic convolutional neural network (CNN) benchmarks to start training with a single click.

### Firebase-Extended Features (Optional Setup)
If the optional frontend environment variables are configured, the platform unlocks cloud-sync capabilities:
- **Cloud Configuration Saving:** Save custom network architectures, hyperparameter layouts, and dataset mappings to your cloud account to access them anywhere.
- **Admin-Managed Presets:** Deploy and update custom default templates dynamically from a central administrative panel.

> **Note on Project Architecture:** NeuralForge was developed as a high school graduation thesis project, which required implementing a user management pipeline, remote cloud synchronization, and authentication. While the application is designed to function as a self-contained local tool, these cloud-extended features remain available for multi-device synchronization.

## Quick Start

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.10+)
- **CUDA** (optional, for GPU acceleration)
- **Firebase API key** (optional, for saving user data)

### Environment setup
If you wish to use the cloud storage features, create a `.env` file inside the `frontend/` directory and populate it with your Firebase project credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

Note: You can find these values in your Firebase Console under Project Settings > General > Your apps by adding a Web App to your project.

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
