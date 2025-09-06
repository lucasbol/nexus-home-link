# 🐳 Dev Container Setup for Nexus Home Link

This project includes a complete Dev Container setup that provides a consistent, reproducible development environment for homelab enthusiasts. No need to install .NET, Node.js, or any other dependencies on your local machine!

## 🚀 Quick Start

### Option 1: VS Code Dev Containers (Recommended)

1. **Install Prerequisites**:
   - [VS Code](https://code.visualstudio.com/)
   - [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Open in Container**:
   ```bash
   # Clone the repository
   git clone https://github.com/lucasbol/nexus-home-link.git
   cd nexus-home-link
   
   # Open in VS Code
   code .
   ```

3. **Reopen in Container**:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Dev Containers: Reopen in Container"
   - Wait for the container to build and start

4. **Start Development**:
   ```bash
   ./dev.sh start
   ```

### Option 2: Manual Docker Compose

```bash
# Clone the repository
git clone https://github.com/lucasbol/nexus-home-link.git
cd nexus-home-link

# Start the dev container
docker-compose -f .devcontainer/docker-compose.yml up -d

# Attach to the container
docker-compose -f .devcontainer/docker-compose.yml exec devcontainer bash

# Start development
./dev.sh start
```

## 🛠️ What's Included

### Development Environment
- **.NET 9 SDK** - Latest .NET with all tools
- **Node.js 20 LTS** - For Vue.js frontend development
- **pnpm** - Fast, disk space efficient package manager
- **Docker-in-Docker** - For testing containerized deployment
- **Git** - Version control
- **VS Code Server** - Full VS Code experience in the container

### Pre-installed Tools
- `dotnet-ef` - Entity Framework tools
- `dotnet-aspnet-codegenerator` - ASP.NET Core scaffolding
- Docker CLI - For container management
- Various development utilities (curl, wget, jq, vim, etc.)

### VS Code Extensions
- **.NET Development**: C# support, .NET runtime, Blazor tools
- **Vue.js Development**: Volar, TypeScript support, Tailwind CSS
- **Docker & DevOps**: Docker support, YAML support
- **General Development**: Prettier, ESLint, GitLens, GitHub PR

## 🎯 Development Workflow

### Starting Development
```bash
# Start everything with .NET Aspire (recommended)
./dev.sh start

# Or start components individually
./dev.sh api       # Backend API only
./dev.sh frontend  # Frontend only
```

### Available Commands
```bash
./dev.sh start      # Start with .NET Aspire
./dev.sh api        # Start API only
./dev.sh frontend   # Start frontend only
./dev.sh build      # Build solution
./dev.sh test       # Run tests
./dev.sh docker     # Build Docker image
./dev.sh docker-run # Run Docker container
```

### Access Points
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5000
- **Aspire Dashboard**: https://localhost:7443
- **PostgreSQL**: localhost:5432 (if enabled)
- **Redis**: localhost:6379 (if enabled)

## 🔧 Configuration

### Environment Variables
The Dev Container sets up these environment variables:
```bash
ASPNETCORE_ENVIRONMENT=Development
DOTNET_ENVIRONMENT=Development
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:5000/api
```

### Port Forwarding
The following ports are automatically forwarded:
- `3000` - Frontend (Vue.js)
- `5000` - Backend API (HTTP)
- `7026` - Backend API (HTTPS)
- `7443` - Aspire Dashboard

### Volumes
- **Workspace**: Your code is mounted at `/workspace`
- **Extensions**: VS Code extensions are persisted
- **Node Modules**: Frontend dependencies are cached
- **NuGet Packages**: .NET packages are cached

## 🐳 Docker-in-Docker

The Dev Container includes Docker-in-Docker support, allowing you to:
- Build and test Docker images
- Run `docker-compose` commands
- Test containerized deployment
- Use Docker for development databases

### Testing Docker Build
```bash
# Build the production image
./dev.sh docker

# Run the containerized app
./dev.sh docker-run

# Or manually
docker build -f Dockerfile.minimal -t nexus-home-link .
docker run -p 3000:80 nexus-home-link
```

## 🚀 Deployment Testing

### Local Docker Testing
```bash
# Build and test the minimal Docker image
./dev.sh docker
./dev.sh docker-run

# Test with Docker Compose
docker-compose -f docker-compose.minimal.yml up
```

### Production Deployment
```bash
# Build for production
docker build -f Dockerfile.minimal -t nexus-home-link .

# Deploy to your homelab
docker run -d -p 3000:80 --name nexus-dashboard nexus-home-link
```

## 🔍 Troubleshooting

### Common Issues

**Port Conflicts**:
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000

# Kill processes if needed
sudo kill -9 <PID>
```

**Certificate Issues**:
```bash
# Trust development certificates
dotnet dev-certs https --trust
```

**Docker Issues**:
```bash
# Check Docker is running
docker ps

# Restart Docker service
sudo systemctl restart docker
```

**Dependencies**:
```bash
# Restore .NET packages
dotnet restore

# Install frontend dependencies
cd frontend && pnpm install
```

### Reset Environment
```bash
# Clean everything
./dev.sh clean

# Rebuild the container
docker-compose -f .devcontainer/docker-compose.yml down
docker-compose -f .devcontainer/docker-compose.yml up --build
```

## 📁 Project Structure

```
nexus-home-link/
├── .devcontainer/           # Dev Container configuration
│   ├── devcontainer.json    # Main Dev Container config
│   ├── docker-compose.yml   # Multi-service setup
│   ├── Dockerfile          # Dev Container image
│   ├── setup.sh            # Initial setup script
│   ├── start.sh            # Start script
│   └── attach.sh           # Attach script
├── frontend/                # Vue.js frontend
├── backend/                 # .NET backend
├── NexusHomeLink.AppHost/   # .NET Aspire orchestration
├── docker-compose.yml       # Production Docker Compose
├── Dockerfile.minimal       # Production Docker image
└── dev.sh                   # Development helper script
```

## 🎉 Benefits

### For Homelab Enthusiasts
- **Zero Setup**: No need to install .NET, Node.js, or other dependencies
- **Consistent Environment**: Same setup works on Windows, Mac, Linux
- **Easy Sharing**: Share the entire development environment with others
- **Production Testing**: Test Docker deployment locally

### For Developers
- **Isolated Environment**: No conflicts with local installations
- **Reproducible**: Same environment for all team members
- **Fast Onboarding**: New developers can start immediately
- **Full Tooling**: All necessary tools pre-installed and configured

## 🤝 Contributing

1. **Fork the repository**
2. **Open in Dev Container** (VS Code)
3. **Make your changes**
4. **Test with `./dev.sh test`**
5. **Submit a pull request**

## 📚 Additional Resources

- [VS Code Dev Containers](https://code.visualstudio.com/docs/remote/containers)
- [.NET Aspire Documentation](https://learn.microsoft.com/en-us/dotnet/aspire/)
- [Vue.js Documentation](https://vuejs.org/)
- [Docker Documentation](https://docs.docker.com/)

---

**Happy coding! 🎉** The Dev Container setup makes it incredibly easy to get started with Nexus Home Link development, whether you're a seasoned developer or just getting started with homelab projects.
