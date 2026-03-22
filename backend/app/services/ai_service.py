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
    def normalize_markdown(content: str) -> str:
        """
        Python implementation of the 'Super Repair' logic.
        Ensures tables are balanced, headers are clean, and spacing is correct.
        """
        if not content:
            return ""
        
        import re
        lines = content.split('\n')
        repaired_lines = []
        in_table = False
        header_pipe_count = 0

        for line in lines:
            trimmed = line.strip()
            # Detect table line: at least 2 pipes
            is_table_line = len(re.findall(r'\|', trimmed)) >= 2

            if is_table_line:
                # 1. Clean cell content of disruptive markdown markers
                # Strip list markers: "1. Header" -> "Header"
                # Strip markdown headers: "## Header" -> "Header"
                # Strip bold/italic markers from headers if they are redundant
                processed = re.sub(r'^\d+\.\s+', '', trimmed)
                processed = re.sub(r'^#+\s*', '', processed)
                processed = processed.replace('**', '')

                if not processed.startswith('|'):
                    processed = f"| {processed}"
                if not processed.endswith('|'):
                    processed = f"{processed} |"

                current_pipes = len(re.findall(r'\|', processed))

                if not in_table:
                    in_table = True
                    header_pipe_count = current_pipes
                    repaired_lines.append("\n" + processed)
                    continue

                # 2. Fix separator line balancing: "|---|---|" -> match header pipes
                if '---' in processed:
                    repaired_lines.append("|" + "---| " * (header_pipe_count - 1))
                    continue

                # 3. Balance data rows to match header
                diff = header_pipe_count - current_pipes
                if diff > 0:
                    processed = processed[:len(processed)-1] + " | " * diff + "|"
                
                repaired_lines.append(processed)
            else:
                if in_table:
                    in_table = False
                    repaired_lines.append("\n" + line)
                else:
                    repaired_lines.append(line)

        final_content = "\n".join(repaired_lines)
        # Final cleanup: double pipes | | and excess newlines
        final_content = final_content.replace('||', '|')
        final_content = re.sub(r'\n{3,}', '\n\n', final_content)
        
        return final_content

    @staticmethod
    async def generate_lesson_content(topic: str, lesson_title: str) -> str:
        prompt = f"""
        Write a detailed educational lesson about '{lesson_title}' in the context of '{topic}'.
        
        STRICT FORMATTING RULES:
        1. Use Markdown for headings, lists, and tables.
        2. TABLES: 
           - Every table must have a header row and a separator row (|---|---|).
           - Do NOT use list markers (e.g., "1. ") or markdown headers (e.g., "#") INSIDE table headers.
           - Ensure every row has the SAME number of columns/pipes.
        3. HEADINGS: Use # for main titles and ## or ### for sub-sections.
        4. SPACING: Ensure a blank line before and after tables and code blocks.
        """
        payload = {
            "model": settings.AI_MODEL,
            "messages": [{"role": "user", "content": prompt}]
        }
        data = await AIService._post_request(payload)
        raw_content = data['choices'][0]['message']['content']
        
        # Apply normalization before returning
        return AIService.normalize_markdown(raw_content)

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
