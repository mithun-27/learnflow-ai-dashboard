# Zynova AI Backend

A production-level FastAPI backend for an AI-powered learning platform.

## Features
- AI Roadmap Generation (GPT-4o)
- Lesson Content Generation (Markdown)
- AI-Powered Quizzes (MCQs)
- AI Tutor Chat with Context
- Progress Tracking & Analytics
- Background processing with Celery & Redis
- Pydantic V2 validation
- Async SQLAlchemy with PostgreSQL

## Setup

1. **Prerequisites**
   - Python 3.9+
   - PostgreSQL
   - Redis
   - OpenAI API Key

2. **Installation**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   pip install -r requirements.txt
   ```

3. **Configuration**
   - Copy `.env` and fill in your details:
     - `DATABASE_URL`: `postgresql+asyncpg://user:pass@localhost:5432/zynova_ai`
     - `OPENAI_API_KEY`: Your OpenAI Key
     - `REDIS_URL`, `CELERY_BROKER_URL`, etc.

4. **Run the App**
   ```bash
   # Terminal 1: FastAPI
   uvicorn app.main:app --reload

   # Terminal 2: Celery Worker
   celery -A app.workers.celery_worker worker --loglevel=info -Q zynova_queue
   ```

5. **API Documentation**
   - Open `http://localhost:8000/docs` or `http://localhost:8000/api/v1/docs` (if prefix is included).
