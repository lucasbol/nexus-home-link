#!/bin/bash

# Nexus Home Link - Docker Deployment Script
# This script helps homelabbers easily deploy the dashboard

set -e

echo "🚀 Nexus Home Link - Docker Deployment"
echo "======================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please edit it with your configuration."
fi

# Create certificates directory
mkdir -p certs

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Access your dashboard:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Database: localhost:1433"
echo "   Redis: localhost:6379"
echo ""
echo "📊 Monitor with:"
echo "   docker-compose logs -f"
echo "   docker-compose ps"
echo ""
echo "🛑 Stop with:"
echo "   docker-compose down"
echo ""
echo "🔄 Update with:"
echo "   docker-compose pull && docker-compose up -d"
