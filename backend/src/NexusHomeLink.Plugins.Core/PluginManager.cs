using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace NexusHomeLink.Plugins.Core
{
    /// <summary>
    /// Manages plugin loading and execution
    /// </summary>
    public class PluginManager
    {
        private readonly List<IDashboardPlugin> _plugins = new();
        private readonly IConfiguration _configuration;
        private readonly ILogger<PluginManager> _logger;

        public PluginManager(IConfiguration configuration, ILogger<PluginManager> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Load all configured plugins
        /// </summary>
        public async Task LoadPluginsAsync()
        {
            try
            {
                var pluginConfigs = _configuration.GetSection("Plugins").Get<PluginConfiguration[]>();
                
                if (pluginConfigs == null || !pluginConfigs.Any())
                {
                    _logger.LogWarning("No plugins configured");
                    return;
                }

                foreach (var config in pluginConfigs)
                {
                    if (config.Enabled)
                    {
                        await LoadPluginAsync(config);
                    }
                }

                _logger.LogInformation("Loaded {Count} plugins", _plugins.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading plugins");
            }
        }

        /// <summary>
        /// Load a specific plugin
        /// </summary>
        private async Task LoadPluginAsync(PluginConfiguration config)
        {
            try
            {
                // For now, we'll create mock plugins instead of real ones
                // This avoids circular dependency issues
                var mockPlugin = new MockPlugin(config.Name);
                await mockPlugin.InitializeAsync();
                _plugins.Add(mockPlugin);
                _logger.LogInformation("Plugin {Name} loaded successfully (mock)", config.Name);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error loading plugin {Name}", config.Name);
            }
        }

        /// <summary>
        /// Execute a plugin action
        /// </summary>
        public async Task<object> ExecutePluginActionAsync(string pluginName, string action, object? parameters = null)
        {
            var plugin = _plugins.FirstOrDefault(p => p.Name.Equals(pluginName, StringComparison.OrdinalIgnoreCase));
            
            if (plugin == null)
            {
                throw new PluginNotFoundException($"Plugin {pluginName} not found");
            }

            if (!plugin.IsEnabled)
            {
                throw new PluginDisabledException($"Plugin {pluginName} is disabled");
            }

            return await plugin.ExecuteAsync(action, parameters);
        }

        /// <summary>
        /// Get all loaded plugins
        /// </summary>
        public async Task<IEnumerable<PluginStatus>> GetAllPluginsAsync()
        {
            var statuses = new List<PluginStatus>();
            
            foreach (var plugin in _plugins)
            {
                try
                {
                    var status = await plugin.GetStatusAsync();
                    statuses.Add(status);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error getting status for plugin {Name}", plugin.Name);
                    statuses.Add(new PluginStatus
                    {
                        Name = plugin.Name,
                        Status = "Error",
                        ErrorMessage = ex.Message
                    });
                }
            }

            return statuses;
        }

        /// <summary>
        /// Get a specific plugin
        /// </summary>
        public IDashboardPlugin? GetPlugin(string pluginName)
        {
            return _plugins.FirstOrDefault(p => p.Name.Equals(pluginName, StringComparison.OrdinalIgnoreCase));
        }
    }

    /// <summary>
    /// Exception thrown when a plugin is not found
    /// </summary>
    public class PluginNotFoundException : Exception
    {
        public PluginNotFoundException(string message) : base(message) { }
    }

    /// <summary>
    /// Exception thrown when a plugin is disabled
    /// </summary>
    public class PluginDisabledException : Exception
    {
        public PluginDisabledException(string message) : base(message) {         }
    }

    /// <summary>
    /// Mock plugin implementation for testing
    /// </summary>
    public class MockPlugin : IDashboardPlugin
    {
        public string Name { get; }
        public string Version => "1.0.0";
        public string Description => $"Mock plugin for {Name}";
        public bool IsEnabled => true;
        public PluginStatus Status { get; private set; } = new PluginStatus { Status = "Available" };

        public MockPlugin(string name)
        {
            Name = name;
        }

        public async Task InitializeAsync()
        {
            Status = new PluginStatus { Status = "Running" };
            await Task.CompletedTask;
        }

        public async Task<PluginStatus> GetStatusAsync()
        {
            return await Task.FromResult(Status);
        }

        public async Task<IEnumerable<string>> GetAvailableActionsAsync()
        {
            var actions = Name switch
            {
                "SystemMonitoring" => new[] { "get-metrics", "get-processes", "get-uptime" },
                "SmartHome" => new[] { "get-devices", "get-rooms", "toggle-device", "set-device-brightness" },
                "Docker" => new[] { "get-containers", "get-images", "start-container", "stop-container", "restart-container" },
                _ => new[] { "test-action" }
            };
            return await Task.FromResult(actions);
        }

        public async Task<object> ExecuteAsync(string action, object? parameters = null)
        {
            // Return mock data based on the plugin and action
            object result = Name switch
            {
                "SystemMonitoring" => action switch
                {
                    "get-metrics" => new { cpuUsage = 45.2, memoryUsage = 67.8, diskUsage = 23.1, uptime = 86400, loadAverage = new[] { 1.2, 1.5, 1.8 } },
                    "get-processes" => new[] { new { id = "1", name = "chrome", pid = 1234, cpuUsage = 15.2, memoryUsage = 512, status = "running", command = "chrome.exe" } },
                    "get-uptime" => new { uptime = 86400, formatted = "1d 0h 0m" },
                    _ => new { message = "Action not supported" }
                },
                "SmartHome" => action switch
                {
                    "get-devices" => new[] { new { id = "1", name = "Living Room Light", type = "light", status = "on", room = "Living Room" } },
                    "get-rooms" => new[] { new { name = "Living Room", devices = 3, temperature = 22.5 } },
                    "toggle-device" => new { success = true, message = "Device toggled" },
                    "set-device-brightness" => new { success = true, message = "Brightness set" },
                    _ => new { message = "Action not supported" }
                },
                "Docker" => action switch
                {
                    "get-containers" => new[] { new { id = "1", name = "nginx", image = "nginx:latest", status = "running", cpu = 2.1, memory = 128 } },
                    "get-images" => new[] { new { id = "1", name = "nginx", tag = "latest", size = "142MB" } },
                    "start-container" => new { success = true, message = "Container started" },
                    "stop-container" => new { success = true, message = "Container stopped" },
                    "restart-container" => new { success = true, message = "Container restarted" },
                    _ => new { message = "Action not supported" }
                },
                _ => new { message = "Plugin not supported" }
            };

            return await Task.FromResult(result);
        }
    }
}
