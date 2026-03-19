# Mission Control Backend Deployment Research

## Executive Summary

**RECOMMENDATION: Railway.app (Hobby Plan)**

For the Mission Control Node.js/Express backend with JSON database, **Railway.app** is the best choice due to:
- **Always-on service** (no spin-down after inactivity)
- **Persistent storage volumes** (critical for JSON DB)
- **Simple deployment** from GitHub
- **Custom domain support** with free SSL
- **Predictable pricing** starting at $5/month

---

## Platform Comparison

### 1. Railway.app

#### Overview
- **Launch Year:** 2020
- **Infrastructure:** Google Cloud Platform (GCP)
- **Target:** Modern PaaS for developers frustrated with Heroku

#### Pricing (2025-2026)
| Plan | Cost | Features |
|------|------|----------|
| **Free Trial** | $0 (30 days) | $5 credits, up to 2 vCPU / 1GB RAM, 50GB storage |
| **Free Tier** | $1/month after trial | Up to 1 vCPU / 0.5GB RAM, 0.5GB volume storage |
| **Hobby** | $5/month + usage | $5 monthly credits included, up to 8 vCPU / 8GB RAM per service, 5GB storage |
| **Pro** | $20/month + usage | $20 monthly credits, up to 32 vCPU / 32GB RAM, 100GB storage |

**Important:** Railway's free tier requires $1/month minimum after the 30-day trial. The Hobby plan at $5/month is the practical starting point.

#### Key Features
- ✅ **Persistent volumes** - Essential for JSON database
- ✅ **Always-on services** - No spin-down after inactivity
- ✅ **Git-based deployment** - Auto-deploy from GitHub
- ✅ **Custom domains** - Free SSL certificates
- ✅ **WebSocket support** - Full support for real-time features
- ✅ **Zero-config** - Automatic detection of Node.js apps
- ✅ **Environment variables** - Built-in secrets management
- ✅ **Multi-region** - Available on Hobby+ plans

#### JSON Database Persistence on Railway
Railway provides **volumes** for persistent storage:
```
1. Go to Service Settings → Volumes
2. Add Volume
3. Mount path: /app/data
4. Redeploy
```
Without a volume, data is lost on each deployment. This is CRITICAL for the JSON DB.

---

### 2. Render.com

#### Overview
- **Launch Year:** 2018
- **Infrastructure:** AWS + Google Cloud
- **Target:** Heroku alternative with comprehensive features

#### Pricing (2025-2026)
| Plan | Cost | Features |
|------|------|----------|
| **Free** | $0 | Web services, Postgres, Key Value (Redis), BUT spins down after 15 min inactivity |
| **Hobby** | $7/month/service | 0.5 vCPU / 512MB RAM, never sleeps, 2GB disk |
| **Standard** | $25/month/service | 1 vCPU / 2GB RAM, autoscaling, 5GB disk |
| **Pro** | $85/month/service | 2 vCPU / 4GB RAM, priority support |

#### Key Features
- ✅ **Generous free tier** - Great for testing
- ✅ **Managed databases** - Postgres, Redis
- ✅ **Static sites** - CDN included
- ✅ **Custom domains** - Free SSL
- ✅ **PR previews** - Preview environments for pull requests
- ✅ **Infrastructure-as-code** - render.yaml blueprints

#### Critical Limitation: Free Tier Spins Down
> "Render spins down a Free web service that goes 15 minutes without receiving any inbound traffic. This process takes about one minute to spin back up."

**This makes Render's free tier UNSUITABLE for Mission Control** because:
- The backend would sleep after 15 minutes
- First request after idle = 1-minute cold start
- WebSocket connections would be interrupted
- Agent ping/heartbeat system would fail

#### JSON Database Persistence on Render
Render offers **persistent disks** on paid plans only:
- Free tier: ❌ No persistent disk (data lost on redeploy)
- Hobby+: ✅ Persistent disk available

