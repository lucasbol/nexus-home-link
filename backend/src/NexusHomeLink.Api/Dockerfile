FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/NexusHomeLink.Api/NexusHomeLink.Api.csproj", "src/NexusHomeLink.Api/"]
COPY ["src/NexusHomeLink.Plugins.Core/NexusHomeLink.Plugins.Core.csproj", "src/NexusHomeLink.Plugins.Core/"]
COPY ["src/NexusHomeLink.Plugins.SystemMonitoring/NexusHomeLink.Plugins.SystemMonitoring.csproj", "src/NexusHomeLink.Plugins.SystemMonitoring/"]
COPY ["src/NexusHomeLink.Plugins.SmartHome/NexusHomeLink.Plugins.SmartHome.csproj", "src/NexusHomeLink.Plugins.SmartHome/"]
COPY ["src/NexusHomeLink.Plugins.Docker/NexusHomeLink.Plugins.Docker.csproj", "src/NexusHomeLink.Plugins.Docker/"]

RUN dotnet restore "src/NexusHomeLink.Api/NexusHomeLink.Api.csproj"
COPY . .
WORKDIR "/src/src/NexusHomeLink.Api"
RUN dotnet build "NexusHomeLink.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "NexusHomeLink.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NexusHomeLink.Api.dll"]
