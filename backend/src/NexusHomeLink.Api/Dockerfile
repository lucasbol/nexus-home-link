# Multi-stage build for .NET API
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project files
COPY ["NexusHomeLink.Api/NexusHomeLink.Api.csproj", "NexusHomeLink.Api/"]
COPY ["NexusHomeLink.Plugins.Core/NexusHomeLink.Plugins.Core.csproj", "NexusHomeLink.Plugins.Core/"]
COPY ["NexusHomeLink.Plugins.SystemMonitoring/NexusHomeLink.Plugins.SystemMonitoring.csproj", "NexusHomeLink.Plugins.SystemMonitoring/"]
COPY ["NexusHomeLink.Plugins.SmartHome/NexusHomeLink.Plugins.SmartHome.csproj", "NexusHomeLink.Plugins.SmartHome/"]
COPY ["NexusHomeLink.Plugins.Docker/NexusHomeLink.Plugins.Docker.csproj", "NexusHomeLink.Plugins.Docker/"]

# Restore dependencies
RUN dotnet restore "NexusHomeLink.Api/NexusHomeLink.Api.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/NexusHomeLink.Api"
RUN dotnet build "NexusHomeLink.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NexusHomeLink.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Create non-root user
RUN adduser --disabled-password --gecos '' appuser && chown -R appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["dotnet", "NexusHomeLink.Api.dll"]