---

### 3. VPS (Virtual Private Server)

#### Options
| Provider | Minimum Cost | Specs |
|----------|--------------|-------|
| **Hetzner** | ~€3.29/month | 1 vCPU / 2GB RAM / 20GB SSD |
| **DigitalOcean** | $4/month | 0.5 vCPU / 512MB RAM / 10GB SSD |
| **Vultr** | $2.50/month | 1 vCPU / 512MB RAM / 10GB SSD |
| **Linode** | $5/month | 1 vCPU / 1GB RAM / 25GB SSD |

#### Pros
- ✅ Full control over environment
- ✅ Cheapest long-term option
- ✅ No vendor lock-in
- ✅ Persistent storage included
- ✅ Always-on

#### Cons
- ❌ **Manual server management** - OS updates, security patches
- ❌ **SSL certificate setup** - Let's Encrypt configuration
- ❌ **Process management** - PM2 or systemd setup
- ❌ **No auto-deploy** - Manual CI/CD or GitHub Actions
- ❌ **Monitoring/alerts** - Must set up yourself
- ❌ **Backup responsibility** - Manual backup strategy
- ❌ **WebSocket proxy config** - Nginx configuration needed

#### Deployment Complexity
```bash
# VPS requires:
1. SSH into server
2. Install Node.js, npm
3. Clone repository
4. Install dependencies
5. Configure environment variables
6. Set up PM2 for process management
7. Configure Nginx as reverse proxy
8. Set up SSL with Certbot
9. Configure firewall (UFW)
10. Set up log rotation
11. Configure backups
```

---

## Detailed Comparison Matrix

| Feature | Railway (Hobby) | Render (Hobby) | VPS (Hetzner) |
|---------|-----------------|----------------|---------------|
| **Monthly Cost** | ~$5-10 | $7 | ~$3.30 |
| **Always-On** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Persistent Storage** | ✅ 5GB | ✅ 2GB | ✅ 10-25GB |
| **Git Auto-Deploy** | ✅ Yes | ✅ Yes | ❌ Manual |
| **Custom Domain** | ✅ Yes | ✅ Yes | ✅ Manual |
| **Free SSL** | ✅ Yes | ✅ Yes | ⚠️ Let's Encrypt |
| **WebSocket Support** | ✅ Native | ✅ Native | ⚠️ Nginx config |
| **Zero-Config** | ✅ Yes | ✅ Yes | ❌ No |
| **Process Monitoring** | ✅ Built-in | ✅ Built-in | ⚠️ PM2/systemd |
| **Log Aggregation** | ✅ Built-in | ✅ Built-in | ⚠️ Manual |
| **Easy Rollback** | ✅ One-click | ✅ One-click | ❌ Manual |
| **Server Management** | ✅ None | ✅ None | ❌ Full responsibility |
| **Multi-Region** | ✅ Hobby+ | ✅ All plans | ⚠️ Manual setup |

---

## Recommendation: Railway.app (Hobby Plan)

### Why Railway is Best for Mission Control

1. **JSON Database Persistence**
   - Railway volumes ensure `db.json` survives restarts
   - Simple volume configuration in dashboard
   - No data loss on deployments

2. **Always-On Reliability**
   - Backend never sleeps (unlike Render free tier)
   - WebSocket connections remain stable
   - Agent ping/heartbeat system works continuously

3. **Developer Experience**
   - Fastest deployment (30-90 second builds)
   - Beautiful visual dashboard
   - One-click GitHub integration
   - Simple environment variable management

4. **Cost Efficiency**
   - $5/month Hobby plan is reasonable for a personal tool
   - Usage-based pricing means you pay for what you use
   - No surprise bills for low-traffic apps

5. **WebSocket Support**
   - Native WebSocket support without extra configuration
   - Real-time updates work out of the box
   - No Nginx proxy configuration needed

