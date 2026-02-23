# Kinyarwanda Translator

A translation tool leveraging Claude to translate between Kinyarwanda and English, built to help bridge language gaps in technical documentation.

## Features

- Translate text between Kinyarwanda and English
- Handles technical/programming terminology
- Preserves code blocks and formatting
- Provides context notes for culturally specific terms
- Clean web interface

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **AI**: Anthropic Claude API
- **Styling**: CSS Modules
- **Build**: Vite

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
VITE_ANTHROPIC_API_KEY=your-api-key-here
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173

## Usage

1. Select the translation direction (EN → RW or RW → EN)
2. Paste or type your text in the input area
3. Click "Translate" and Claude will provide the translation
4. For technical docs, enable "Technical Mode" for better accuracy

## Project Structure

```
kinyarwanda-translator/
  README.md
  package.json
  src/
    App.tsx
    api/
      translate.ts
    components/
      TranslatorForm.tsx
      LanguageToggle.tsx
      ResultDisplay.tsx
```

## Built by

Claude Builder Club - University of Rwanda
