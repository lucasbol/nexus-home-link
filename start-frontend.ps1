Write-Host "Nexus Home Link - Frontend Server" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the frontend server" -ForegroundColor Yellow
Write-Host ""
Set-Location "frontend"
pnpm dev
