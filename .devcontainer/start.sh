#!/bin/bash

# Dev Container Start Script
echo "🚀 Starting Nexus Home Link development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "NexusHomeLink.sln" ]; then
    echo "❌ Not in the correct directory. Please run this from the project root."
    exit 1
fi

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Start the development environment
echo -e "${GREEN}🔧 Starting .NET Aspire development environment...${NC}"
echo ""
echo -e "${BLUE}🔗 Clickable links (VS Code terminal):${NC}"
echo -e "   Frontend:     ${CYAN}http://localhost:3000${NC}"
echo -e "   API:          ${CYAN}http://localhost:5000${NC}"
echo -e "   Aspire:       ${CYAN}https://localhost:7443${NC}"
echo ""

# Start frontend in a separate terminal if available
echo -e "${GREEN}🎨 Starting frontend in separate terminal...${NC}"
if command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="Nexus Home Link - Frontend" -- bash -c "cd frontend && pnpm dev; exec bash" &
elif command -v xterm &> /dev/null; then
    xterm -title "Nexus Home Link - Frontend" -e "cd frontend && pnpm dev" &
elif command -v konsole &> /dev/null; then
    konsole --title "Nexus Home Link - Frontend" -e bash -c "cd frontend && pnpm dev; exec bash" &
else
    echo -e "${YELLOW}⚠️  No terminal emulator found. Frontend will run in background.${NC}"
    echo -e "   You can start it manually with: ./dev.sh frontend"
    # Start frontend in background
    cd frontend && pnpm dev &
    cd ..
fi

echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the development server${NC}"
echo ""

# Start with .NET Aspire
dotnet run --project NexusHomeLink.AppHost
