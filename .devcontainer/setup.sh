#!/bin/bash

# Nexus Home Link Dev Container Setup Script
echo "🚀 Setting up Nexus Home Link development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "NexusHomeLink.sln" ]; then
    print_error "Not in the correct directory. Please run this from the project root."
    exit 1
fi

print_status "Setting up .NET environment..."

# Trust development certificates
print_status "Trusting .NET development certificates..."
dotnet dev-certs https --trust || print_warning "Failed to trust certificates (this is normal in containers)"

# Restore .NET packages
print_status "Restoring .NET packages..."
if [ -f "NexusHomeLink.sln" ]; then
    dotnet restore || print_warning "Failed to restore .NET packages"
else
    print_warning "No .NET solution found, skipping .NET restore"
fi

# Restore backend packages
if [ -d "backend" ]; then
    print_status "Restoring backend packages..."
    cd backend
    dotnet restore || print_warning "Failed to restore backend packages"
    cd ..
fi

# Restore AppHost packages
if [ -d "NexusHomeLink.AppHost" ]; then
    print_status "Restoring AppHost packages..."
    cd NexusHomeLink.AppHost
    dotnet restore || print_warning "Failed to restore AppHost packages"
    cd ..
fi

print_status "Setting up Node.js environment..."

# Install frontend dependencies
if [ -d "frontend" ]; then
    print_status "Installing frontend dependencies..."
    cd frontend
    
    # Install pnpm if not available
    if ! command -v pnpm &> /dev/null; then
        print_status "Installing pnpm..."
        npm install -g pnpm@latest
    fi
    
    # Install dependencies
    pnpm install || print_warning "Failed to install frontend dependencies"
    
    cd ..
else
    print_warning "No frontend directory found, skipping frontend setup"
fi

print_status "Setting up development tools..."

# Install global npm packages for development
print_status "Installing global development tools..."
npm install -g @vue/cli typescript ts-node nodemon || print_warning "Failed to install some global packages"

# Set up Git configuration (if not already set)
if [ -z "$(git config --global user.name)" ]; then
    print_status "Setting up Git configuration..."
    git config --global user.name "Dev Container User"
    git config --global user.email "devcontainer@nexus-home-link.local"
    git config --global init.defaultBranch main
fi

# Create useful aliases
print_status "Creating development aliases..."
cat >> ~/.bashrc << 'EOF'

# Nexus Home Link Development Aliases
alias dev="dotnet run --project NexusHomeLink.AppHost"
alias dev-api="dotnet run --project backend/src/NexusHomeLink.Api"
alias dev-frontend="cd frontend && pnpm dev"
alias build="dotnet build"
alias test="dotnet test"
alias clean="dotnet clean && cd frontend && pnpm clean"
alias docker-build="docker build -f Dockerfile.minimal -t nexus-home-link ."
alias docker-run="docker run -p 3000:80 nexus-home-link"

# Quick navigation
alias cd-backend="cd backend/src/NexusHomeLink.Api"
alias cd-frontend="cd frontend"
alias cd-apphost="cd NexusHomeLink.AppHost"

# Git shortcuts
alias gs="git status"
alias ga="git add"
alias gc="git commit"
alias gp="git push"
alias gl="git log --oneline"

EOF

# Create a development script
print_status "Creating development helper script..."
cat > dev.sh << 'EOF'
#!/bin/bash

# Nexus Home Link Development Helper
case "$1" in
    "start")
        echo "🚀 Starting Nexus Home Link with .NET Aspire..."
        dotnet run --project NexusHomeLink.AppHost
        ;;
    "api")
        echo "🔧 Starting API only..."
        dotnet run --project backend/src/NexusHomeLink.Api
        ;;
    "frontend")
        echo "🎨 Starting frontend only..."
        cd frontend && pnpm dev
        ;;
    "build")
        echo "🔨 Building solution..."
        dotnet build
        ;;
    "test")
        echo "🧪 Running tests..."
        dotnet test
        ;;
    "docker")
        echo "🐳 Building Docker image..."
        docker build -f Dockerfile.minimal -t nexus-home-link .
        ;;
    "docker-run")
        echo "🐳 Running Docker container..."
        docker run -p 3000:80 nexus-home-link
        ;;
    *)
        echo "Nexus Home Link Development Helper"
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
        ;;
esac
EOF

chmod +x dev.sh

# Create a quick start guide
print_status "Creating quick start guide..."
cat > DEV-CONTAINER-QUICK-START.md << 'EOF'
# 🚀 Nexus Home Link - Dev Container Quick Start

## Getting Started

1. **Open in Dev Container**: Use VS Code's "Reopen in Container" command
2. **Start Development**: Run `./dev.sh start` to start with .NET Aspire
3. **Access Applications**:
   - Frontend: http://localhost:3000
   - API: http://localhost:5000
   - Aspire Dashboard: https://localhost:7443

## Available Commands

- `./dev.sh start` - Start with .NET Aspire (recommended)
- `./dev.sh api` - Start API only
- `./dev.sh frontend` - Start frontend only
- `./dev.sh build` - Build solution
- `./dev.sh test` - Run tests
- `./dev.sh docker` - Build Docker image
- `./dev.sh docker-run` - Run Docker container

## Development Workflow

1. **Make changes** to your code
2. **Hot reload** is enabled for both frontend and backend
3. **Test changes** using the running applications
4. **Build Docker image** when ready to deploy

## Troubleshooting

- **Port conflicts**: Check if ports 3000, 5000, 7026, 7443 are available
- **Certificate issues**: Run `dotnet dev-certs https --trust`
- **Dependencies**: Run `./dev.sh build` to restore packages
- **Docker issues**: Check Docker-in-Docker is working with `docker ps`

## Project Structure

```
├── frontend/          # Vue.js frontend
├── backend/           # .NET backend
├── NexusHomeLink.AppHost/  # .NET Aspire orchestration
└── .devcontainer/     # Dev Container configuration
```

Happy coding! 🎉
EOF

print_success "Dev Container setup complete!"
print_status "You can now run './dev.sh start' to begin development"
print_status "Or use 'Reopen in Container' in VS Code for the full experience"

echo ""
echo "🎉 Setup complete! Here's what's available:"
echo "   • Frontend: http://localhost:3000"
echo "   • API: http://localhost:5000"
echo "   • Aspire Dashboard: https://localhost:7443"
echo "   • Development script: ./dev.sh"
echo "   • Quick start guide: DEV-CONTAINER-QUICK-START.md"
echo ""

# Create clickable links for VS Code terminal
echo "🔗 Clickable links (VS Code terminal):"
echo "   Frontend:     http://localhost:3000"
echo "   API:          http://localhost:5000"
echo "   Aspire:       https://localhost:7443"
echo ""

# Create a startup script with clickable links
cat > start-with-links.sh << 'EOF'
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Nexus Home Link with .NET Aspire...${NC}"
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

# Start the development server
dotnet run --project NexusHomeLink.AppHost
EOF

chmod +x start-with-links.sh

echo "💡 Tip: Use './start-with-links.sh' for clickable links in VS Code terminal"
echo ""
