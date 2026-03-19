# Frontend Changes - Backend URL Centralization

## Summary

Consolidated all hardcoded backend URLs into a single configuration file to make future backend URL updates easy and maintainable.

## Changes Made

### 1. Created Centralized Config File
**File:** `src/config/api.js` (NEW)

This file is now the single source of truth for all backend API URLs.

Features:
- Exports `API_URL` constant used across the app
- Supports environment variables (`VITE_API_URL` for Vite, `REACT_APP_API_URL` for Create React App)
- Provides `getWebSocketUrl()` helper for WebSocket connections
- Provides `apiFetch()` helper for making API calls

### 2. Updated Files to Use Centralized Config

#### `src/hooks/useApi.js`
- Removed hardcoded: `const API_URL = 'https://equation-excess-sheets-defeat.trycloudflare.com/api'`
- Added import: `import { API_URL, getWebSocketUrl } from '../config/api'`
- Updated WebSocket URL construction to use `getWebSocketUrl()` helper

#### `src/App.jsx`
- Added import: `import { API_URL } from './config/api'`
- Replaced: `https://equation-excess-sheets-defeat.trycloudflare.com/api/agents/ping`
  - With: `${API_URL}/agents/ping`
- Replaced: `https://dealers-dallas-cat-sing.trycloudflare.com/api/tasks`
  - With: `${API_URL}/tasks`

#### `src/components/SettingsView.jsx`
- Removed hardcoded: `const API_URL = 'https://equation-excess-sheets-defeat.trycloudflare.com/api'`
- Added import: `import { API_URL } from '../config/api'`

#### `src/components/AITeam.jsx`
- Added import: `import { API_URL } from '../config/api'`
- Replaced: `https://equation-excess-sheets-defeat.trycloudflare.com/api/agents/ping`
  - With: `${API_URL}/agents/ping`

## How to Update the Backend URL

### Option 1: Update Config File (Recommended for Quick Changes)
Edit `src/config/api.js` and change the `FALLBACK_API_URL`:

```javascript
const FALLBACK_API_URL = 'https://your-new-backend-url.com/api';
```

### Option 2: Use Environment Variables (Recommended for Production)
Create a `.env` file in the project root:

```bash
# For Vite (default for this project)
VITE_API_URL=https://your-new-backend-url.com/api

# For Create React App
REACT_APP_API_URL=https://your-new-backend-url.com/api
```

Environment variables take precedence over the fallback URL.

## URLs That Were Replaced

The following hardcoded URLs have been centralized:

| Old URL | Location | Status |
|---------|----------|--------|
| `https://equation-excess-sheets-defeat.trycloudflare.com/api` | useApi.js, SettingsView.jsx | ✅ Replaced |
| `https://equation-excess-sheets-defeat.trycloudflare.com/api/agents/ping` | App.jsx, AITeam.jsx | ✅ Replaced |
| `https://dealers-dallas-cat-sing.trycloudflare.com/api/tasks` | App.jsx | ✅ Replaced |

## Backend URLs No Longer in Use

These URLs were previously used but are no longer in the codebase:
- `https://drawings-exhibit-meat-compound.trycloudflare.com`
- `https://dealers-dallas-cat-sing.trycloudflare.com`
- `https://hardcover-appearing-lenders-objects.trycloudflare.com`

## Future Maintenance

1. **When backend URL changes:** Update ONLY `src/config/api.js`
2. **For new components:** Import API_URL from `../config/api`
3. **For API calls:** Use the `apiFetch()` helper or template literals with `API_URL`

## Testing After URL Change

1. Update the URL in `src/config/api.js`
2. Restart the dev server: `npm run dev`
3. Test all features:
   - Tasks loading and updates
   - Content pipeline
   - Agent status/ping
   - Settings
   - Real-time updates (WebSocket)
