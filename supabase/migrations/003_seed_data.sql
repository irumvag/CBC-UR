-- CBC-UR Supabase Seed Data
-- Migration 003: Initial Data (migrated from hardcoded components)

-- ============================================================
-- TEAM MEMBERS (from Team.tsx)
-- ============================================================
INSERT INTO team_members (name, role, bio, linkedin_url, email, image_path, display_order) VALUES
(
  'Gad Anaclet Irumva',
  'President & Founder',
  'Computer Science student passionate about AI and building community at the University of Rwanda.',
  'https://www.linkedin.com/in/irumvagad/',
  'claudebuilderclub.urcst@gmail.com',
  '/images/team/gad.jpg',
  1
),
(
  'Mfuranzima Peace',
  'Vice President',
  'Dedicated to growing the club and connecting students with AI opportunities.',
  'https://www.linkedin.com/in/mfuranzima-peace/',
  'claudebuilderclub.urcst@gmail.com',
  '/images/team/peace.jpeg',
  2
),
(
  'Patrick Stration Mbabazi',
  'Treasurer',
  'Managing club finances and ensuring resources are available for all members.',
  'https://www.linkedin.com/in/patrick-mbabazi/',
  'claudebuilderclub.urcst@gmail.com',
  '/images/team/pazzo.jpeg',
  3
),
(
  'Ahadi Cyizere',
  'Technical Lead',
  'Leading technical workshops and helping members build AI-powered projects with Claude.',
  'https://www.linkedin.com/in/ahadi-cyizere/',
  'claudebuilderclub.urcst@gmail.com',
  '/images/team/Ahadi.jpeg',
  4
),
(
  'Ishimwe Nelly Ornella',
  'Secretary',
  'Coordinating club operations and keeping members informed about events and opportunities.',
  'https://www.linkedin.com/in/nelly-ornella-ishimwe/',
  'claudebuilderclub.urcst@gmail.com',
  '/images/team/nelly.jpeg',
  5
);

-- ============================================================
-- EVENTS (from Events.tsx)
-- ============================================================
INSERT INTO events (title, description, date, end_date, location, event_type, is_published) VALUES
(
  'Club Kickoff Meeting',
  'Join us for the inaugural Claude Builder Club meeting at University of Rwanda. Learn about Claude, meet fellow builders, and discover what we have planned for the semester.',
  '2026-02-26T17:30:00',
  '2026-02-26T18:30:00',
  'University of Rwanda, Muhazi Conference hall',
  'meetup',
  true
),
(
  'Intro to Claude Workshop',
  'A hands-on workshop covering the basics of building with Claude. Bring your laptop and get ready to build your first AI-powered project.',
  '2026-03-29T10:00:00',
  '2026-03-29T13:00:00',
  'University of Rwanda, CST Campus',
  'workshop',
  true
);

-- ============================================================
-- PROJECTS (from Showcase.tsx)
-- ============================================================
INSERT INTO projects (title, description, author_name, tags, github_url, is_featured, is_published) VALUES
(
  'Claude Study Buddy',
  'An AI-powered study assistant that helps students understand complex topics through personalized explanations and interactive Q&A.',
  'CBC-UR Team',
  ARRAY['Claude API', 'Python', 'Education'],
  'https://github.com/irumvag/CBC-UR/tree/main/projects/claude-study-buddy',
  true,
  true
),
(
  'Kinyarwanda Translator',
  'A translation tool that bridges Kinyarwanda and English, helping preserve and promote Rwandan language while making content accessible.',
  'CBC-UR Team',
  ARRAY['Claude API', 'React', 'NLP'],
  'https://github.com/irumvag/CBC-UR/tree/main/projects/kinyarwanda-translator',
  false,
  true
),
(
  'Campus Event Planner',
  'An intelligent event planning assistant that helps student organizations coordinate events, manage schedules, and communicate with attendees.',
  'CBC-UR Team',
  ARRAY['Claude API', 'TypeScript', 'Automation'],
  'https://github.com/irumvag/CBC-UR/tree/main/projects/campus-event-planner',
  false,
  true
);

-- ============================================================
-- LINKS (from Links.tsx)
-- ============================================================
INSERT INTO links (title, url, description, icon, display_order, is_active) VALUES
(
  'Join the Club',
  'https://www.jotform.com/253555944387168',
  'Fill out our membership form to officially join the Claude Builder Club.',
  'UserPlus',
  1,
  true
),
(
  'Project Showcase',
  '/showcase',
  'Explore projects built by our members using Claude API.',
  'FolderOpen',
  2,
  true
),
(
  'Upcoming Events',
  '/events',
  'View our calendar of workshops, hackathons, and meetups.',
  'Calendar',
  3,
  true
),
(
  'Contact Us',
  'mailto:claudebuilderclub.urcst@gmail.com',
  'Reach out to us for partnerships or general inquiries.',
  'Mail',
  4,
  true
);

-- ============================================================
-- SITE CONTENT (hero, benefits, outreach text)
-- ============================================================
INSERT INTO site_content (key, value, section) VALUES
-- Hero section
('hero_heading', 'Build the Future with Claude at University of Rwanda', 'hero'),
('hero_subheading', 'Join the Claude Builder Club — where students learn, build, and innovate with AI. Free Claude Pro access, real projects, and a community of builders.', 'hero'),
('hero_cta_primary', 'See Upcoming Events', 'hero'),
('hero_cta_secondary', 'Learn About Us', 'hero'),

-- Outreach section
('outreach_heading', 'Partner With Us', 'outreach'),
('outreach_subheading', 'We''re always looking to connect with organizations that want to support AI education at the University of Rwanda.', 'outreach'),
('outreach_email', 'claudebuilderclub.urcst@gmail.com', 'outreach'),
('outreach_cta', 'Get in Touch', 'outreach'),

-- About section
('about_mission', 'To empower University of Rwanda students to build the future using AI, starting with Claude.', 'about'),
('about_description', 'The Claude Builder Club at University of Rwanda (CBC-UR) is an official Anthropic-backed student organization dedicated to making AI education accessible, practical, and community-driven.', 'about');
