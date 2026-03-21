# Xynova.ai

**Xynova.ai** is a state-of-the-art personalized learning platform that engineers custom roadmaps for any subject. Powered by advanced AI reasoning, it provides structured modules, interactive tutoring, and progress tracking to help students master complex topics efficiently.

## ✨ Features

- 🎯 **AI Roadmap Generation**: Personalized learning paths based on your subject or documents.
- 💬 **AI Tutor**: Context-aware chat assistant for deep explanations and Q&A.
- 📊 **Progress Analytics**: Track your mastery across lessons and quizzes.
- 🔐 **Secure Authentication**: JWT-based secure login and registration.
- ⚡ **Real-time Processing**: Fast task handling via Celery and Redis.

## 🛠️ Technology Stack

### Frontend
- **React 18** + **Vite**
- **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **Framer Motion** (Animations)
- **Lucide React** (Icons)

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** (PostgreSQL)
- **Celery** + **Redis** (Background Tasks)
- **OpenRouter/OpenAI API** (LLM Integration)
- **Pydantic** (Validation)

## 🚀 Quick Start

### 1. Prerequisites
- Node.js & npm
- Python 3.11+
- Docker & Docker Compose (for PostgreSQL/Redis)

### 2. Infrastructure Setup
```bash
cd backend
docker-compose up -d
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8999 --reload
```

### 4. Celery Worker Setup
```bash
cd backend
.\venv\Scripts\celery -A app.workers.celery_worker worker --loglevel=info -P solo -Q zynova_queue
```

### 5. Frontend Setup
```bash
npm install
npm run dev -- --port 8081
```

## 📝 License

Distributed under the MIT License.

---
Built with ❤️ by the Xynova AI Team.
