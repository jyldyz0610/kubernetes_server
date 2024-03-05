const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const session = require('express-session');
const mysql = require('mysql2');
const util = require('util');
const bodyParser = require('body-parser'); 
const axios = require('axios');
const cheerio = require('cheerio');
const bcrypt = require('bcryptjs');
// Initialisierung von Express und SQLite-Datenbank
const app = express();
// const db = new sqlite3.Database('./database.db');
const { link } = require('fs');
const { error } = require('console');

// Konfiguration von express-session
app.use(session({
  secret: 'ultrageheim', // Ein Geheimnis für die Verschlüsselung der Session-ID
  resave: false, // Sollte die Session bei jedem Request neu gespeichert werden, auch wenn sie nicht geändert wurde?
  saveUninitialized: false, // Sollte eine neue, nicht geänderte Session gespeichert werden?
  cookie: {
    secure: false, // Für die Produktion auf true setzen, wenn HTTPS verwendet wird
    maxAge: 1000 * 60 * 60 * 24 // Gültigkeitsdauer des Cookies in Millisekunden
  }
}));

// Einrichtung der Cors-Options
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// MySQL Verbindung
function getConnection() {
  const requiredEnvVariables = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missingVariables = requiredEnvVariables.filter(key => !process.env[key]);
  if (missingVariables.length > 0)
      console.error(`Error: Missing required environment variables: ${missingVariables.join(', ')}`);
  try {
      var cnx = mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME
      });

  } catch (error) {
      console.error("Database connection error", error);
  }

 try {
      cnx.query('SELECT * FROM links;', function (error, results, fields) {
          if (error) {
              console.log("mySQL Error:", error);
              process.exit(1); // exit
          } else {
              console.log("SQL Connection Self-Check: Ok");
              console.log("DB Connection set up successfully");
              console.log('Connected to MySQL as id ' + cnx.threadId);
          }
      });
  } catch (error) {
      console.error("SQL Schema Error: Could not retrieve link list (see sql-scripts for DB setup)", error);
  }
  return cnx;
}

const cnx = getConnection();

// Passport Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, 
function(accessToken, refreshToken, profile, cb) {
  cnx.query("SELECT * FROM users WHERE googleId = ?", [profile.id], (err, rows) => {
      if (!rows.length) {
          const insertUserQuery = "INSERT INTO users (username, name, googleId) VALUES (?, ?, ?)";
          cnx.query(insertUserQuery, [profile.displayName, profile.displayName, profile.id], (err, result) => {
              if (err) throw err;

              const userId = result.insertId;
              const insertProfileQuery = "INSERT INTO profiles (user_id, full_name) VALUES (?, ?)";
              cnx.query(insertProfileQuery, [userId, profile.displayName], (err, profileResult) => {
                  if (err) throw err;

                  // Wenn alles erfolgreich war, können wir die neu eingefügten Daten abrufen
                  cnx.query("SELECT * FROM profiles WHERE user_id = ?", [userId], (err, newRows) => {
                      if (err) throw err;
                      return cb(null, newRows[0]);
                  });
              });
          });
      } else {
          return cb(null, rows[0]);
      }
  });
}

));

passport.serializeUser(function(user, done) {
done(null, user.id);
});

passport.deserializeUser(function(id, done) {
cnx.query("SELECT * FROM users WHERE id = ?", [id], (err, rows) => {
  if (err) throw err;
  done(err, rows[0]);
});
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ isLoggedIn: false }); // Der Benutzer ist nicht angemeldet
  }
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Google Auth Route
app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// Google Auth Callback Route
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Hier JWT für den Nutzer erstellen und senden
    const user = { id: req.user.id }; // Angenommen, req.user enthält das Nutzerobjekt
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`${process.env.FRONTEND_URL}/myspace?token=${accessToken}`);
  }
);

// Logout route
app.post('/logout',  (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send('Logged out successfully');
    }
  });
});

