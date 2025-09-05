using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NexusHomeLink.Plugins.Core;

namespace NexusHomeLink.Plugins.Docker
{
    /// <summary>
    /// Docker plugin for container management
    /// </summary>
    public class DockerPlugin : IDashboardPlugin
    {
        public string Name => "Docker";
        public string Version => "1.0.0";
        public string Description => "Manages Docker containers and images";
        public bool IsEnabled { get; private set; } = true;

        private readonly List<DockerContainer> _containers = new();
        private readonly List<string> _availableActions = new()
        {
            "get-containers",
            "get-container",
            "start-container",
            "stop-container",
            "restart-container",
            "get-container-logs",
            "get-images"
        };

        public async Task InitializeAsync()
        {
            // Initialize with mock data
            await InitializeMockContainersAsync();
        }

        public async Task<object> ExecuteAsync(string action, object parameters = null)
        {
            return action switch
            {
                "get-containers" => await GetContainersAsync(),
                "get-container" => await GetContainerAsync(parameters),
                "start-container" => await StartContainerAsync(parameters),
                "stop-container" => await StopContainerAsync(parameters),
                "restart-container" => await RestartContainerAsync(parameters),
                "get-container-logs" => await GetContainerLogsAsync(parameters),
                "get-images" => await GetImagesAsync(),
                _ => throw new NotSupportedException($"Action {action} not supported")
            };
        }

        public async Task<PluginStatus> GetStatusAsync()
        {
            return await Task.FromResult(new PluginStatus
            {
                Name = Name,
                Version = Version,
                IsEnabled = IsEnabled,
                Status = "Running",
                LastUpdate = DateTime.UtcNow,
                Metrics = new Dictionary<string, object>
                {
                    ["TotalContainers"] = _containers.Count,
                    ["RunningContainers"] = _containers.Count(c => c.Status == "running"),
                    ["StoppedContainers"] = _containers.Count(c => c.Status == "stopped"),
                    ["AvailableActions"] = _availableActions.Count
                }
            });
        }

        public async Task<IEnumerable<string>> GetAvailableActionsAsync()
        {
            return await Task.FromResult(_availableActions);
        }

        private async Task InitializeMockContainersAsync()
        {
            _containers.AddRange(new[]
            {
                new DockerContainer
                {
                    Id = "nginx-1",
                    Name = "nginx",
                    Image = "nginx:latest",
                    Status = "running",
                    Ports = new[] { "80:80", "443:443" },
                    Created = DateTime.UtcNow.AddDays(-2),
                    Uptime = "2d 5h 30m",
                    Cpu = 2.5,
                    Memory = 128,
                    MemoryLimit = 256,
                    Network = "bridge"
                },
                new DockerContainer
                {
                    Id = "postgres-1",
                    Name = "postgres",
                    Image = "postgres:15",
                    Status = "running",
                    Ports = new[] { "5432:5432" },
                    Created = DateTime.UtcNow.AddDays(-7),
                    Uptime = "7d 12h 45m",
                    Cpu = 8.2,
                    Memory = 512,
                    MemoryLimit = 1024,
                    Network = "bridge"
                },
                new DockerContainer
                {
                    Id = "redis-1",
                    Name = "redis",
                    Image = "redis:7",
                    Status = "running",
                    Ports = new[] { "6379:6379" },
                    Created = DateTime.UtcNow.AddDays(-5),
                    Uptime = "5d 8h 15m",
                    Cpu = 1.8,
                    Memory = 64,
                    MemoryLimit = 128,
                    Network = "bridge"
                },
                new DockerContainer
                {
                    Id = "mongodb-1",
                    Name = "mongodb",
                    Image = "mongo:6",
                    Status = "stopped",
                    Ports = new[] { "27017:27017" },
                    Created = DateTime.UtcNow.AddDays(-10),
                    Uptime = "0m",
                    Cpu = 0,
                    Memory = 0,
                    MemoryLimit = 512,
                    Network = "bridge"
                }
            });

            await Task.CompletedTask;
        }

        private async Task<object> GetContainersAsync()
        {
            return await Task.FromResult(_containers);
        }

