# Claude Builder Club — University of Rwanda

Official website for the Claude Builder Club at University of Rwanda. Built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3.4 with custom design tokens
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
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
- **Serif**: Newsreader (headings)
- **Sans**: DM Sans (body text)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/claude-builder-club-ur/cbc-ur.git
cd cbc-ur
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Auth components (AuthModal, ProtectedRoute, AdminRoute)
│   ├── dashboard/      # Member dashboard components
│   ├── layout/         # Layout components (Navbar, Footer, AdminLayout)
│   ├── sections/       # Home page sections
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts (AuthContext)
├── hooks/              # Custom hooks
├── lib/                # Utilities and Supabase client
├── pages/
│   ├── admin/          # Admin panel pages
│   ├── dashboard/      # Member dashboard pages
│   └── *.tsx           # Public pages
├── styles/             # Global styles
└── types/              # TypeScript types
```

## Features

### Public Pages
- **Home**: Landing page with hero, stats, features, and CTA
- **About**: Mission, vision, team, and timeline
- **Events**: Upcoming workshops, hackathons, and meetups
- **Projects**: Community project showcase
- **Join**: Membership application form

### Member Dashboard
- Overview with stats and upcoming events
- Event registration management
- Project submission and management
- Profile settings

### Admin Panel
- Dashboard with key metrics
- Member management (approve/reject applications)
- Event management (create, edit, publish)
- Project management (feature toggle)

## 10-Week Program (Starting Feb 9, 2026)

| Week | Activities |
|------|-----------|
| 1 | Tabling + Social Post |
| 2 | CBC Meeting #1 + Mini Demo |
| 3 | Hackathon Planning #1 + Mini Demo |
| 4 | CBC Meeting #2 + Tabling |
| 5 | Social Post + 2 Mini Demos |
| 6 | CBC Meeting #3 + Hackathon Planning #2 |
| 7 | Tabling + Mini Demo |
| 8 | CBC Meeting #4 + Social Post |
| 9 | CBC Meeting #5 + Hackathon Planning #3 |
| 10 | **HACKATHON** + Social Post |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Build

```bash
npm run build
```

The build output will be in the `dist/` folder.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

**Note**: The app works with mock data if Supabase is not configured, allowing frontend development without a backend.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

&copy; 2026 Claude Builder Club — University of Rwanda

---

Built with support from [Anthropic](https://anthropic.com)
