# NourishPath

An AI-powered nutrition companion that turns health goals, dietary needs, and local food preferences into safe meal suggestions, shopping lists, and direct grocery-buying links.

This Phase 2 foundation provides a React frontend, Express API, and demo-only guest access.

## Demo access

Use any of the following accounts with password `ADMIN`:

- Guest1
- Guest2
- Guest3

These credentials are deliberately hardcoded for the hackathon demo only. Do not reuse this approach in production.

## Run locally

Open two terminals:

```powershell
cd server
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

```powershell
cd client
Copy-Item .env.example .env
npm.cmd install
npm.cmd run dev
```

The API health check is available at `http://localhost:5000/api/health` and the frontend runs on `http://localhost:5173` by default.

## Structure

- `client/` - React + Vite interface
- `server/` - Express REST API
- `docs/` - product and technical notes
