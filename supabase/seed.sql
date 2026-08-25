-- Run after schema.sql.
insert into public.profile (full_name, headline, introduction, email, phone, address, profile_image_url)
values ('Charles Q. Neri', 'Designer, Developer, Virtual Assistant, Freelancer', 'Helping businesses stay organized, productive, and efficient through reliable support and smart digital solutions.', 'charlesqneri@gmail.com', '+63 991 647 4108', 'Purok Yakal, Brgy. Pangabugan, Butuan City, Agusan del Norte, 8600', 'assets/img/Hero_true.JPG');

insert into public.about (summary, education, image_url) values
('A recent Bachelor of Science in Information Systems graduate with a strong foundation in IT support, office operations, administrative functions, and business processes.', '[{"title":"Bachelor of Science in Information Systems","school":"Caraga State University","date":"June 2026"},{"title":"Technical Vocational Livelihood - ICT","school":"Bartolome R. Luardo National High School, Davao City","date":"2019–2020"}]', 'assets/img/dp-final.png');

insert into public.contact_details (email, phone, address, map_url, facebook_url, instagram_url, linkedin_url, github_url, social_links) values
('charlesqneri@gmail.com', '+63 991 647 4108', 'Purok Yakal, Brgy. Pangabugan, Butuan City, Agusan del Norte, 8600', 'https://www.google.com/maps/search/?api=1&query=Purok%20Yakal%20Brgy.%20Pangabugan%20Butuan%20City', 'https://www.facebook.com/kimzy23', 'https://www.instagram.com/charles.neri13/', 'https://www.linkedin.com/in/charles-neri25/', 'https://github.com/charlesneri', '[{"label":"Facebook","url":"https://www.facebook.com/kimzy23","icon":"bi-facebook"},{"label":"Instagram","url":"https://www.instagram.com/charles.neri13/","icon":"bi-instagram"},{"label":"LinkedIn","url":"https://www.linkedin.com/in/charles-neri25/","icon":"bi-linkedin"},{"label":"GitHub","url":"https://github.com/charlesneri","icon":"bi-github"},{"label":"Google Drive","url":"https://drive.google.com/drive/folders/1DfNq7XAKOxTveOHuy0w5XvAzodyKocqd?usp=sharing","icon":"bi-google"},{"label":"OnlineJobs.ph","url":"https://www.onlinejobs.ph/jobseekers/info/3252642","icon":"onlinejobs"}]');

insert into public.skills (name, category, description, icon, sort_order) values
('Web Development', 'Technical', 'Responsive websites and interfaces using HTML, CSS, Bootstrap, Vue.js, and Supabase.', 'bi-code-slash', 1),
('UI/UX Design', 'Design', 'Interface planning and prototyping with Figma.', 'bi-palette', 2),
('Database Management', 'Technical', 'Hands-on experience with Supabase and PostgreSQL.', 'bi-database', 3),
('Digital Marketing', 'Marketing', 'Foundational digital marketing and Google Ads knowledge.', 'bi-megaphone', 4),
('Virtual Assistance', 'Administrative', 'Organized data entry, research, document preparation, and communication support.', 'bi-headset', 5);

insert into public.experiences (label, title, description, icon, sort_order) values
('Portfolio projects', 'Website & Interface Development', 'I plan, design, and build responsive portfolio and educational interfaces using Figma, Vue.js, Bootstrap, Supabase, and Vercel.', 'bi-window-stack', 1),
('Academic experience', 'Capstone & Team Projects', 'A team leader and contributor to project research, interface design, database planning, documentation, presentations, and collaborative development.', 'bi-mortarboard', 2),
('Hands-on practice', 'Administrative & Digital Support', 'I practice organized data entry, document preparation, email and calendar management, online research, and clear digital communication.', 'bi-headset', 3);

insert into public.projects (title, category, tools, description, image_url, link_url, link_name, sort_order) values
('Figma Interface Design', 'UI/UX Design', 'Figma', 'An interactive interface prototype created in Figma to explore page structure, navigation, and user experience.', 'assets/img/first page.png', 'https://www.figma.com/proto/PkkPQ083pV0mRVWnF5nUg7/Untitled?node-id=0-1&t=fy1PccKmXFPQ5VEJ-1', 'View Figma prototype', 1),
('Guitar Song Platform Redesign', 'Web & UI Design', 'Figma', 'An educational redesign of an existing platform, focused on cleaner mobile navigation.', 'assets/img/Android Compact - 1.png', 'https://guitar-song.vercel.app/', 'Visit Guitar Song', 2),
('Teach & Learn Platform', 'Full-stack Web Development', 'Vue.js, Supabase, Vercel', 'An educational website developed with Vue.js and Supabase.', 'assets/img/teachandlearn.png', 'https://teachandlearn.vercel.app/', 'Visit Teach & Learn', 3);

insert into public.certificates (title, issuer, category, skills, description, image_url, credential_url, sort_order) values
('Introduction to HTML', 'SoloLearn', 'Course Certificate', 'HTML, SoloLearn', 'Awarded after completing SoloLearn''s introductory HTML course and its foundational lessons on structuring web pages.', 'cerificates/sololearn.png', 'cerificates/sololearn.png', 1),
('Responsive Web Design', 'FreeCodeCamp', 'Course Certificate', 'HTML, CSS, Responsive Design', 'Completed FreeCodeCamp training in responsive web design.', 'cerificates/web-design.png', 'cerificates/web-design.png', 2),
('Digital Marketing', 'DICT', 'Training Certificate', 'Digital Marketing', 'Completed digital marketing upskilling through DICT.', 'cerificates/DM001.png', 'cerificates/DM001.png', 3),
('Google Ads Search Certification', 'Google', 'Professional Certification', 'Google Ads, Search Advertising', 'Demonstrates foundational knowledge of search campaign setup, keyword targeting, ad creation, and performance optimization.', 'assets/img/Google ads Search.png', 'assets/img/Google ads Search.png', 4),
('Google Ads Video Certification', 'Google', 'Professional Certification', 'Google Ads, Video Advertising', 'Demonstrates foundational knowledge of video campaign setup, audience targeting, ad creation, and performance optimization.', 'assets/img/Google ads video.png', 'assets/img/Google ads video.png', 5);
