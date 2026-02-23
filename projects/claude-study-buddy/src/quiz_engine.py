"""Quiz engine for running interactive study sessions."""

from src.claude_client import ClaudeClient
from src.utils import get_input


class QuizEngine:
    """Manages quiz flow: generating questions, scoring, and explanations."""

    def __init__(self, client: ClaudeClient):
        self.client = client
        self._missed: list[dict] = []

    def generate_questions(self, topic: str, count: int = 5) -> list[dict]:
        """Generate quiz questions using Claude."""
        return self.client.generate_questions(topic, count)

    def run_quiz(self, questions: list[dict]) -> int:
        """Run an interactive quiz and return the score."""
        score = 0
        self._missed = []

        for i, q in enumerate(questions, 1):
            print(f"Q{i}: {q['question']}")
            for letter in ("a", "b", "c", "d"):
                print(f"  {letter}) {q['options'][letter]}")

            answer = get_input("Your answer (a/b/c/d): ").lower().strip()
            if answer == q["correct"]:
                print(f"✓ Correct! {q.get('explanation', '')}\n")
                score += 1
            else:
                correct = q["correct"]
                print(f"✗ Wrong. The answer is {correct}) {q['options'][correct]}\n")
                self._missed.append(q)

        return score

    def explain_missed(self, questions: list[dict], score: int) -> None:
        """Provide detailed explanations for missed questions."""
        if not self._missed:
            print("You got everything right! No explanations needed.")
            return

        for q in self._missed:
            correct = q["correct"]
            answer_text = q["options"][correct]
            print(f"\n--- Q: {q['question']} ---")
            print(f"Answer: {correct}) {answer_text}\n")
            explanation = self.client.explain_topic(q["question"], answer_text)
            print(explanation)
