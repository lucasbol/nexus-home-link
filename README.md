# Nexus Home Link

A modern, full-stack homelab dashboard built with Vue 3 frontend and .NET Core backend, orchestrated with .NET Aspire. Monitor your homelab infrastructure with real-time data visualization, smart home integration, and comprehensive system monitoring through a plugin-based architecture.

## ✨ Features

### 🏠 **Overview Dashboard**

- System status at a glance with network status pills
- Weather information with real-time updates
- Quick access to all major services

### 📊 **System Monitoring**

- Real-time CPU, memory, and disk usage graphs
- Temperature monitoring with visual indicators
- Process monitoring and system load averages
- Interactive charts powered by Chart.js

### 🌐 **Network Topology**

- Interactive network visualization using D3.js force graphs
- Device discovery with IP addresses and VLAN information
- Clickable network nodes with detailed information
- Real-time network status updates

### 🏡 **Smart Home Integration**

- Room-specific smart home controls
- Home Assistant integration
- Automation logs and status monitoring
- Device state management

### 🎬 **Media & Storage**

- TMDB API integration for movie and TV show data
- Recently added content with poster carousels
- Clickable posters linking to TMDB pages
- Storage usage monitoring and statistics

### 🐳 **Docker Management**

- Container status monitoring
- Start/stop/restart container controls
- Resource usage tracking
- Container health indicators

### 🔒 **Security & Backup**

- Security alerts and threat monitoring
- Backup status tracking
- System security recommendations
- Alert management and notifications

### ⚙️ **Settings & Configuration**

- Theme management (Light/Dark/System)
- Network configuration
- Security settings
- Notification preferences
- About and system information

## 🛠️ Tech Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with custom components
- **Chart.js** - Beautiful, responsive charts and graphs
- **D3.js** - Data visualization and interactive graphics
- **Lucide Vue** - Beautiful, customizable icons
- **Pinia** - Intuitive state management for Vue
- **Axios** - HTTP client for API communication

### Backend
- **.NET 9** - Modern, cross-platform web framework
- **.NET Aspire** - Cloud-native application orchestration
- **Plugin Architecture** - Modular, extensible plugin system
- **Entity Framework Core** - Data access and ORM
- **SignalR** - Real-time communication (planned)
- **JWT Authentication** - Secure API authentication (planned)

### Development & Testing
- **Vitest** - Fast unit testing framework
- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **Docker** - Containerization support

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended) or npm
- **.NET 9 SDK**
- **Visual Studio 2022** or **VS Code** with C# extension

### Quick Start with .NET Aspire

```bash
# Clone the repository
git clone https://github.com/lucasbol/nexus-home-link.git
cd nexus-home-link

# Start everything with Aspire (recommended)
cd NexusHomeLink.AppHost
dotnet run

# This will start both frontend and backend automatically
# Frontend: https://localhost:3000
# Backend API: https://localhost:7443
# Aspire Dashboard: https://localhost:15000
```

### Manual Development Setup

#### Backend API
```bash
# Start the .NET API
cd backend/src/NexusHomeLink.Api
dotnet run

# API will be available at https://localhost:7443
```

#### Frontend
```bash
# Install frontend dependencies
cd frontend
pnpm install

# Start development server
pnpm dev

# Frontend will be available at http://localhost:3000
```

### Production Build

#### Frontend
```bash
cd frontend
pnpm build
# Built files will be in frontend/dist/
```

#### Backend
```bash
cd backend/src/NexusHomeLink.Api
dotnet publish -c Release
# Published files will be in bin/Release/net9.0/publish/
```

### Development Scripts

#### Frontend
```bash
cd frontend

# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Lint code
pnpm lint:check       # Check linting without fixing
pnpm format           # Format code
pnpm format:check     # Check formatting

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage

# Utilities
pnpm clean            # Clean dependencies and build files
```

#### Backend
```bash
cd backend/src/NexusHomeLink.Api

# Development
dotnet run            # Start API server
dotnet build          # Build project
dotnet test           # Run tests

# Database
dotnet ef migrations add <name>     # Add migration
dotnet ef database update          # Update database
```

## 📁 Project Structure