### Cost Estimate
For Mission Control's usage profile:
- **Expected cost:** $5-10/month on Hobby plan
- Includes: 1 service, ~0.5 vCPU usage, ~512MB RAM, small volume
- If usage grows: Pro plan at $20/month handles significant scale

---

## Deployment Guide: Railway.app

### Prerequisites
1. Railway account (sign up at railway.com)
2. GitHub account with mission-control repository
3. Domain name (optional, for custom domain)

### Step 1: Prepare the Backend for Deployment

#### 1.1 Update package.json
Ensure your `backend/package.json` has the correct start script:
```json
{
  "name": "mission-control-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "ws": "^8.14.2"
  }
}
```

#### 1.2 Update Database Path for Production
Modify `backend/src/database.js` to use an environment variable for data directory:

```javascript
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use environment variable for data directory (Railway volume mount point)
const DATA_DIR = process.env.DATA_DIR || join(__dirname, '../data');
const DB_FILE = join(DATA_DIR, 'db.json');

// ... rest of database.js remains the same
```

#### 1.3 Ensure PORT Uses Environment Variable
Your `backend/src/index.js` already has this:
```javascript
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`Mission Control API running on http://${HOST}:${PORT}`);
});
```

#### 1.4 Create railway.json (Optional)
For explicit configuration, create `backend/railway.json`:
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node src/index.js",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 1.5 Commit and Push to GitHub
```bash
cd /root/.openclaw/workspace/mission-control/backend
git add .
git commit -m "Prepare backend for Railway deployment"
git push origin main
```

---

### Step 2: Deploy to Railway

#### 2.1 Create New Project
1. Go to [railway.com/dashboard](https://railway.com/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `mission-control` repository

#### 2.2 Configure Service
1. Railway will auto-detect Node.js
2. Set the **Start Command**: `node src/index.js`
3. Click **Deploy**

#### 2.3 Add Persistent Volume (CRITICAL)
This step is essential for the JSON database to persist:

1. Click on your service in the project canvas
2. Go to **Settings** tab
3. Scroll to **Volumes** section
4. Click **"Add Volume"**
5. **Mount Path**: `/app/data`
6. Click **"Add"**
7. **Redeploy** the service

The volume will be mounted at `/app/data`, and our database.js will write to this location.

#### 2.4 Configure Environment Variables
1. Go to **Variables** tab
2. Add the following:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production mode |
| `DATA_DIR` | `/app/data` | Path to persistent volume |
| `HOST` | `0.0.0.0` | Bind to all interfaces |

Note: `PORT` is automatically set by Railway.

---

### Step 3: Configure Custom Domain (Optional)

#### 3.1 Generate Railway Domain
1. Go to **Settings** → **Networking**
2. Click **"Generate Domain"**
3. Railway provides: `your-service.up.railway.app`

#### 3.2 Use Custom Domain
1. In **Networking** section, click **"Custom Domain"**
2. Enter your domain: `api.yourdomain.com`
3. Railway provides DNS records (CNAME)
4. Add the CNAME record in your domain registrar
5. Wait for DNS propagation (usually 5-30 minutes)
6. Railway auto-provisions SSL certificate

---

### Step 4: Verify Deployment

#### 4.1 Check Health Endpoint
```bash
curl https://your-service.up.railway.app/api/health
```
Expected response:
```json
{"status":"ok","time":"2026-03-19T..."}
```

#### 4.2 Test API Endpoints
```bash
# Get stats
curl https://your-service.up.railway.app/api/stats

# Get tasks
curl https://your-service.up.railway.app/api/tasks

# Get agents
curl https://your-service.up.railway.app/api/agents
```

#### 4.3 Test WebSocket Connection
Open browser console on the Railway domain:
```javascript
const ws = new WebSocket('wss://your-service.up.railway.app');
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
ws.onopen = () => console.log('Connected!');
```

---

### Step 5: Update Frontend to Point to New Backend

#### 5.1 Update useApi.js
Edit `frontend/src/hooks/useApi.js` (or wherever `API_URL` is defined):

```javascript
// OLD (Cloudflare tunnel - unstable)
// const API_URL = 'https://equation-excess-sheets-defeat.trycloudflare.com/api';

