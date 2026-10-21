# Claude Builder Club — University of Rwanda

Official website for the Claude Builder Club at University of Rwanda. Built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3.4 with custom design tokens
- **Routing**: React Router v6
- **Icons**: Lucide React
- **SEO**: react-helmet-async
- **Deployment**: Vercel

## Design System

Based on the Anthropic/Claude brand guidelines:

### Colors
- **Terracotta**: `#da7756` - Primary accent color
- **Pampas**: `#F4F3EE` - Light background
- **Ink**: `#1A1714` - Primary text
- **Stone**: `#8A8578` - Secondary text
- **Sage**: `#7C9A82` - Success/positive
- **Teal**: `#4A8B8C` - Info/accent

### Typography
- **Serif**: Source Serif 4 (headings and body), falling back to Georgia

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/irumvag/CBC-UR.git
cd CBC-UR
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser.

### Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key   # optional, used for face verification
```

Never commit `.env` files; they are already listed in `.gitignore`.

## Available Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite development server        |
| `npm run build`   | Type-check and build for production      |
| `npm run preview` | Preview the production build locally     |
| `npm run lint`    | Run ESLint over the project              |
