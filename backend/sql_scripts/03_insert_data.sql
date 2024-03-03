USE meta_db;
INSERT INTO users (username, email, name, googleId, secret) VALUES ('testuser1', 'test1@test.de', 'Test User One', 'google123', 'geheim123');
INSERT INTO users (username, email, name, googleId, secret) VALUES ('testuser2', 'test2@test.de', 'Test User One', 'google123', 'geheim123');

INSERT INTO links (category, link, ogTitle, ogDescription, ogImage, user_id)
VALUES
  ('Business', 'https://techstarter.de', 'Techstarter GmbH', 'Weiterbildung in Cloud Technologien', 'https://aws-cpt.rungame.de/ts_mint.png', 1),
  ('Videos', 'https://youtube.com', 'youtube', 'Videos hochladen', 'https://www.youtube.com/img/desktop/yt_1200.png', 1),
  ('Cloud', 'https://aws.amazon.com', 'AWS', 'Amazon Web Services, Cloud', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', 1);