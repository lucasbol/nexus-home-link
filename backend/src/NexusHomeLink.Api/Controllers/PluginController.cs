using Microsoft.AspNetCore.Mvc;
using NexusHomeLink.Plugins.Core;

namespace NexusHomeLink.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PluginController : ControllerBase
    {
        private readonly PluginManager _pluginManager;
        private readonly ILogger<PluginController> _logger;

        public PluginController(PluginManager pluginManager, ILogger<PluginController> logger)
        {
            _pluginManager = pluginManager;
            _logger = logger;
        }

        /// <summary>
        /// Get all loaded plugins
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetPlugins()
        {
            try
            {
                var plugins = await _pluginManager.GetAllPluginsAsync();
                return Ok(plugins);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting plugins");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Test endpoint
        /// </summary>
        [HttpPost("test")]
        public IActionResult Test()
        {
            return Ok(new { message = "Test endpoint works", timestamp = DateTime.UtcNow });
        }

        /// <summary>
        /// Execute a plugin action
        /// </summary>
        [HttpPost("action")]
        [Consumes("application/json")]
        public async Task<IActionResult> ExecuteAction(
            [FromQuery] string pluginName, 
            [FromQuery] string action, 
            [FromBody] object? parameters = null)
        {
            try
            {
                var result = await _pluginManager.ExecutePluginActionAsync(pluginName, action, parameters);
                return Ok(result);
            }
            catch (PluginNotFoundException ex)
            {
                _logger.LogWarning("Plugin not found: {PluginName}", pluginName);
                return NotFound(new { message = ex.Message });
            }
            catch (PluginDisabledException ex)
            {
                _logger.LogWarning("Plugin disabled: {PluginName}", pluginName);
                return BadRequest(new { message = ex.Message });
            }
            catch (NotSupportedException ex)
            {
                _logger.LogWarning("Action not supported: {PluginName}/{Action}", pluginName, action);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing plugin action: {PluginName}/{Action}", pluginName, action);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get available actions for a plugin
        /// </summary>
        [HttpGet("{pluginName}/actions")]
        public async Task<IActionResult> GetPluginActions(string pluginName)
        {
            try
            {
                var plugin = _pluginManager.GetPlugin(pluginName);
                if (plugin == null)
                {
                    return NotFound(new { message = $"Plugin {pluginName} not found" });
                }

                var actions = await plugin.GetAvailableActionsAsync();
                return Ok(actions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting plugin actions: {PluginName}", pluginName);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get plugin status
        /// </summary>
        [HttpGet("{pluginName}/status")]
        public async Task<IActionResult> GetPluginStatus(string pluginName)
        {
            try
            {
                var plugin = _pluginManager.GetPlugin(pluginName);
                if (plugin == null)
                {
                    return NotFound(new { message = $"Plugin {pluginName} not found" });
                }

                var status = await plugin.GetStatusAsync();
                return Ok(status);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting plugin status: {PluginName}", pluginName);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
