using Microsoft.AspNetCore.Mvc;

namespace NexusHomeLink.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "API is working!", timestamp = DateTime.UtcNow });
        }

        [HttpGet("plugins")]
        public IActionResult GetPlugins()
        {
            return Ok(new
            {
                plugins = new[]
                {
                    new { name = "SystemMonitoring", status = "available" },
                    new { name = "SmartHome", status = "available" },
                    new { name = "Docker", status = "available" }
                }
            });
        }
    }
}
