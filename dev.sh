#!/usr/bin/env bash  
docker compose up -d db backend
docker compose stop frontend 2>/dev/null
cd frontend && npm run dev   