// Geschützte Route, um Nutzerdaten zu senden
app.get("/userData", (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
  
    cnx.query("SELECT id, username, name FROM users WHERE id = ?", [userId], (err, rows) => {
      if (err) {
        console.error("Fehler beim Abrufen der Nutzerdaten:", err);
        res.status(500).send("Interner Serverfehler");
      } else if (rows.length) {
        res.json(rows[0]);
      } else {
        res.status(404).send("Nutzer nicht gefunden");
      }
    });
  } else {
    res.status(403).send("Nicht autorisiert");
  }
  });

// API-Endpunkt zum Abrufen von Daten aus der MySQL-Datenbank
app.get('/links', (req, res) => {
  cnx.query('SELECT * FROM links ORDER BY id DESC', (err, results, fields) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching data from database' });
      return;
    }
    res.json(results);
  });
});

// Route für das Abrufen der neuesten Links, nur für authentifizierte Benutzer zugänglich
app.get('/latestlinks', (req, res) => {
  const sql = "SELECT * FROM links ORDER BY id DESC LIMIT 5"; // Abfrage für die fünf neuesten Links
  cnx.query(sql, (err, results) => {
    if (err) {
      console.error("Error retrieving latest links:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results); // Senden der Ergebnisse als JSON
  });
});

// Route für das Abrufen von Benutzerlinks, nur für authentifizierte Benutzer zugänglich
app.get('/userLinks', authenticateToken, (req, res) => {
  const userId = req.user.id; // Benutzer-ID aus dem authentifizierten Token extrahieren
  const sql = "SELECT * FROM links WHERE user_id = ?"; // Abfrage für die Benutzerlinks
  cnx.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error retrieving user links:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.json(results); // Senden der Benutzerlinks als JSON
  });
});
app.delete('/userLinks/:linkId', authenticateToken, (req, res) => {
  const linkId = req.params.linkId;
  const userId = req.user.id;

  const sql = "DELETE FROM links WHERE id = ? AND user_id = ?";
  cnx.query(sql, [linkId, userId], (err, result) => {
    if (err) {
      console.error("Error deleting user link:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(403).json({ error: "Forbidden" }); // Der Benutzer hat keine Berechtigung, den Link zu löschen
      return;
    }
    res.json({ message: "Link deleted successfully" });
  });
});
app.put('/userLinks/:linkId', authenticateToken, (req, res) => {
  const linkId = req.params.linkId;
  const userId = req.user.id;

  // Hier sollte auch überprüft werden, ob der Benutzer Änderungen vorgenommen hat
  const { category, link, ogTitle, ogDescription, ogImage } = req.body;

  const sql = "UPDATE links SET category = ?, link = ?, ogTitle = ?, ogDescription = ?, ogImage = ? WHERE id = ? AND user_id = ?";
  cnx.query(sql, [category, link, ogTitle, ogDescription, ogImage, linkId, userId], (err, result) => {
    if (err) {
      console.error("Error updating user link:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(403).json({ error: "Forbidden" }); // Der Benutzer hat keine Berechtigung, den Link zu bearbeiten
      return;
    }
    res.json({ message: "Link updated successfully" });
  });
});

app.use(bodyParser.json());

// POST endpoint to post a link and fetch meta tags
const query = util.promisify(cnx.query).bind(cnx);

app.post('/post-link', authenticateToken, async (req, res) => {
  const { url, category } = req.body;
  const userId = req.user.id; // Zugriff auf die userId aus dem Authentifizierungstoken

  // Überprüfen, ob alle Felder leer sind
  if (!url && !category) {
    return res.status(400).json({ success: false, error: 'URL and category are required' });
  }

  // Überprüfen, ob die URL gültig ist
  const domainRegex = /^(ftp|http[s]?):\/\/(?:www\.)?([a-zA-Z0-9\u00A1-\uFFFF-]+\.?)+(?:[a-zA-Z\u00A1-\uFFFF]{2,}|xn--[a-zA-Z0-9]+)/;

  if (!domainRegex.test(url)) {
    return res.status(400).json({ success: false, error: 'Invalid domain' });
  }

  try {
    // Überprüfen, ob der Link bereits vorhanden ist
    const existingLink = await checkExistingLink(url);
    if (existingLink) {
      return res.status(400).json({ success: false, error: 'Link already exists' });
    }

    // Wenn der Link nicht vorhanden ist, Meta-Tags abrufen und den Link speichern
    const response = await axios.get(url);
    const metaTags = parseMetaTags(response.data);
    await saveLink(url, metaTags, category, userId); // Pass userId to saveLink function
    res.json({ success: true, metaTags });
  } catch (error) {
    console.error('Error posting link:', error);
    res.status(500).json({ success: false, error: 'Error posting link' });
  }
});


async function checkExistingLink(url) {
  try {
    const queryResult = await query('SELECT * FROM links WHERE link = ?', [url]);
    return queryResult.length > 0; // Gibt true zurück, wenn der Link existiert, sonst false
  } catch (error) {
    console.error('Error checking existing link:', error);
    throw error; // Fehler an die aufrufende Funktion weitergeben
  }
}



async function saveLink(url, metaTags, category, userId) {
  try {
    const ogTitle = metaTags['og:title'] || '';
    const ogDescription = metaTags['og:description'] || '';
    const ogImage = metaTags['og:image'] || '';
    const insertQuery = 'INSERT INTO links (user_id, link, ogTitle, ogDescription, ogImage, category) VALUES (?, ?, ?, ?, ?, ?)';
    await query(insertQuery, [userId, url, ogTitle, ogDescription, ogImage, category]); // Hier wird auch die Kategorie und userId eingefügt
    console.log('Link saved to database:', url);

    // Jetzt fügen wir auch das Profil hinzu
    const insertProfileQuery = 'INSERT INTO profiles (user_id, full_name) VALUES (?, ?)';
    await query(insertProfileQuery, [userId, 'default full name']); // Hier wird die userId eingefügt
    console.log('Profile saved to database for user:', userId);
  } catch (error) {
    console.error('Error saving link to database:', error);
    throw error; // Fehler an die aufrufende Funktion weitergeben
  }
}

function parseMetaTags(html) {
  const $ = cheerio.load(html);
  const metaTags = {};
  $('meta').each((index, element) => {
    const name = $(element).attr('name');
    const property = $(element).attr('property');
    const content = $(element).attr('content');
    if (name && content) {
      metaTags[name] = content;
    }
    if (property && content && property.startsWith('og:')) {
      metaTags[property] = content;
    }
  });
  return metaTags;
}

app.delete('/links/:id', authenticateToken, async (req, res) => {
  const linkId = req.params.id;
  const userId = req.user.id; // Annahme: Die Benutzer-ID wird im Authentifizierungsmiddleware festgelegt

  try {
    // Überprüfen, ob der Link existiert und dem angemeldeten Benutzer gehört
    const link = await query('SELECT user_id FROM links WHERE id = ?', [linkId]);

    if (!link || link[0].user_id !== userId) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    // Löschen des Links aus der 'links'-Tabelle und aller zugehörigen Einträge in der 'profiles'-Tabelle
    await query('DELETE FROM links WHERE id = ?', [linkId]);

    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ success: false, error: 'Error deleting link' });
  }
});

app.put('/links/:id', authenticateToken, async (req, res) => {
  const linkId = req.params.id;
  const updatedLink = req.body;

  try {
    // Benutzer-ID des angemeldeten Benutzers aus dem Token extrahieren
    const userId = req.user.id;

    // Überprüfen, ob der angemeldete Benutzer der Besitzer des Links ist
    const linkOwnerQuery = await query('SELECT user_id FROM links WHERE id = ?', [linkId]);
    const linkOwnerId = linkOwnerQuery[0].user_id;

    if (userId !== linkOwnerId) {
      return res.status(403).json({ success: false, error: 'Sie sind nicht berechtigt, diesen Link zu bearbeiten' });
    }

    // Aktualisieren des Links in der Datenbank
    await query('UPDATE links SET category = ?, link = ?, ogTitle = ?, ogDescription = ?, ogImage = ? WHERE id = ?', 
      [updatedLink.category, updatedLink.link, updatedLink.ogTitle, updatedLink.ogDescription, updatedLink.ogImage, linkId]);

    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Links:', error);
    res.status(500).json({ success: false, error: 'Fehler beim Aktualisieren des Links' });
  }
});


const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
