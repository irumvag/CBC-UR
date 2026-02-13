-- Seed Data: Initial site content
-- This populates the database with default content from the static JSON files

-- ============================================
-- Features
-- ============================================
INSERT INTO features (icon, title_en, title_rw, description_en, description_rw, sort_order) VALUES
('book-open', 'Learn AI Development', 'Wige Iterambere rya AI', 'Master prompt engineering, Claude API integration, and build intelligent applications through hands-on workshops.', 'Menya ubuhanga bwo gukoresha prompt, gukoresha Claude API, no kubaka porogaramu zifite ubwenge binyuze mu mahugurwa akora ku buryo nyabwo.', 1),
('code', 'Build Real Projects', 'Kora Imishinga Nyayo', 'Work on meaningful projects that solve local challenges in healthcare, education, agriculture, and more.', 'Kora ku mishinga ifite intego ikemura ibibazo by''aho uri mu buzima busanzwe, uburezi, ubuhinzi, n''ibindi.', 2),
('users', 'Connect & Grow', 'Huza & Kura', 'Network with fellow builders, industry professionals, and Anthropic''s global community of developers.', 'Huza n''abandi bubatsi, abakozi b''inganda, n''umuryango mpuzamahanga wa Anthropic w''abahanga mu iterambere.', 3),
('presentation', 'Showcase Your Work', 'Erekana Akazi Kawe', 'Present your projects at demo days, hackathons, and gain recognition for your innovative solutions.', 'Tanga imishinga yawe mu minsi yo kwerekana, amarushanwa, kandi uhabwe icyubahiro ku bisubizo byawe bishya.', 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- Team Members
-- ============================================
INSERT INTO team_members (name, role_en, role_rw, bio_en, bio_rw, image_url, linkedin_url, github_url, sort_order) VALUES
('Jean Paul Mugisha', 'Club President', 'Perezida w''Ishyirahamwe', 'Computer Science student passionate about AI and its potential to transform Rwanda.', 'Umunyeshuri wa Computer Science ukunda AI n''ubushobozi bwayo bwo guhindura u Rwanda.', NULL, NULL, NULL, 1),
('Marie Claire Uwimana', 'Vice President', 'Visi Perezida', 'Software Engineering student focused on building AI solutions for healthcare.', 'Umunyeshuri wa Software Engineering yibanda ku kubaka ibisubizo bya AI mu buzima.', NULL, NULL, NULL, 2),
('Eric Habimana', 'Technical Lead', 'Umuyobozi w''Ikoranabuhanga', 'Full-stack developer with experience in machine learning and Claude API integration.', 'Umunyamwuga wa full-stack ufite uburambe mu kwiga imashini no guhuza Claude API.', NULL, NULL, NULL, 3),
('Alice Mukamana', 'Events Coordinator', 'Uhuzabikorwa', 'Business Administration student managing club activities and community engagement.', 'Umunyeshuri wa Business Administration uyobora ibikorwa by''ishyirahamwe n''ubufatanye n''abaturage.', NULL, NULL, NULL, 4)
ON CONFLICT DO NOTHING;

-- ============================================
-- Partners
-- ============================================
INSERT INTO partners (name, logo_url, website_url, description_en, description_rw, tier, sort_order) VALUES
('Anthropic', NULL, 'https://www.anthropic.com', 'AI safety company and creator of Claude, our primary technology partner.', 'Sosiyete y''umutekano wa AI n''uwahanze Claude, umufatanyabikorwa wacu w''ibanze mu ikoranabuhanga.', 'platinum', 1),
('University of Rwanda', NULL, 'https://ur.ac.rw', 'Our home institution providing space, support, and academic guidance.', 'Kaminuza yacu itanga umwanya, ubufasha, n''ubuyobozi bw''amasomo.', 'platinum', 2),
('Rwanda ICT Chamber', NULL, 'https://ictchamber.rw', 'Supporting tech ecosystem development and connecting us with industry.', 'Gushyigikira iterambere ry''ikoranabuhanga no kuduhuza n''inganda.', 'gold', 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- Milestones
-- ============================================
INSERT INTO milestones (date, title_en, title_rw, description_en, description_rw, icon) VALUES
('2024-09-01', 'Club Founded', 'Ishyirahamwe Ryashinzwe', 'CBC-UR was officially established at University of Rwanda.', 'CBC-UR yashinzwe mu buryo bwemewe muri Kaminuza y''u Rwanda.', 'flag'),
('2024-10-15', 'First Workshop', 'Ihugurwa rya Mbere', 'Hosted our first Claude API workshop with 50+ attendees.', 'Twakoreye ihugurwa ryacu rya mbere rya Claude API ririmo abantu 50+.', 'users'),
('2024-11-20', 'Hackathon Launch', 'Gutangiza Amarushanwa', 'Organized our first AI hackathon focused on local challenges.', 'Twateguye amarushanwa yacu ya mbere ya AI yibanda ku bibazo by''aho.', 'trophy'),
('2025-01-10', '100 Members', 'Abanyamuryango 100', 'Reached 100 active members milestone.', 'Twageze ku ntego y''abanyamuryango 100 bakora.', 'star')
ON CONFLICT DO NOTHING;

-- ============================================
-- Site Stats
-- ============================================
INSERT INTO site_stats (key, value, label_en, label_rw, icon, sort_order) VALUES
('members', 120, 'Active Members', 'Abanyamuryango Bakora', 'users', 1),
('projects', 25, 'Projects Built', 'Imishinga Yakozwe', 'folder-kanban', 2),
('workshops', 15, 'Workshops Held', 'Amahugurwa Yakorewe', 'presentation', 3),
('partners', 8, 'Industry Partners', 'Abo Dufatanya', 'handshake', 4)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  label_en = EXCLUDED.label_en,
  label_rw = EXCLUDED.label_rw;

-- ============================================
-- Site Content (Key translations)
-- ============================================
-- Hero Section
INSERT INTO site_content (key, language, value, category) VALUES
('hero.tagline', 'en', 'AI Builders Community', 'home'),
('hero.tagline', 'rw', 'Umuryango w''Abubatsi ba AI', 'home'),
('hero.title', 'en', 'Build the future with Claude AI', 'home'),
('hero.title', 'rw', 'Kubaka ejo hazaza na Claude AI', 'home'),
('hero.subtitle', 'en', 'Join Rwanda''s first Claude Builder Club. Learn AI development, collaborate on impactful projects, and be part of a vibrant community of innovators at University of Rwanda.', 'home'),
('hero.subtitle', 'rw', 'Injira muri Claude Builder Club ya mbere mu Rwanda. Wige iterambere rya AI, ufatanye ku mishinga ifite akamaro, kandi ube igice cy''umuryango w''abahinduye ibintu muri Kaminuza y''u Rwanda.', 'home'),
('hero.cta', 'en', 'Join Now', 'home'),
('hero.cta', 'rw', 'Injira Nonaha', 'home'),
('hero.secondaryCta', 'en', 'Learn More', 'home'),
('hero.secondaryCta', 'rw', 'Menya Byinshi', 'home'),

-- CTA Section
('cta.title', 'en', 'Ready to Start Building?', 'home'),
('cta.title', 'rw', 'Witeguye Gutangira Kubaka?', 'home'),
('cta.subtitle', 'en', 'Join Claude Builder Club and be part of Rwanda''s AI innovation community. Whether you''re a beginner or experienced developer, there''s a place for you.', 'home'),
('cta.subtitle', 'rw', 'Injira muri Claude Builder Club ube igice cy''umuryango w''ibishya bya AI mu Rwanda. Niba uri umutangizi cyangwa umuhanga mu iterambere, hari umwanya wawe.', 'home'),
('cta.button', 'en', 'Apply for Membership', 'home'),
('cta.button', 'rw', 'Saba Kuba Umunyamuryango', 'home'),

-- About Section Headers
('about.tagline', 'en', 'About Us', 'about'),
('about.tagline', 'rw', 'Ibyerekeye', 'about'),
('about.title', 'en', 'Empowering Rwanda''s AI Builders', 'about'),
('about.title', 'rw', 'Guha Imbaraga Abubatsi ba AI mu Rwanda', 'about'),
('about.subtitle', 'en', 'Claude Builder Club at University of Rwanda is a student-led community dedicated to learning, building, and innovating with AI technology.', 'about'),
('about.subtitle', 'rw', 'Claude Builder Club muri Kaminuza y''u Rwanda ni umuryango uyobowe n''abanyeshuri wiyemeje kwiga, kubaka, no guhindura ibintu ukoresheje ikoranabuhanga rya AI.', 'about'),

-- Mission
('mission.tagline', 'en', 'Our Mission', 'about'),
('mission.tagline', 'rw', 'Intego Yacu', 'about'),
('mission.title', 'en', 'Why We Exist', 'about'),
('mission.title', 'rw', 'Impamvu Turiho', 'about'),
('mission.description', 'en', 'We believe every student deserves access to cutting-edge AI education and the opportunity to build solutions that matter. Our mission is to create a supportive environment where curious minds can explore AI technology, develop practical skills, and create impact in their communities.', 'about'),
('mission.description', 'rw', 'Twizera ko buri munyeshuri akwiye kubona uburezi bwa AI bugezweho n''amahirwe yo kubaka ibisubizo bifite akamaro. Intego yacu ni ugushiraho ibidukikije bishyigikira aho ubwenge bushakashaka bushobora gushakisha ikoranabuhanga rya AI, gukura ubuhanga nyabwo, no guhanga ingaruka mu miryango yabo.', 'about'),

-- Vision
('vision.title', 'en', 'Our Vision', 'about'),
('vision.title', 'rw', 'Icyerekezo Cyacu', 'about'),
('vision.description', 'en', 'To be the leading student AI community in East Africa, producing innovative solutions and skilled AI practitioners who drive positive change.', 'about'),
('vision.description', 'rw', 'Kuba umuryango w''abanyeshuri ba AI uyobora muri Afurika y''Iburasirazuba, utanga ibisubizo bishya n''abahanga ba AI bakora impinduka nziza.', 'about'),

-- Footer
('footer.copyright', 'en', '© 2026 Claude Builder Club — University of Rwanda', 'footer'),
('footer.copyright', 'rw', '© 2026 Claude Builder Club — Kaminuza y''u Rwanda', 'footer'),
('footer.builtWith', 'en', 'Built with curiosity and Claude', 'footer'),
('footer.builtWith', 'rw', 'Byubatswe n''ubushakashaka na Claude', 'footer')
ON CONFLICT (key, language) DO UPDATE SET
  value = EXCLUDED.value,
  category = EXCLUDED.category;
