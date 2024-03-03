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
  secret VARCHAR(255)
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
