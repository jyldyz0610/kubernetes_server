const { exec } = require('child_process');

// Starten Sie zuerst Ihren Backend-Server
const backendProcess = exec('node backend/server.js');

backendProcess.stdout.on('data', (data) => {
  console.log(`Backend server output: ${data}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`Backend server error: ${data}`);
});

// Starten Sie Ihren Frontend-Server
const frontendProcess = exec('npm start', { cwd: 'frontend' });

frontendProcess.stdout.on('data', (data) => {
  console.log(`Frontend server output: ${data}`);
});

frontendProcess.stderr.on('data', (data) => {
  console.error(`Frontend server error: ${data}`);
});
