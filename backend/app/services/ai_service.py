import json
import httpx
from app.core.config import settings
from app.schemas.topic import Roadmap
from app.schemas.quiz import QuizQuestionBase
from typing import List, Optional

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

class AIService:
    @staticmethod
    async def _post_request(payload: dict) -> dict:
        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(OPENROUTER_URL, headers=headers, json=payload)
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def generate_roadmap(topic: str) -> Roadmap:
        prompt = f"""
        Generate a structured learning roadmap for the topic: "{topic}".
        Return a JSON object only. Structure:
        {{
            "topic": "{topic}",
            "units": [
                {{
                    "title": "Unit Title",
                    "lessons": ["Lesson 1 Title", "Lesson 2 Title"]
                }}
            ]
        }}
        """
        payload = {
            "model": settings.AI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }
        data = await AIService._post_request(payload)
        content = data['choices'][0]['message']['content']
        return Roadmap.model_validate_json(content)

    @staticmethod
    async def generate_lesson_content(topic: str, lesson_title: str) -> str:
        prompt = f"Write a detailed educational lesson about '{lesson_title}' in the context of '{topic}'. Use Markdown."
        payload = {
            "model": settings.AI_MODEL,
            "messages": [{"role": "user", "content": prompt}]
        }
        data = await AIService._post_request(payload)
        return data['choices'][0]['message']['content']

    @staticmethod
    async def generate_quiz(lesson_title: str, lesson_content: str) -> List[QuizQuestionBase]:
        prompt = f"Generate 5 MCQs from this content: {lesson_content[:2000]}. Return JSON array 'questions'."
        payload = {
            "model": settings.AI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "response_format": {"type": "json_object"}
        }
        data = await AIService._post_request(payload)
        content = json.loads(data['choices'][0]['message']['content'])
        return [QuizQuestionBase(**q) for q in content["questions"]]

    @staticmethod
    async def get_chat_response(messages: List[dict]) -> dict:
        payload = {
            "model": settings.AI_MODEL,
            "messages": messages
        }
        data = await AIService._post_request(payload)
        message = data['choices'][0]['message']
        return {
            "content": message.get("content")
        }

ai_service = AIService()