```
nexus-home-link/
├── frontend/                    # Vue 3 Frontend
│   ├── src/
│   │   ├── components/          # Vue components
│   │   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   │   ├── Dashboard*.vue  # Main dashboard components
│   │   │   ├── *Widget.vue     # Feature-specific widgets
│   │   │   └── ...
│   │   ├── composables/         # Vue composables for reusable logic
│   │   │   ├── useTheme.ts     # Theme management
│   │   │   ├── useDocker.ts    # Docker API integration
│   │   │   ├── useSmartHome.ts # Smart home integration
│   │   │   └── useSystemMonitoring.ts
│   │   ├── services/           # API services and external integrations
│   │   │   ├── api.ts          # Main API service
│   │   │   └── tmdb.ts         # TMDB API service
│   │   ├── stores/             # Pinia state management
│   │   │   └── useDashboardStore.ts
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions and helpers
│   │   ├── views/              # Page components
│   │   └── main.ts             # Application entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── backend/                     # .NET Core Backend
│   ├── src/
│   │   ├── NexusHomeLink.Api/          # Main API project
│   │   │   ├── Controllers/            # API controllers
│   │   │   ├── Program.cs              # Application entry point
│   │   │   └── appsettings.json        # Configuration
│   │   ├── NexusHomeLink.Plugins.Core/ # Plugin system core
│   │   │   ├── IDashboardPlugin.cs     # Plugin interface
│   │   │   └── PluginManager.cs        # Plugin management
│   │   ├── NexusHomeLink.Plugins.SystemMonitoring/  # System monitoring plugin
│   │   ├── NexusHomeLink.Plugins.SmartHome/         # Smart home plugin
│   │   └── NexusHomeLink.Plugins.Docker/            # Docker plugin
│   └── docker-compose.yml       # Docker services
├── NexusHomeLink.AppHost/       # .NET Aspire orchestration
│   ├── Program.cs               # Aspire configuration
│   └── NexusHomeLink.AppHost.csproj
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Frontend (`.env.local` in `frontend/` directory)
```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token

# Backend API Configuration
VITE_API_BASE_URL=https://localhost:7443/api
VITE_API_TIMEOUT=10000

# Feature Flags
VITE_ENABLE_MOCK_DATA=false
VITE_ENABLE_ANALYTICS=false
```

#### Backend (`appsettings.json` in `backend/src/NexusHomeLink.Api/`)
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Plugins": {
    "SystemMonitoring": {
      "Name": "SystemMonitoring",
      "Enabled": true
    },
    "SmartHome": {
      "Name": "SmartHome", 
      "Enabled": true
    },
    "Docker": {
      "Name": "Docker",
      "Enabled": true
    }
  }
}
```

### Plugin System

The backend uses a modular plugin architecture:

- **SystemMonitoring Plugin**: CPU, memory, disk usage, processes
- **SmartHome Plugin**: Device control, room management, automation
- **Docker Plugin**: Container management, resource monitoring

### TMDB Setup

1. Get your TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Add your API key to the frontend environment variables
3. See `TMDB_SETUP.md` for detailed setup instructions

## 🔌 Plugin Architecture

The backend uses a modular plugin system that allows for easy extension and customization:

### Core Plugin Interface

```csharp
public interface IDashboardPlugin
{
    string Name { get; }
    string Version { get; }
    string Description { get; }
    bool IsEnabled { get; }
    Task InitializeAsync();
    Task<object> ExecuteAsync(string action, object? parameters = null);
    Task<PluginStatus> GetStatusAsync();
    Task<IEnumerable<string>> GetAvailableActionsAsync();
}
```

### Available Plugins

- **SystemMonitoring**: CPU, memory, disk usage, process monitoring
- **SmartHome**: Device control, room management, automation logs
- **Docker**: Container management, resource monitoring, health checks

### API Endpoints

```
GET  /api/plugin                    # Get all plugins
GET  /api/plugin/{name}/status      # Get plugin status
GET  /api/plugin/{name}/actions     # Get available actions
POST /api/plugin/action             # Execute plugin action
```

### Adding New Plugins

