"""Utility functions for the Study Buddy CLI."""


def print_welcome():
    """Print welcome banner."""
    print("=" * 50)
    print("  Claude Study Buddy")
    print("  AI-Powered Study Assistant for UR Students")
    print("=" * 50)
    print()
    print("Enter any topic and I'll generate practice")
    print("questions to help you prepare for exams.")


def print_score(score: int, total: int):
    """Print quiz results."""
    percentage = (score / total * 100) if total > 0 else 0
    print(f"\n{'=' * 30}")
    print(f"  Score: {score}/{total} ({percentage:.0f}%)")

    if percentage == 100:
        print("  Perfect score! 🎉")
    elif percentage >= 70:
        print("  Good job! Keep it up 👍")
    elif percentage >= 50:
        print("  Not bad, but review the material 📖")
    else:
        print("  Keep studying, you'll get there! 💪")

    print(f"{'=' * 30}")


def get_input(prompt: str) -> str:
    """Get user input with a prompt."""
    try:
        return input(prompt)
    except (EOFError, KeyboardInterrupt):
        print()
        return "quit"
