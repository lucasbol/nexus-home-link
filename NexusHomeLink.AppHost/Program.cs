using CommunityToolkit.Aspire.Hosting.NodeJS.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

var builder = DistributedApplication.CreateBuilder(args);

// Add the API service
var api = builder.AddProject<Projects.NexusHomeLink_Api>("api")
    .WithExternalHttpEndpoints()
    .WithHttpsEndpoint(port: 7443, name: "api-https")
    .WithHttpEndpoint(port: 5000, name: "api-http");

// Add the frontend service using AddPnpmApp (with Community Toolkit)
var frontend = builder.AddPnpmApp("frontend", "../frontend")
    .WithPnpmPackageInstallation()
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .WithEnvironment("VITE_API_BASE_URL", $"{api.GetEndpoint("api-https")}/api");

var app = builder.Build();

// Start the app and then log endpoints
_ = Task.Run(async () => {
    await Task.Delay(3000); // Wait for services to start
    try {
        // ASCII Art Splash Screen
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine();
        Console.WriteLine("  ███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗");
        Console.WriteLine("  ████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝");
        Console.WriteLine("  ██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗");
        Console.WriteLine("  ██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║");
        Console.WriteLine("  ██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║");
        Console.WriteLine("  ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝");
        Console.WriteLine();
        Console.WriteLine("  ██╗  ██╗ ██████╗ ███╗   ███╗███████╗    ██╗     ██╗███╗   ██╗██╗  ██╗");
        Console.WriteLine("  ██║  ██║██╔═══██╗████╗ ████║██╔════╝    ██║     ██║████╗  ██║██║ ██╔╝");
        Console.WriteLine("  ███████║██║   ██║██╔████╔██║█████╗      ██║     ██║██╔██╗ ██║█████╔╝ ");
        Console.WriteLine("  ██╔══██║██║   ██║██║╚██╔╝██║██╔══╝      ██║     ██║██║╚██╗██║██╔═██╗ ");
        Console.WriteLine("  ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗    ███████╗██║██║ ╚████║██║  ██╗");
        Console.WriteLine("  ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝    ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝");
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("  🚀 Nexus Home Link is ready! - Powered by .NET Core & Vue 3");
        Console.WriteLine();
        Console.ResetColor();
        
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("🔧 API: {0}", api.GetEndpoint("http").Url);
        Console.ResetColor();
        
        Console.ForegroundColor = ConsoleColor.Magenta;
        Console.WriteLine("📱 Frontend: {0}", frontend.GetEndpoint("http").Url);
        Console.ResetColor();
    } catch (Exception ex) {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.WriteLine("⚠️  Endpoints not yet available: {0}", ex.Message);
        Console.ResetColor();
    }
});

app.Run();
