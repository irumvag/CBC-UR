# Claude Study Buddy

An AI-powered study assistant that helps University of Rwanda students prepare for exams by generating practice questions and explanations using Claude.

## Features

- Generate practice questions from any topic or course material
- Get detailed explanations for answers
- Quiz mode with scoring
- Support for multiple subjects (CS, Math, Science, etc.)
- Conversation history for follow-up questions

## Tech Stack

- **Language**: Python 3.10+
- **AI**: Anthropic Claude API
- **Interface**: Command-line (terminal)

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY=your-api-key-here
```

3. Run the app:
```bash
python study_buddy.py
```

## Usage

```
$ python study_buddy.py

Welcome to Claude Study Buddy!
Enter a topic to study (or 'quit' to exit):

> Data Structures - Binary Trees

Generating 5 practice questions on Binary Trees...

Q1: What is the maximum number of nodes at level 'l' of a binary tree?
  a) 2^l
  b) 2^(l-1)
  c) l^2
  d) 2l

Your answer: a
Correct! 2^l is the maximum number of nodes at level l...
```

## Project Structure

```
claude-study-buddy/
  README.md
  requirements.txt
  study_buddy.py
  src/
    claude_client.py
    quiz_engine.py
    utils.py
```

## Built by

Claude Builder Club - University of Rwanda
