# Reinitialize git repo in admin-panel folder only
# This will create a fresh git repo tracking only files in this directory

Write-Host "Reinitializing git repo in admin-panel folder only..." -ForegroundColor Yellow

# Step 1: Save current branch and remote
$currentBranch = git branch --show-current
$remoteUrl = git remote get-url origin

Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan
Write-Host "Remote URL: $remoteUrl" -ForegroundColor Cyan

# Step 2: Get list of files in current directory (not parent)
Write-Host "`nCollecting files in admin-panel directory..." -ForegroundColor Yellow
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { 
    $_.FullName -notlike "*\.git\*" -and 
    $_.FullName -notlike "*\node_modules\*" -and
    $_.FullName -notlike "*\dist\*"
} | Select-Object -ExpandProperty FullName | ForEach-Object { 
    $_.Replace((Get-Location).Path + "\", "").Replace("\", "/")
}

Write-Host "Found $($files.Count) files to track" -ForegroundColor Green

# Step 3: Remove parent .git connection by going to parent and removing this folder from tracking
Write-Host "`nNote: The .git folder is in the parent directory." -ForegroundColor Yellow
Write-Host "To properly isolate this folder, you would need to:" -ForegroundColor Yellow
Write-Host "1. Initialize a new git repo here (git init)" -ForegroundColor Cyan
Write-Host "2. Add all files (git add .)" -ForegroundColor Cyan
Write-Host "3. Set remote (git remote add origin $remoteUrl)" -ForegroundColor Cyan
Write-Host "4. Push (git push -u origin main --force)" -ForegroundColor Cyan
Write-Host "`nThis will create a fresh repo with only admin-panel files." -ForegroundColor Yellow

