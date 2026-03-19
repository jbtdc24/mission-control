#!/bin/bash
cd /root/.openclaw/workspace/mission-control/backend
pkill -f "node.*index.js" 2>/dev/null
node src/index.js &
sleep 3
curl -s http://localhost:3001/api/health && echo "Backend OK" || echo "Backend failed"
