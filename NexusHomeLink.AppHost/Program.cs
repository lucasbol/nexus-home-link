var builder = DistributedApplication.CreateBuilder(args);

// Add the API service
var api = builder.AddProject<Projects.NexusHomeLink_Api>("api")
    .WithExternalHttpEndpoints()
    .WithHttpsEndpoint(port: 7443, name: "api-https")
    .WithHttpEndpoint(port: 5000, name: "api-http");

// Add the frontend service using Executable with simpler configuration
var frontend = builder.AddExecutable("frontend", "pnpm", "../frontend", "dev")
    .WithReference(api)
    .WithEnvironment("VITE_API_BASE_URL", $"{api.GetEndpoint("api-https")}/api");

builder.Build().Run();
