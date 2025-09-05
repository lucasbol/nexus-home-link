using System.Collections.Generic;

namespace NexusHomeLink.Plugins.Core
{
    /// <summary>
    /// Plugin configuration
    /// </summary>
    public class PluginConfiguration
    {
        /// <summary>
        /// Plugin name
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Whether the plugin is enabled
        /// </summary>
        public bool Enabled { get; set; } = true;
        
        /// <summary>
        /// Plugin assembly name
        /// </summary>
        public string Assembly { get; set; } = string.Empty;
        
        /// <summary>
        /// Plugin type name
        /// </summary>
        public string Type { get; set; } = string.Empty;
        
        /// <summary>
        /// Plugin settings
        /// </summary>
        public Dictionary<string, object> Settings { get; set; } = new();
    }
}