        private async Task<object> GetContainerAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("containerId"))
            {
                throw new ArgumentException("containerId parameter is required");
            }

            var containerId = paramDict["containerId"].ToString();
            var container = _containers.FirstOrDefault(c => c.Id == containerId);
            
            if (container == null)
            {
                throw new ArgumentException($"Container with ID {containerId} not found");
            }

            return await Task.FromResult(container);
        }

        private async Task<object> StartContainerAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("containerId"))
            {
                throw new ArgumentException("containerId parameter is required");
            }

            var containerId = paramDict["containerId"].ToString();
            var container = _containers.FirstOrDefault(c => c.Id == containerId);
            
            if (container == null)
            {
                throw new ArgumentException($"Container with ID {containerId} not found");
            }

            if (container.Status == "running")
            {
                throw new InvalidOperationException($"Container {container.Name} is already running");
            }

            // Simulate starting container
            container.Status = "running";
            container.Uptime = "0m";
            container.Cpu = 0;
            container.Memory = 0;

            return await Task.FromResult(new { Success = true, Container = container });
        }

        private async Task<object> StopContainerAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("containerId"))
            {
                throw new ArgumentException("containerId parameter is required");
            }

            var containerId = paramDict["containerId"].ToString();
            var container = _containers.FirstOrDefault(c => c.Id == containerId);
            
            if (container == null)
            {
                throw new ArgumentException($"Container with ID {containerId} not found");
            }

            if (container.Status == "stopped")
            {
                throw new InvalidOperationException($"Container {container.Name} is already stopped");
            }

            // Simulate stopping container
            container.Status = "stopped";
            container.Uptime = "0m";
            container.Cpu = 0;
            container.Memory = 0;

            return await Task.FromResult(new { Success = true, Container = container });
        }

        private async Task<object> RestartContainerAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("containerId"))
            {
                throw new ArgumentException("containerId parameter is required");
            }

            var containerId = paramDict["containerId"].ToString();
            var container = _containers.FirstOrDefault(c => c.Id == containerId);
            
            if (container == null)
            {
                throw new ArgumentException($"Container with ID {containerId} not found");
            }

            // Simulate restarting container
            container.Status = "running";
            container.Uptime = "0m";
            container.Cpu = 0;
            container.Memory = 0;

            return await Task.FromResult(new { Success = true, Container = container });
        }

        private async Task<object> GetContainerLogsAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("containerId"))
            {
                throw new ArgumentException("containerId parameter is required");
            }

            var containerId = paramDict["containerId"].ToString();
            var container = _containers.FirstOrDefault(c => c.Id == containerId);
            
            if (container == null)
            {
                throw new ArgumentException($"Container with ID {containerId} not found");
            }

            // Simulate container logs
            var logs = new[]
            {
                $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] Container {container.Name} started",
                $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] Application initialized",
                $"[{DateTime.UtcNow:yyyy-MM-dd HH:mm:ss}] Ready to accept connections"
            };

            return await Task.FromResult(new { ContainerId = containerId, Logs = logs });
        }

        private async Task<object> GetImagesAsync()
        {
            var images = new[]
            {
                new { Name = "nginx", Tag = "latest", Size = "142MB", Created = DateTime.UtcNow.AddDays(-30) },
                new { Name = "postgres", Tag = "15", Size = "376MB", Created = DateTime.UtcNow.AddDays(-15) },
                new { Name = "redis", Tag = "7", Size = "117MB", Created = DateTime.UtcNow.AddDays(-20) },
                new { Name = "mongo", Tag = "6", Size = "699MB", Created = DateTime.UtcNow.AddDays(-25) }
            };

            return await Task.FromResult(images);
        }
    }

    /// <summary>
    /// Docker container model
    /// </summary>
    public class DockerContainer
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string[] Ports { get; set; } = Array.Empty<string>();
        public DateTime Created { get; set; }
        public string Uptime { get; set; } = string.Empty;
        public double Cpu { get; set; }
        public long Memory { get; set; }
        public long MemoryLimit { get; set; }
        public string Network { get; set; } = string.Empty;
    }
}
