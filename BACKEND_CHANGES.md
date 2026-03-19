# Backend Production Deployment Changes

## Summary
The Mission Control backend has been prepared for production deployment on Railway/Render. Below are all changes made.

## Changes Made

### 1. CORS Configuration (`src/index.js`)
**Before:** `app.use(cors())` - Allowed all origins (insecure)

**After:** Restricted CORS to specific origins:
```javascript
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:3000', 'https://jbtdc24.github.io'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Why:** Security best practice - only allow requests from known frontend origins.

### 2. Database Path Configuration (`src/database.js`)
**Before:** Hardcoded path: `const DATA_DIR = join(__dirname, '../data');`

**After:** Environment-configurable path:
```javascript
const DATA_DIR = process.env.DATA_DIR || join(__dirname, '../data');
```

**Why:** Allows configuring persistent storage location on Railway/Render which may have ephemeral filesystems.

### 3. Health Check Endpoint (`src/index.js`)
**Before:** Basic health check with status and time only

**After:** Enhanced health check:
```javascript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});
```

**Why:** Provides more diagnostic information for monitoring tools.

### 4. Removed Duplicate Route
**Before:** Two identical `/api/agents/ping` routes existed

**After:** Removed the duplicate, kept one instance

**Why:** Clean code, no functional impact but better maintainability.

### 5. Package.json Updates
**Added:**
```json
"engines": {
  "node": ">=18.0.0"
}
```

**Why:** Specifies Node version requirement for deployment platforms.

### 6. Created `.env.example`
Created a template environment file with all configuration options:
- `PORT` - Server port (default: 3001)
- `HOST` - Server host (default: 0.0.0.0)
- `CORS_ORIGINS` - Comma-separated allowed origins
- `DATA_DIR` - Database file storage path

## Deployment Instructions

### Railway Deployment
1. Connect your GitHub repo to Railway
2. Add environment variables in Railway dashboard:
   - `CORS_ORIGINS=https://jbtdc24.github.io`
   - `DATA_DIR=/data` (if using persistent volume)
3. Deploy - Railway will use `npm start` automatically

### Render Deployment
1. Create new Web Service
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables:
   - `CORS_ORIGINS=https://jbtdc24.github.io`
   - `DATA_DIR=/var/data` (or disk mount path)
5. Deploy

### Environment Variables Required
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Server port |
| `HOST` | 0.0.0.0 | Server bind address |
| `CORS_ORIGINS` | localhost URLs | Allowed frontend origins |
| `DATA_DIR` | ./data | Database storage path |

## Frontend Configuration
Update your frontend API base URL to point to the deployed backend:
```javascript
const API_BASE = 'https://your-backend-url.railway.app';
// or
const API_BASE = 'https://your-backend.onrender.com';
```

## Notes
- Database persists to JSON file - suitable for low-volume use
- For high-traffic scenarios, consider migrating to PostgreSQL/MongoDB
- WebSocket connections will work through the same domain when frontend is on GitHub Pages