1. Create a new project in `backend/src/NexusHomeLink.Plugins.YourPlugin/`
2. Implement `IDashboardPlugin` interface
3. Register the plugin in `appsettings.json`
4. Add plugin reference to the main API project

## 🎨 Customization

### Themes

- Light, Dark, and System theme support
- Customizable color schemes
- Responsive design for all screen sizes

### Components

- Built with shadcn/ui components
- Easily customizable with Tailwind CSS
- TypeScript support for all components

## 📱 Responsive Design

- **Mobile-first** approach
- **Tablet** and **desktop** optimized layouts
- **Touch-friendly** interface elements
- **Adaptive** navigation and controls

## 🚀 Deployment

### 🐳 Docker Deployment (Recommended for Homelabbers)

The easiest way to deploy Nexus Home Link is using Docker Compose. This will set up the entire stack with one command.

#### Quick Start

```bash
# Clone the repository
git clone https://github.com/lucasbol/nexus-home-link.git
cd nexus-home-link

# Run the deployment script (Linux/Mac)
chmod +x deploy.sh
./deploy.sh

# Or run manually
docker-compose up -d --build
```

#### Windows PowerShell

```powershell
# Clone the repository
git clone https://github.com/lucasbol/nexus-home-link.git
cd nexus-home-link

# Run the deployment script
.\deploy.ps1

# Or run manually
docker-compose up -d --build
```

#### What Gets Deployed

- **Frontend**: Vue 3 dashboard (http://localhost:3000)
- **Backend**: .NET API with plugin system (http://localhost:5000)
- **Database**: SQL Server 2022 (localhost:1433)
- **Cache**: Redis 7 (localhost:6379)
- **Reverse Proxy**: Nginx (optional, port 80/443)

#### Configuration

1. **Copy environment file**:
   ```bash
   cp env.example .env
   ```

2. **Edit `.env`** with your settings:
   ```env
   # TMDB API (optional)
   TMDB_API_KEY=your_api_key
   TMDB_ACCESS_TOKEN=your_access_token
   
   # Database password
   DB_PASSWORD=your_secure_password
   
   # Feature flags
   ENABLE_MOCK_DATA=true
   ```

#### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Update and restart
docker-compose pull && docker-compose up -d

# View service status
docker-compose ps

# Access specific service logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

#### Data Persistence

- **Database**: Stored in `sqlserver_data` Docker volume
- **Redis**: Stored in `redis_data` Docker volume
- **Certificates**: Stored in `./certs/` directory

#### Health Checks

All services include health checks:
- Frontend: `http://localhost:3000/health`
- Backend: `http://localhost:5000/health`
- Database: SQL connection test
- Redis: `redis-cli ping`

### Production Build

#### Frontend
```bash
cd frontend
pnpm build
# Deploy the 'dist' folder to your hosting provider
```

#### Backend
```bash
cd backend/src/NexusHomeLink.Api
dotnet publish -c Release -o ./publish
# Deploy the 'publish' folder to your server
```

### Cloud Deployment

#### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `cd frontend && pnpm build`
3. Set output directory: `frontend/dist`
4. Deploy!

#### Backend (Azure/AWS)
1. Build the .NET application
2. Deploy to your cloud provider
3. Configure environment variables
4. Set up database and cache services

### .NET Aspire Cloud Deployment

The project is designed to work with .NET Aspire cloud services:

1. Set up Aspire cloud resources
2. Deploy using `dotnet publish` and Aspire tooling
3. Configure cloud-specific settings
4. Monitor through Aspire dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### Frontend
- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible charting
- [D3.js](https://d3js.org/) - Data-driven documents
- [TMDB](https://www.themoviedb.org/) - The Movie Database API

### Backend
- [.NET](https://dotnet.microsoft.com/) - Modern, cross-platform development platform
- [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/) - Cloud-native application orchestration
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) - Data access and ORM
- [SignalR](https://learn.microsoft.com/en-us/aspnet/core/signalr/) - Real-time communication

### Development Tools
- [Vitest](https://vitest.dev/) - Fast unit testing framework
- [ESLint](https://eslint.org/) - Code linting and quality
- [Prettier](https://prettier.io/) - Code formatting
- [Docker](https://www.docker.com/) - Containerization platform
