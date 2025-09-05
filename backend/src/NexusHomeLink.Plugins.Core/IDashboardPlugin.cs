using System.Collections.Generic;
using System.Threading.Tasks;

namespace NexusHomeLink.Plugins.Core
{
    /// <summary>
    /// Base interface for all dashboard plugins
    /// </summary>
    public interface IDashboardPlugin
    {
        /// <summary>
        /// Plugin name
        /// </summary>
        string Name { get; }
        
        /// <summary>
        /// Plugin version
        /// </summary>
        string Version { get; }
        
        /// <summary>
        /// Plugin description
        /// </summary>
        string Description { get; }
        
        /// <summary>
        /// Whether the plugin is enabled
        /// </summary>
        bool IsEnabled { get; }
        
        /// <summary>
        /// Initialize the plugin
        /// </summary>
        Task InitializeAsync();
        
        /// <summary>
        /// Execute a plugin action
        /// </summary>
        /// <param name="action">Action name</param>
        /// <param name="parameters">Action parameters</param>
        /// <returns>Action result</returns>
        Task<object> ExecuteAsync(string action, object? parameters = null);
        
        /// <summary>
        /// Get plugin status
        /// </summary>
        /// <returns>Plugin status</returns>
        Task<PluginStatus> GetStatusAsync();
        
        /// <summary>
        /// Get available actions
        /// </summary>
        /// <returns>List of available actions</returns>
        Task<IEnumerable<string>> GetAvailableActionsAsync();
    }
}
