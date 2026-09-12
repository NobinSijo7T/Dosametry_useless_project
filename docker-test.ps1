# Docker Test Script for Dosametry (PowerShell)
# Run this to test your Docker build locally before deploying to Railway

Write-Host "🐳 Dosametry Docker Build & Test Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build Docker image
Write-Host "📦 Building Docker image..." -ForegroundColor Blue
docker build -t dosametry:test .

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Run container
Write-Host "🚀 Starting container..." -ForegroundColor Blue
docker run -d -p 3000:3000 --name dosametry-test dosametry:test

# Wait for container to start
Start-Sleep -Seconds 5

# Check health
Write-Host ""
Write-Host "🏥 Checking health endpoint..." -ForegroundColor Blue

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ Health check failed!" -ForegroundColor Red
    docker logs dosametry-test
    docker stop dosametry-test
    docker rm dosametry-test
    exit 1
}

Write-Host ""
Write-Host "✅ All tests passed!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Container info:" -ForegroundColor Blue
docker ps | Select-String "dosametry-test"

Write-Host ""
Write-Host "💡 Next steps:" -ForegroundColor Blue
Write-Host "  1. Open http://localhost:3000 in your browser"
Write-Host "  2. Test the application"
Write-Host "  3. When done, stop container:"
Write-Host "     docker stop dosametry-test" -ForegroundColor Green
Write-Host "     docker rm dosametry-test" -ForegroundColor Green
Write-Host ""
Write-Host "🚂 Ready to deploy to Railway!" -ForegroundColor Blue
