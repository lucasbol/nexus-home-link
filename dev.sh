#!/bin/bash

# Nexus Home Link Development Helper
case "$1" in
    "start")
        echo "🚀 Starting Nexus Home Link with .NET Aspire..."
        echo "   • Frontend: http://localhost:3000"
        echo "   • API: http://localhost:5000"
        echo "   • Aspire Dashboard: https://localhost:7443"
        echo ""
        echo "Press Ctrl+C to stop the development server"
        echo ""
        
        if [ -f "NexusHomeLink.AppHost/NexusHomeLink.AppHost.csproj" ]; then
            cd NexusHomeLink.AppHost
            dotnet run
        else
            echo "❌ AppHost project not found. Please run from the project root."
            exit 1
        fi
        ;;
    "api")
        echo "🔧 Starting API only..."
        echo "   • API: http://localhost:5000"
        echo ""
        
        if [ -f "backend/src/NexusHomeLink.Api/NexusHomeLink.Api.csproj" ]; then
            cd backend/src/NexusHomeLink.Api
            dotnet run
        else
            echo "❌ API project not found. Please run from the project root."
            exit 1
        fi
        ;;
    "frontend")
        echo "🎨 Starting frontend only..."
        echo "   • Frontend: http://localhost:3000"
        echo ""
        
        if [ -f "frontend/package.json" ]; then
            cd frontend
            pnpm dev
        else
            echo "❌ Frontend project not found. Please run from the project root."
            exit 1
        fi
        ;;
    "build")
        echo "🔨 Building solution..."
        
        if [ -f "NexusHomeLink.sln" ]; then
            dotnet build
        else
            echo "❌ Solution file not found. Please run from the project root."
            exit 1
        fi
        ;;
    "test")
        echo "🧪 Running tests..."
        
        if [ -f "NexusHomeLink.sln" ]; then
            dotnet test
        else
            echo "❌ Solution file not found. Please run from the project root."
            exit 1
        fi
        ;;
    "docker")
        echo "🐳 Building Docker image..."
        
        if [ -f "Dockerfile.minimal" ]; then
            docker build -f Dockerfile.minimal -t nexus-home-link .
        else
            echo "❌ Dockerfile.minimal not found. Please run from the project root."
            exit 1
        fi
        ;;
    "docker-run")
        echo "🐳 Running Docker container..."
        echo "   • Application: http://localhost:3000"
        echo ""
        
        docker run -p 3000:80 nexus-home-link
        ;;
    "clean")
        echo "🧹 Cleaning solution..."
        
        if [ -f "NexusHomeLink.sln" ]; then
            dotnet clean
        fi
        
        if [ -d "frontend" ]; then
            cd frontend
            rm -rf node_modules dist
            cd ..
        fi
        
        echo "✅ Clean complete!"
        ;;
    "help"|*)
        echo "🚀 Nexus Home Link Development Helper"
        echo ""
        echo "Usage: ./dev.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start     - Start with .NET Aspire (recommended)"
        echo "  api       - Start API only"
        echo "  frontend  - Start frontend only"
        echo "  build     - Build solution"
        echo "  test      - Run tests"
        echo "  docker    - Build Docker image"
        echo "  docker-run - Run Docker container"
        echo "  clean     - Clean solution"
        echo "  help      - Show this help"
        echo ""
        echo "Examples:"
        echo "  ./dev.sh start"
        echo "  ./dev.sh api"
        echo "  ./dev.sh docker"
        ;;
esac
