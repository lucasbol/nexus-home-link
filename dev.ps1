# Nexus Home Link Development Helper (PowerShell)
param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "🚀 Nexus Home Link Development Helper" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev.ps1 [command]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Green
    Write-Host "  start     - Start with .NET Aspire (recommended)" -ForegroundColor White
    Write-Host "  api       - Start API only" -ForegroundColor White
    Write-Host "  frontend  - Start frontend only" -ForegroundColor White
    Write-Host "  build     - Build solution" -ForegroundColor White
    Write-Host "  test      - Run tests" -ForegroundColor White
    Write-Host "  docker    - Build Docker image" -ForegroundColor White
    Write-Host "  docker-run - Run Docker container" -ForegroundColor White
    Write-Host "  clean     - Clean solution" -ForegroundColor White
    Write-Host "  help      - Show this help" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\dev.ps1 start" -ForegroundColor Gray
    Write-Host "  .\dev.ps1 api" -ForegroundColor Gray
    Write-Host "  .\dev.ps1 docker" -ForegroundColor Gray
}

function Start-Development {
    Write-Host "🚀 Starting Nexus Home Link with .NET Aspire..." -ForegroundColor Green
    Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   • API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "   • Aspire Dashboard: https://localhost:7443" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the development server" -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path "NexusHomeLink.AppHost\NexusHomeLink.AppHost.csproj") {
        Set-Location "NexusHomeLink.AppHost"
        dotnet run
    } else {
        Write-Host "❌ AppHost project not found. Please run from the project root." -ForegroundColor Red
    }
}

function Start-API {
    Write-Host "🔧 Starting API only..." -ForegroundColor Green
    Write-Host "   • API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "backend\src\NexusHomeLink.Api\NexusHomeLink.Api.csproj") {
        Set-Location "backend\src\NexusHomeLink.Api"
        dotnet run
    } else {
        Write-Host "❌ API project not found. Please run from the project root." -ForegroundColor Red
    }
}

function Start-Frontend {
    Write-Host "🎨 Starting frontend only..." -ForegroundColor Green
    Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "frontend\package.json") {
        Set-Location "frontend"
        pnpm dev
    } else {
        Write-Host "❌ Frontend project not found. Please run from the project root." -ForegroundColor Red
    }
}

function Build-Solution {
    Write-Host "🔨 Building solution..." -ForegroundColor Green
    
    if (Test-Path "NexusHomeLink.sln") {
        dotnet build
    } else {
        Write-Host "❌ Solution file not found. Please run from the project root." -ForegroundColor Red
    }
}

function Test-Solution {
    Write-Host "🧪 Running tests..." -ForegroundColor Green
    
    if (Test-Path "NexusHomeLink.sln") {
        dotnet test
    } else {
        Write-Host "❌ Solution file not found. Please run from the project root." -ForegroundColor Red
    }
}

function Build-Docker {
    Write-Host "🐳 Building Docker image..." -ForegroundColor Green
    
    if (Test-Path "Dockerfile.minimal") {
        docker build -f Dockerfile.minimal -t nexus-home-link .
    } else {
        Write-Host "❌ Dockerfile.minimal not found. Please run from the project root." -ForegroundColor Red
    }
}

function Run-Docker {
    Write-Host "🐳 Running Docker container..." -ForegroundColor Green
    Write-Host "   • Application: http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    
    docker run -p 3000:80 nexus-home-link
}

function Clean-Solution {
    Write-Host "🧹 Cleaning solution..." -ForegroundColor Green
    
    if (Test-Path "NexusHomeLink.sln") {
        dotnet clean
    }
    
    if (Test-Path "frontend") {
        Set-Location "frontend"
        if (Test-Path "node_modules") {
            Remove-Item -Recurse -Force "node_modules"
        }
        if (Test-Path "dist") {
            Remove-Item -Recurse -Force "dist"
        }
        Set-Location ".."
    }
    
    Write-Host "✅ Clean complete!" -ForegroundColor Green
}

# Main command handling
switch ($Command.ToLower()) {
    "start" { Start-Development }
    "api" { Start-API }
    "frontend" { Start-Frontend }
    "build" { Build-Solution }
    "test" { Test-Solution }
    "docker" { Build-Docker }
    "docker-run" { Run-Docker }
    "clean" { Clean-Solution }
    "help" { Show-Help }
    default { 
        Write-Host "❌ Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
