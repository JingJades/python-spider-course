$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

Write-Host "检查 Node.js 版本..." -ForegroundColor Cyan
node --version
npm --version

Write-Host ""
Write-Host "启动 Kimi K3 代理服务..." -ForegroundColor Cyan
Write-Host "服务运行后请访问: http://localhost:3000" -ForegroundColor Green
Write-Host "按 Ctrl+C 停止服务" -ForegroundColor Yellow
Write-Host ""

node server.js