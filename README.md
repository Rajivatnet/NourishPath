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

## Judge-ready deployment (Render)

The repository includes `render.yaml` for one public web service that serves both the React client and Express API from the same URL.

1. In Render, choose **New > Blueprint** and connect the GitHub repository.
2. Select the `main` branch and provide the requested secret environment variables: `MONGODB_URI` and `OPENAI_API_KEY`.
3. Deploy, then open the generated `https://<service>.onrender.com` URL and verify `/api/health` returns `status: ok`.

Do not add secrets to GitHub. A free Render web service can take about a minute to wake after 15 minutes without traffic; a paid instance avoids this delay.

## Structure

- `client/` - React + Vite interface
- `server/` - Express REST API
- `docs/` - product and technical notes
