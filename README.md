# 4K Production — Admin CMS Desktop App

## Project Structure

```
4k-production/
├── backend/           ← Express API server
├── frontend/          ← Vue 3 frontend (browser + Electron shared)
└── admin-desktop/     ← Electron desktop app wrapper
    ├── main.js        ← Electron main process
    ├── preload.js     ← Secure bridge (exposes config to Vue)
    ├── config.json    ← Edit this to change backend URL or token
    ├── package.json
    └── assets/
        └── icon.ico   ← Required for .exe build (256x256+)
```

## How Desktop Auth Works

The desktop app **never shows a login form**. Instead:

1. Electron reads `config.json` → gets `apiUrl` and `desktopToken`
2. On startup, Vue calls `POST /api/admin/desktop-auth` with the token
3. Backend validates token against `DESKTOP_AUTH_TOKEN` in `.env`
4. Backend creates an admin session automatically
5. Vue router navigates straight to the dashboard

**The token in `config.json` must match `DESKTOP_AUTH_TOKEN` in `backend/.env`**

Default token: `4kprod-desktop-auto-auth-token-2025-change-this`
Change it to something unique and secret in production.

## Build Steps

### 1. Start the backend
```bash
cd backend
npm install
npm run dev
```

### 2. Build the Vue frontend
```bash
cd frontend
npm install
npm run build
```

### 3. Build the Electron .exe
```bash
cd admin-desktop
npm install
npm run build
```

Installer output: `admin-desktop/dist-electron/4K Production Admin Setup 1.0.0.exe`

## Changing the Backend URL

Edit `config.json` next to the installed `.exe`:
```
C:\Program Files\4K Production Admin\config.json
```

```json
{
  "apiUrl":       "https://api.yourproductiondomain.com",
  "appName":      "4K Production Admin",
  "desktopToken": "your-secret-token-here"
}
```

Restart the app — no rebuild needed.

## Default Login (browser web access)

URL: `http://localhost:5173/admin/login`
Username: `admin`
Password: `Admin@4K2024!`
