# Nexus Home Link - Docker Deployment Script (PowerShell)
# This script helps homelabbers easily deploy the dashboard

Write-Host "🚀 Nexus Home Link - Docker Deployment" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "✅ .env file created. Please edit it with your configuration." -ForegroundColor Green
}

# Create certificates directory
if (-not (Test-Path certs)) {
    New-Item -ItemType Directory -Path certs
}

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Yellow
docker-compose up -d --build

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check service health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your dashboard:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "   Database: localhost:1433" -ForegroundColor White
Write-Host "   Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "📊 Monitor with:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f" -ForegroundColor White
Write-Host "   docker-compose ps" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Stop with:" -ForegroundColor Cyan
Write-Host "   docker-compose down" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Update with:" -ForegroundColor Cyan
Write-Host "   docker-compose pull && docker-compose up -d" -ForegroundColor White
