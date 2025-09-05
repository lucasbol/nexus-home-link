using System;
using System.Collections.Generic;

namespace NexusHomeLink.Plugins.Core
{
    /// <summary>
    /// Plugin status information
    /// </summary>
    public class PluginStatus
    {
        /// <summary>
        /// Plugin name
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Plugin version
        /// </summary>
        public string Version { get; set; } = string.Empty;
        
        /// <summary>
        /// Whether the plugin is enabled
        /// </summary>
        public bool IsEnabled { get; set; }
        
        /// <summary>
        /// Plugin health status
        /// </summary>
        public string Status { get; set; } = "Unknown";
        
        /// <summary>
        /// Last update timestamp
        /// </summary>
        public DateTime LastUpdate { get; set; } = DateTime.UtcNow;
        
        /// <summary>
        /// Plugin metrics
        /// </summary>
        public Dictionary<string, object> Metrics { get; set; } = new();
        
        /// <summary>
        /// Error message if any
        /// </summary>
        public string? ErrorMessage { get; set; }
    }
}
