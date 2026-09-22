# StoryForge AI Frontend

The modern React Single Page Application (SPA) for the StoryForge AI platform.

## Features

- **Dashboard**: High-level overview of projects and statistics.
- **Project Management**: Create and manage projects.
- **Story Management**: Create raw user stories and view AI quality scores.
- **AI Refinement Workspace**: A side-by-side view where users can see the original story, run the multi-agent AI pipeline, review the analysis and refined output, and apply the changes directly back to the system.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** for fast builds and dev server
- **TailwindCSS 3** for styling
- **React Router v6** for navigation
- **Axios** for API communication
- **Lucide React** for icons

## Development

The frontend is configured to use a Vite proxy to communicate with both the existing Java backend and the new Python AI service.

```typescript
// vite.config.ts
proxy: {
  '/api/ai': {
    target: 'http://localhost:8000', // Python AI Service
    changeOrigin: true,
  },
  '/api': {
    target: 'http://localhost:8080', // Java API Gateway
    changeOrigin: true,
  }
}
```

### Setup

```bash
npm install
npm run dev
```
By default, the Vite dev server runs on `http://localhost:5173`.
