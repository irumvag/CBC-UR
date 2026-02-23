"""Claude Study Buddy - AI-powered study assistant for UR students."""

import os
import sys
from src.claude_client import ClaudeClient
from src.quiz_engine import QuizEngine
from src.utils import print_welcome, print_score, get_input


def main():
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.")
        print("Run: export ANTHROPIC_API_KEY=your-api-key-here")
        sys.exit(1)

    client = ClaudeClient(api_key)
    quiz = QuizEngine(client)

    print_welcome()

    while True:
        topic = get_input("\nEnter a topic to study (or 'quit' to exit):\n> ")
        if topic.lower() in ("quit", "exit", "q"):
            print("\nGood luck with your studies! 📚")
            break

        num = get_input("How many questions? (default: 5): ") or "5"
        try:
            num_questions = min(int(num), 20)
        except ValueError:
            num_questions = 5

        print(f"\nGenerating {num_questions} practice questions on '{topic}'...\n")

        questions = quiz.generate_questions(topic, num_questions)
        if not questions:
            print("Could not generate questions. Try a different topic.")
            continue

        score = quiz.run_quiz(questions)
        print_score(score, len(questions))

        explain = get_input("\nWant explanations for missed questions? (y/n): ")
        if explain.lower() == "y":
            quiz.explain_missed(questions, score)


if __name__ == "__main__":
    main()
