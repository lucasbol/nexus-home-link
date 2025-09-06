#!/bin/bash

# Dev Container Start Script
echo "🚀 Starting Nexus Home Link development environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -f "NexusHomeLink.sln" ]; then
    echo "❌ Not in the correct directory. Please run this from the project root."
    exit 1
fi

# Start the development environment
echo "🔧 Starting .NET Aspire development environment..."
echo "   • Frontend will be available at: http://localhost:3000"
echo "   • API will be available at: http://localhost:5000"
echo "   • Aspire Dashboard will be available at: https://localhost:7443"
echo ""
echo "Press Ctrl+C to stop the development server"
echo ""

# Start with .NET Aspire
dotnet run --project NexusHomeLink.AppHost
