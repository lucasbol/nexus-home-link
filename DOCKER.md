# 🐳 Docker Deployment Guide

This guide helps homelabbers easily deploy Nexus Home Link using Docker.

## Quick Start

### Option 1: Full Stack (Recommended)
```bash
# Clone and deploy everything
git clone https://github.com/lucasbol/nexus-home-link.git
cd nexus-home-link
docker-compose up -d --build
```

### Option 2: Minimal Setup (Frontend + Backend only)
```bash
# Deploy without database (uses mock data)
docker-compose -f docker-compose.minimal.yml up -d --build
```

### Option 3: Using Deployment Scripts
```bash
# Linux/Mac
chmod +x deploy.sh && ./deploy.sh

# Windows PowerShell
.\deploy.ps1
```

## What's Included

### Full Stack (`docker-compose.yml`)
- **Frontend**: Vue 3 dashboard (port 3000)
- **Backend**: .NET API (port 5000)
- **Database**: SQL Server 2022 (port 1433)
- **Cache**: Redis 7 (port 6379)
- **Proxy**: Nginx (port 80/443)

### Minimal Stack (`docker-compose.minimal.yml`)
- **Frontend**: Vue 3 dashboard (port 3000)
- **Backend**: .NET API (port 5000)

## Configuration

1. **Copy environment template**:
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

## Access Points

- **Dashboard**: http://localhost:3000
- **API**: http://localhost:5000
- **API Docs**: http://localhost:5000/swagger
- **Database**: localhost:1433 (sa/NexusHomeLink123!)
- **Redis**: localhost:6379

## Management Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Update services
docker-compose pull && docker-compose up -d

# View service status
docker-compose ps

# Restart specific service
docker-compose restart frontend
docker-compose restart backend

# View specific logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Rebuild containers
docker-compose up -d --build --force-recreate
```

### Database connection issues
```bash
# Check database logs
docker-compose logs sqlserver

# Restart database
docker-compose restart sqlserver
```

### Frontend not loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Port conflicts
Edit `docker-compose.yml` to change ports:
```yaml
ports:
  - "3001:80"  # Change 3000 to 3001
```

## Data Persistence

- **Database data**: Stored in `sqlserver_data` volume
- **Redis data**: Stored in `redis_data` volume
- **Certificates**: Stored in `./certs/` directory

To backup data:
```bash
# Backup database
docker run --rm -v nexus-home-link_sqlserver_data:/data -v $(pwd):/backup alpine tar czf /backup/sqlserver-backup.tar.gz -C /data .

# Backup Redis
docker run --rm -v nexus-home-link_redis_data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz -C /data .
```

## Security Notes

- Change default passwords in production
- Use proper SSL certificates
- Consider using Docker secrets for sensitive data
- Regularly update base images

## Support

- Check logs: `docker-compose logs -f`
- View service status: `docker-compose ps`
- Restart services: `docker-compose restart`
- Full reset: `docker-compose down -v && docker-compose up -d --build`
