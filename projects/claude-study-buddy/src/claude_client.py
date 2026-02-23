"""Anthropic Claude API client wrapper."""

import json
import anthropic


class ClaudeClient:
    """Wrapper around the Anthropic SDK for study-related prompts."""

    MODEL = "claude-sonnet-4-5-20250929"

    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)

    def generate_questions(self, topic: str, count: int = 5) -> list[dict]:
        """Generate multiple-choice questions on a topic."""
        prompt = f"""Generate {count} multiple-choice questions about: {topic}

Return ONLY a JSON array where each element has:
- "question": the question text
- "options": an object with keys "a", "b", "c", "d" and their answer text
- "correct": the correct option letter ("a", "b", "c", or "d")
- "explanation": a brief explanation of why the answer is correct

Example format:
[
  {{
    "question": "What is ...?",
    "options": {{"a": "...", "b": "...", "c": "...", "d": "..."}},
    "correct": "a",
    "explanation": "Because ..."
  }}
]"""

        message = self.client.messages.create(
            model=self.MODEL,
            max_tokens=4096,
            messages=[{"role": "user", "content": prompt}],
        )

        text = message.content[0].text
        # Extract JSON from response
        start = text.find("[")
        end = text.rfind("]") + 1
        if start == -1 or end == 0:
            return []

        try:
            return json.loads(text[start:end])
        except json.JSONDecodeError:
            return []

    def explain_topic(self, question: str, correct_answer: str) -> str:
        """Get a detailed explanation for a question."""
        prompt = f"""Explain this concept clearly for a university student:

Question: {question}
Correct answer: {correct_answer}

Give a concise but thorough explanation (2-3 paragraphs)."""

        message = self.client.messages.create(
            model=self.MODEL,
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}],
        )

        return message.content[0].text
