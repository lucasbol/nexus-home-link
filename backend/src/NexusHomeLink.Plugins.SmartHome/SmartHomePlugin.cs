using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using NexusHomeLink.Plugins.Core;

namespace NexusHomeLink.Plugins.SmartHome
{
    /// <summary>
    /// Smart home plugin for device management
    /// </summary>
    public class SmartHomePlugin : IDashboardPlugin
    {
        public string Name => "Smart Home";
        public string Version => "1.0.0";
        public string Description => "Manages smart home devices and automation";
        public bool IsEnabled { get; private set; } = true;

        private readonly List<SmartHomeDevice> _devices = new();
        private readonly List<string> _availableActions = new()
        {
            "get-devices",
            "get-device",
            "toggle-device",
            "get-rooms",
            "get-device-status",
            "set-device-brightness"
        };

        public async Task InitializeAsync()
        {
            // Initialize with mock data
            await InitializeMockDevicesAsync();
        }

        public async Task<object> ExecuteAsync(string action, object parameters = null)
        {
            return action switch
            {
                "get-devices" => await GetDevicesAsync(),
                "get-device" => await GetDeviceAsync(parameters),
                "toggle-device" => await ToggleDeviceAsync(parameters),
                "get-rooms" => await GetRoomsAsync(),
                "get-device-status" => await GetDeviceStatusAsync(parameters),
                "set-device-brightness" => await SetDeviceBrightnessAsync(parameters),
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
                    ["TotalDevices"] = _devices.Count,
                    ["OnlineDevices"] = _devices.Count(d => d.Status == "online"),
                    ["AvailableActions"] = _availableActions.Count
                }
            });
        }

        public async Task<IEnumerable<string>> GetAvailableActionsAsync()
        {
            return await Task.FromResult(_availableActions);
        }

        private async Task InitializeMockDevicesAsync()
        {
            _devices.AddRange(new[]
            {
                new SmartHomeDevice
                {
                    Id = 1,
                    Name = "Living Room Light",
                    Type = "light",
                    Status = "online",
                    Room = "Living Room",
                    Controllable = true,
                    LastSeen = DateTime.UtcNow
                },
                new SmartHomeDevice
                {
                    Id = 2,
                    Name = "Kitchen Light",
                    Type = "light",
                    Status = "online",
                    Room = "Kitchen",
                    Controllable = true,
                    LastSeen = DateTime.UtcNow
                },
                new SmartHomeDevice
                {
                    Id = 3,
                    Name = "Bedroom Light",
                    Type = "light",
                    Status = "offline",
                    Room = "Bedroom",
                    Controllable = true,
                    LastSeen = DateTime.UtcNow.AddMinutes(-5)
                },
                new SmartHomeDevice
                {
                    Id = 4,
                    Name = "Temperature Sensor",
                    Type = "temperature",
                    Status = "online",
                    Room = "Living Room",
                    Controllable = false,
                    LastSeen = DateTime.UtcNow,
                    Value = 22.5,
                    Unit = "°C"
                }
            });

            await Task.CompletedTask;
        }

        private async Task<object> GetDevicesAsync()
        {
            return await Task.FromResult(_devices);
        }

        private async Task<object> GetDeviceAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("deviceId"))
            {
                throw new ArgumentException("deviceId parameter is required");
            }

            var deviceId = Convert.ToInt32(paramDict["deviceId"]);
            var device = _devices.FirstOrDefault(d => d.Id == deviceId);
            
            if (device == null)
            {
                throw new ArgumentException($"Device with ID {deviceId} not found");
            }

            return await Task.FromResult(device);
        }

        private async Task<object> ToggleDeviceAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("deviceId"))
            {
                throw new ArgumentException("deviceId parameter is required");
            }

            var deviceId = Convert.ToInt32(paramDict["deviceId"]);
            var device = _devices.FirstOrDefault(d => d.Id == deviceId);
            
            if (device == null)
            {
                throw new ArgumentException($"Device with ID {deviceId} not found");
            }

            if (!device.Controllable)
            {
                throw new InvalidOperationException($"Device {device.Name} is not controllable");
            }

            // Toggle device status
            device.Status = device.Status == "online" ? "offline" : "online";
            device.LastSeen = DateTime.UtcNow;

            return await Task.FromResult(new { Success = true, Device = device });
        }

        private async Task<object> GetRoomsAsync()
        {
            var rooms = _devices
                .GroupBy(d => d.Room)
                .Select(g => new
                {
                    Name = g.Key,
                    DeviceCount = g.Count(),
                    OnlineDevices = g.Count(d => d.Status == "online"),
                    Devices = g.ToList()
                })
                .ToList();

            return await Task.FromResult(rooms);
        }

        private async Task<object> GetDeviceStatusAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("deviceId"))
            {
                throw new ArgumentException("deviceId parameter is required");
            }

            var deviceId = Convert.ToInt32(paramDict["deviceId"]);
            var device = _devices.FirstOrDefault(d => d.Id == deviceId);
            
            if (device == null)
            {
                throw new ArgumentException($"Device with ID {deviceId} not found");
            }

            return await Task.FromResult(new
            {
                Id = device.Id,
                Name = device.Name,
                Status = device.Status,
                LastSeen = device.LastSeen,
                IsOnline = device.Status == "online"
            });
        }

        private async Task<object> SetDeviceBrightnessAsync(object parameters)
        {
            if (parameters is not Dictionary<string, object> paramDict || 
                !paramDict.ContainsKey("deviceId") || !paramDict.ContainsKey("brightness"))
            {
                throw new ArgumentException("deviceId and brightness parameters are required");
            }

            var deviceId = Convert.ToInt32(paramDict["deviceId"]);
            var brightness = Convert.ToInt32(paramDict["brightness"]);

            if (brightness < 0 || brightness > 100)
            {
                throw new ArgumentException("Brightness must be between 0 and 100");
            }

            var device = _devices.FirstOrDefault(d => d.Id == deviceId);
            
            if (device == null)
            {
                throw new ArgumentException($"Device with ID {deviceId} not found");
            }

            if (device.Type != "light")
            {
                throw new InvalidOperationException($"Device {device.Name} is not a light");
            }

            device.Brightness = brightness;
            device.LastSeen = DateTime.UtcNow;

            return await Task.FromResult(new { Success = true, Device = device });
        }
    }

    /// <summary>
    /// Smart home device model
    /// </summary>
    public class SmartHomeDevice
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty;
        public bool Controllable { get; set; }
        public DateTime LastSeen { get; set; }
        public int? Brightness { get; set; }
        public double? Value { get; set; }
        public string? Unit { get; set; }
    }
}
