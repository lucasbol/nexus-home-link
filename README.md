# BOLCAT HOMELAB Dashboard

A modern, responsive homelab dashboard built with Vue 3, TypeScript, and Tailwind CSS. Monitor your homelab infrastructure with real-time data visualization, smart home integration, and comprehensive system monitoring.

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

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework with custom components
- **Chart.js** - Beautiful, responsive charts and graphs
- **D3.js** - Data visualization and interactive graphics
- **Lucide Vue** - Beautiful, customizable icons
- **Pinia** - Intuitive state management for Vue
- **Vue Router** - Official router for Vue.js

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/lucasbol/nexus-home-link.git
cd nexus-home-link

# Install dependencies with pnpm (recommended)
pnpm install

# Or with npm
npm install
```

### Development

```bash
# Start development server
pnpm dev
# or
npm run dev

# The app will be available at http://localhost:3000
```

### Production Build

```bash
# Build for production
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm run preview
```

### Additional Scripts

```bash
# Type checking
pnpm type-check

# Lint code
pnpm lint

# Clean dependencies
pnpm clean
```

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   ├── Dashboard*.vue  # Main dashboard components
│   ├── *Widget.vue     # Feature-specific widgets
│   └── ...
├── composables/         # Vue composables for reusable logic
│   ├── useTheme.ts     # Theme management
│   ├── useTMDB.ts      # TMDB API integration
│   └── useBackgroundImage.ts
├── services/           # API services and external integrations
│   └── tmdb.ts         # TMDB API service
├── lib/                # Utility functions and helpers
│   └── utils.ts        # Common utilities
├── views/              # Page components
│   ├── Dashboard.vue   # Main dashboard view
│   └── NotFound.vue    # 404 page
├── style.css           # Global styles
└── main.ts             # Application entry point
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token

# API Endpoints (optional)
VITE_API_BASE_URL=http://localhost:8080/api
```

### TMDB Setup

1. Get your TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api)
2. Add your API key to the environment variables
3. See `TMDB_SETUP.md` for detailed setup instructions

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

### Build for Production

```bash
# Build the application
pnpm build

# The built files will be in the 'dist' directory
```

### Deploy to Vercel/Netlify

The project is ready for deployment on modern hosting platforms:

1. Connect your GitHub repository
2. Set build command: `pnpm build`
3. Set output directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Chart.js](https://www.chartjs.org/) - Simple yet flexible charting
- [D3.js](https://d3js.org/) - Data-driven documents
- [TMDB](https://www.themoviedb.org/) - The Movie Database API
