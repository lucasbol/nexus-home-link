#!/bin/bash

# Dev Container Attach Script
echo "🔗 Attaching to Nexus Home Link development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "NexusHomeLink.sln" ]; then
    echo "❌ Not in the correct directory. Please run this from the project root."
    exit 1
fi

# Display current status
echo "📊 Current project status:"
echo ""

# Check .NET solution
if [ -f "NexusHomeLink.sln" ]; then
    echo "✅ .NET solution found"
    echo "   • Backend API: backend/src/NexusHomeLink.Api"
    echo "   • AppHost: NexusHomeLink.AppHost"
else
    echo "❌ .NET solution not found"
fi

# Check frontend
if [ -d "frontend" ]; then
    echo "✅ Frontend found"
    echo "   • Vue.js application in frontend/"
    echo "   • Package manager: pnpm"
else
    echo "❌ Frontend not found"
fi

# Check Docker setup
if [ -f "Dockerfile.minimal" ]; then
    echo "✅ Docker configuration found"
    echo "   • Production Dockerfile: Dockerfile.minimal"
    echo "   • Docker Compose: docker-compose.yml"
else
    echo "❌ Docker configuration not found"
fi

echo ""
echo "🚀 Available commands:"
echo "   • ./dev.sh start     - Start with .NET Aspire"
echo "   • ./dev.sh api       - Start API only"
echo "   • ./dev.sh frontend  - Start frontend only"
echo "   • ./dev.sh build     - Build solution"
echo "   • ./dev.sh test      - Run tests"
echo "   • ./dev.sh docker    - Build Docker image"
echo "   • ./dev.sh docker-run - Run Docker container"
echo ""

# Check if development server is already running
if pgrep -f "dotnet run" > /dev/null; then
    echo "⚠️  Development server appears to be running already"
    echo ""
    echo "🔗 Clickable links (VS Code terminal):"
    echo "   Frontend:     http://localhost:3000"
    echo "   API:          http://localhost:5000"
    echo "   Aspire:       https://localhost:7443"
else
    echo "💡 To start development, run: ./dev.sh start"
    echo "   Or use: ./start-with-links.sh for clickable links"
fi

echo ""
echo "Happy coding! 🎉"
