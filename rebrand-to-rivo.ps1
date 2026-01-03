# RIVO REBRANDING SCRIPT
# Run this in PowerShell to automatically rename everything from RIVO to Rivo

$projectPath = "c:\Users\aditya\OneDrive\Desktop\imagine cup\sensorysafe"

Write-Host "Starting RIVO to Rivo rebranding..." -ForegroundColor Green

# Step 1: Rename files
Write-Host "`nStep 1: Renaming files..." -ForegroundColor Yellow
if (Test-Path "$projectPath\RIVO.html") {
    Rename-Item "$projectPath\RIVO.html" "rivo.html"
    Write-Host "  ✓ Renamed RIVO.html to rivo.html" -ForegroundColor Green
}
if (Test-Path "$projectPath\RIVOazuremap.html") {
    Rename-Item "$projectPath\RIVOazuremap.html" "rivoazuremap.html"
    Write-Host "  ✓ Renamed RIVOazuremap.html to rivoazuremap.html" -ForegroundColor Green
}

# Step 2: Replace content in all files
Write-Host "`nStep 2: Replacing content in files..." -ForegroundColor Yellow

$files = Get-ChildItem -Path $projectPath -Include *.html,*.js,*.css,*.md,*.txt,*.json -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Replace RIVO with Rivo
    $content = $content -replace 'RIVO Navigation', 'Rivo'
    $content = $content -replace 'RIVO', 'Rivo'
    $content = $content -replace 'RIVO', 'rivo'
    $content = $content -replace '--RIVO-', '--rivo-'
    $content = $content -replace 'sensorysafe-backend', 'rivo-backend'
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content $file.FullName $content -Encoding UTF8 -NoNewline
        Write-Host "  ✓ Updated $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✅ Rebranding complete! RIVO is now Rivo." -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Open index.html and verify changes"
Write-Host "2. Test rivo.html in browser"
Write-Host "3. Check that all links work"

Read-Host "`nPress Enter to exit"