// NEW (Railway - permanent)
const API_URL = 'https://your-service.up.railway.app/api';
// Or with custom domain:
// const API_URL = 'https://api.yourdomain.com/api';
```

#### 5.2 Rebuild and Redeploy Frontend
If hosting frontend on Vercel/Netlify:
```bash
cd /root/.openclaw/workspace/mission-control
npm run build
# Push to trigger Vercel/Netlify redeploy
git add .
git commit -m "Update API URL to Railway backend"
git push origin main
```

---

## Environment Variables Reference

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | Auto-set | - | Railway sets this automatically |
| `HOST` | No | `0.0.0.0` | Interface to bind to |
| `NODE_ENV` | No | `production` | Node environment |
| `DATA_DIR` | Yes | `/app/data` | Path to persistent volume |

### Frontend Environment Variables (if using .env)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://your-service.up.railway.app/api` |

---

## Maintenance and Operations

### Regular Backups
Although Railway volumes are persistent, implement backups:

#### Option 1: Manual Export
```bash
# Download db.json periodically
curl https://your-service.up.railway.app/api/backup > backup-$(date +%Y%m%d).json
```

#### Option 2: Automated Backup (Future Enhancement)
Add a cron job endpoint to backup to S3 or similar.

### Monitoring
Railway provides:
- **Metrics Dashboard**: CPU, RAM, disk usage
- **Logs**: Real-time streaming
- **Alerts**: Set up notifications for issues

### Updates and Redeploys
1. Push changes to GitHub
2. Railway auto-deploys
3. Volume persists data across deployments

---

## Troubleshooting

### Issue: Data Not Persisting
**Cause**: Volume not configured or wrong mount path
**Fix**: 
1. Verify volume mounted at `/app/data`
2. Check `DATA_DIR` environment variable
3. Redeploy service

### Issue: WebSocket Connection Failing
**Cause**: WebSocket URL mismatch or SSL issue
**Fix**:
1. Ensure using `wss://` for HTTPS domains
2. Check firewall/security group settings
3. Verify backend is binding to `0.0.0.0`

### Issue: Service Won't Start
**Cause**: Missing dependencies or wrong start command
**Fix**:
1. Check Railway logs
2. Verify `package.json` has correct `start` script
3. Ensure all dependencies are in `dependencies` (not `devDependencies`)

---

## Alternative: Render.com (If Railway Unavailable)

If Railway doesn't work out, Render is the second choice:

1. **Must use paid plan** ($7/month minimum for persistent features)
2. Add **Persistent Disk** in service settings
3. Mount path: `/var/data`
4. Update `DATA_DIR` to `/var/data`
5. All other steps similar to Railway

**Trade-off**: Slightly more expensive, but excellent reliability and longer track record.

---

## Alternative: VPS (Budget Option)

If cost is the primary concern and you have DevOps skills:

1. Hetzner Cloud CX11 (€3.29/month)
2. Ubuntu 22.04 LTS
3. Install Node.js 18+
4. Clone repository
5. Install PM2: `npm install -g pm2`
6. Configure Nginx reverse proxy
7. Set up Let's Encrypt SSL
8. Configure UFW firewall

**Trade-off**: More work upfront, full maintenance responsibility, but lowest cost.

---

## Conclusion

**Railway.app Hobby plan ($5/month)** is the optimal choice for Mission Control because it:
- Provides always-on service with no cold starts
- Supports persistent storage for the JSON database
- Offers the simplest deployment experience
- Handles SSL, domains, and WebSocket automatically
- Balances cost and convenience perfectly for this use case

The one-time setup effort will provide a permanent, stable backend that eliminates the Cloudflare tunnel instability issues.
