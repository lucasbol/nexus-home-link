# Development startup script for Nexus Home Link
Write-Host "🚀 Starting Nexus Home Link Development Environment..." -ForegroundColor Green

# Start the backend API
Write-Host "📡 Starting Backend API..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/src/NexusHomeLink.Api; dotnet run --urls 'http://localhost:5000'"

# Wait a moment for the API to start
Start-Sleep -Seconds 3

# Start the frontend
Write-Host "⚡ Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; pnpm dev"

Write-Host "✅ Both services are starting up!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "📊 API Swagger: http://localhost:5000/swagger" -ForegroundColor Cyan
