# Campus Event Planner

A smart event planning assistant that helps club organizers schedule, promote, and manage campus events with AI-generated content.

## Features

- Generate event descriptions and promotional copy
- Create social media posts for events
- Suggest optimal event schedules based on the academic calendar
- Generate email invitations and reminders
- Export events to Google Calendar format (.ics)

## Tech Stack

- **Language**: TypeScript (Node.js)
- **AI**: Anthropic Claude API
- **Interface**: Command-line tool
- **Output**: JSON, ICS, Markdown

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```
ANTHROPIC_API_KEY=your-api-key-here
```

3. Run the planner:
```bash
npx tsx src/index.ts
```

## Usage

```
$ npx tsx src/index.ts

Campus Event Planner - Powered by Claude
=========================================

What would you like to do?
1. Create a new event
2. Generate promo content
3. Create email invitation
4. Export to calendar

> 1

Event name: Claude Workshop #2
Event type (workshop/hackathon/meetup/demo): workshop
Date (YYYY-MM-DD): 2026-04-15
Duration (hours): 3
Location: CST Campus, Room 201

Generating event details...

Title: Claude Workshop #2 - Building AI Assistants
Description: Join us for a hands-on workshop where you'll learn
to build your own AI assistant using the Claude API...
```

## Project Structure

```
campus-event-planner/
  README.md
  package.json
  src/
    index.ts
    planner.ts
    generators/
      description.ts
      social.ts
      email.ts
    utils/
      calendar.ts
      prompts.ts
```

## Built by

Claude Builder Club - University of Rwanda
