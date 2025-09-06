# 🚀 Quick Start - Single Docker Run

The simplest way to run Nexus Home Link is with a single `docker run` command!

## One-Line Deployment

```bash
# Run the dashboard (uses mock data)
docker run -p 2244:80 ghcr.io/lucasbol/nexus-home-link:latest
```

That's it! 🎉

## Access Your Dashboard

- **Dashboard**: http://localhost:2244
- **API**: http://localhost:2244/api
- **API Docs**: http://localhost:2244/swagger

## What You Get

- ✅ Vue 3 frontend dashboard
- ✅ .NET backend API with plugin system
- ✅ Mock data (no database needed)
- ✅ All features working out of the box
- ✅ Health checks included

## Configuration (Optional)

```bash
# With custom environment variables
docker run -p 2244:80 \
  -e VITE_TMDB_API_KEY=your_key \
  -e VITE_TMDB_ACCESS_TOKEN=your_token \
  ghcr.io/lucasbol/nexus-home-link:latest
```

## Development Mode

```bash
# Run with hot reload (for development)
docker run -p 2244:80 \
  -v $(pwd)/frontend:/app/frontend \
  ghcr.io/lucasbol/nexus-home-link:dev
```

## Production with Database

```bash
# Full stack with database
docker run -p 3000:80 -p 1433:1433 -p 6379:6379 \
  -e ENABLE_DATABASE=true \
  ghcr.io/lucasbol/nexus-home-link:full
```

## Why This is Great

- **Zero setup** - Just Docker and one command
- **Self-contained** - Everything in one image
- **Fast startup** - Ready in seconds
- **Easy updates** - `docker pull` and restart
- **Cross-platform** - Works everywhere Docker works

## Troubleshooting

```bash
# Check if it's running
docker ps

# View logs
docker logs <container_id>

# Stop it
docker stop <container_id>

# Remove it
docker rm <container_id>
```

## That's It!

No Docker Compose, no configuration files, no complex setup. Just one command and you're running! 🚀
