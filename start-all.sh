#!/bin/bash

# Start all services for Nexus Home Link all-in-one container

set -e

echo "🚀 Starting Nexus Home Link..."

# Start SQL Server
echo "📊 Starting SQL Server..."
/opt/mssql/bin/sqlservr &
SQL_PID=$!

# Wait for SQL Server to be ready
echo "⏳ Waiting for SQL Server to be ready..."
sleep 30

# Start Redis
echo "🔴 Starting Redis..."
redis-server --daemonize yes

# Start .NET API
echo "🔧 Starting .NET API..."
cd /app/backend
dotnet NexusHomeLink.Api.dll &
API_PID=$!

# Wait for API to be ready
echo "⏳ Waiting for API to be ready..."
sleep 10

# Start Nginx
echo "🌐 Starting Nginx..."
nginx

echo "✅ All services started!"
echo "🌐 Dashboard: http://localhost"
echo "🔧 API: http://localhost/api"
echo "📊 Database: localhost:1433"
echo "🔴 Redis: localhost:6379"

# Keep container running
wait
