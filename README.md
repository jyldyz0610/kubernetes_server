# Projekt CMS (Content Management System)

Dieses Projekt ist ein Content Management System (CMS), das aus einem Backend und einem Frontend besteht. Folgen Sie den nachstehenden Anweisungen, um das Projekt einzurichten und zu starten.

## Backend-Setup

1. Navigiere in das Backend-Verzeichnis:

    ```bash
    cd backend
    ```

2. Führe das Skript zum Zurücksetzen der Datenbank aus (falls erforderlich):

    ```bash
    sh reset-db.sh
    ```

3. Führe das Skript zum Einrichten der Umgebung aus:

    ```bash
    sh setup-env.sh
    ```

4. Installiere die erforderlichen npm-Pakete:

    ```bash
    npm install
    ```

## Frontend-Setup

1. Navigiere in das Frontend-Verzeichnis:

    ```bash
    cd frontend
    ```

2. Installiere die erforderlichen npm-Pakete:

    ```bash
    npm install
    ```

## Hauptverzeichnis Setup

1. Stelle sicher, dass deine .env-Datei im Hauptverzeichnis liegt.

## App starten

1. Installiere Bootstrap im Hauptverzeichnis des Projekts:

    ```bash
    npm install bootstrap
    ```

2. Starte die App:

    ```bash
    node start.js
    ```

Stelle sicher, dass du jeden Schritt im richtigen Verzeichnis ausführst und dass alle erforderlichen Dateien und Skripte vorhanden sind. Viel Spaß beim Verwenden des Content Management Systems!


## Docker

This README section provides instructions for building and running Docker containers for both the backend and frontend components of your application. It also includes instructions for the database container and how to configure the backend container with environment variables for database connection.

### Backend Dockerfile

To start the backend Docker container:

1. Build the backend Docker image:

    ```bash
    cd backend
    docker build -t backendtest:latest -f Dockerfile.backend .
    ```

2. Run the backend Docker container:

    ```bash
    docker run -p 3001:3001 -e DB_HOST=<ipDBcontainers> backendtest:latest
    ```

   Or for local development:

    ```bash
    docker run -p 3001:3001 -e DB_HOST="host.docker.internal" backendtest:latest
    ```

### Frontend Dockerfile

To start the frontend Docker container:

1. Build the frontend Docker image:

    ```bash
    cd frontend
    docker build -t frontendtest:latest -f Dockerfile.frontend .
    ```

2. Run the frontend Docker container:

    ```bash
    docker run -p 8080:80 frontendtest:latest
    ```

### Database Dockerfile

To start the database Docker container:

1. Build the database Docker image:

    ```bash
    docker build -t dbtest:latest -f Dockerfile.db .
    ```

2. Run the database Docker container:

    ```bash
    docker run dbtest:latest
    ```

### Einrichtung von Docker Compose mit HTTPS unter Verwendung von Nginx als Reverse Proxy


1. choco install mkcert

2. mkcert --install

3. mkcert knowledge.app.local localhost 127.0.0.1 ::1

4. 127.0.0.1 knowledge.app.local  # Dafür öffnen wir mit dem Editor als Administrator die Datei unter C:\Windows\System32\drivers\etc\hosts und fügen einen neuen Eintrag

 
### Docker Compose

1. Führen Sie den Befehl aus, um Docker Compose zu bauen:

    ```
    docker-compose build
    ```

2. Starten Sie die Anwendung mit Docker Compose:

    ```
    docker-compose up
    ```

Öffnen Sie im Browser `knowledge.app.local`, um auf die Anwendung zuzugreifen.

   test test test