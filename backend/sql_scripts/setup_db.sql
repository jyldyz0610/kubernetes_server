DROP DATABASE IF EXISTS meta_db;
CREATE DATABASE IF NOT EXISTS `meta_db` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE USER IF NOT EXISTS 'meta'@'%' IDENTIFIED BY 'meta2024!';

GRANT SELECT, CREATE, UPDATE, INSERT, DELETE ON meta_db.* TO 'meta'@'%';

FLUSH PRIVILEGES;

USE meta_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255), -- Hinzugefügt für die E-Mail-Adresse
  password VARCHAR(255),
  salt VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  googleId VARCHAR(255),
  secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    category VARCHAR(255),
    link VARCHAR(255),
    ogTitle VARCHAR(255),
    ogDescription VARCHAR(255),
    ogImage VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    profile_picture VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

USE meta_db;

INSERT INTO users (username, email, name, googleId, secret) VALUES ('testuser1', 'test1@test.de', 'Test User One', 'google123', 'geheim123');
-- INSERT INTO users (username, email, name, googleId, secret) VALUES ('testuser2', 'test2@test.de', 'Test User One', 'google123', 'geheim123');

INSERT INTO links (category, link, ogTitle, ogDescription, ogImage, user_id)
VALUES
  ('Business', 'https://techstarter.de', 'Techstarter GmbH', 'Weiterbildung in Cloud Technologien', 'https://aws-cpt.rungame.de/ts_mint.png', 1),
  ('Videos', 'https://youtube.com', 'youtube', 'Videos hochladen', 'https://www.youtube.com/img/desktop/yt_1200.png', 1),
  ('Cloud', 'https://aws.amazon.com', 'AWS', 'Amazon Web Services, Cloud', 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', 1);
INSERT INTO profiles (user_id, full_name, bio, profile_picture) VALUES (1, 'Vorname Nachname1', 'Biografie von Benutzer 1', 'bild1.jpg');
-- INSERT INTO profiles (user_id, full_name, bio, profile_picture) VALUES (1, 'Vorname Nachname2', 'Biografie von Benutzer 2', 'bild2.jpg');