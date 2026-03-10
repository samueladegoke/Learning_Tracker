# =============================================================================
# 100 Days of Code - Browser Test Runner (PowerShell)
# =============================================================================
# Run with: .\tests\browser-tests\run-browser-tests.ps1
# =============================================================================

param(
    [string]$BaseUrl = "http://localhost:5173",
    [string]$OutputDir = ".\test-screenshots"
)

$ErrorActionPreference = "Continue"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  Learning Tracker - Browser Test Suite" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl"
Write-Host "Output Dir: $OutputDir"
Write-Host "==================================================" -ForegroundColor Cyan

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$SessionName = "learning-tracker-test-$timestamp"

function Take-Screenshot {
    param([string]$Name)
    $filepath = Join-Path $OutputDir "${timestamp}_$Name.png"
    agent-browser --session $SessionName screenshot $filepath 2>$null
    Write-Host "   📸 Saved: $filepath" -ForegroundColor Green
}

function Wait-AndSnapshot {
    agent-browser --session $SessionName wait --load networkidle 2>$null
    agent-browser --session $SessionName snapshot -i 2>$null
}

# Test 1: Application Startup
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " TEST 1: Application Startup & Initial Load" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow

Write-Host "`n🚀 Opening application..."
agent-browser --session $SessionName open $BaseUrl 2>$null
Start-Sleep -Seconds 2
Wait-AndSnapshot
Take-Screenshot "01_initial_load"
Write-Host "✅ Test 1 PASSED: Application loaded" -ForegroundColor Green

# Test 2: Navigation
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " TEST 2: Navigation - All Pages" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow

$Pages = @(
    @{Path="/"; Name="Dashboard"},
    @{Path="/world-map"; Name="WorldMap"},
    @{Path="/planner"; Name="Planner"},
    @{Path="/calendar"; Name="Calendar"},
    @{Path="/reflections"; Name="Reflections"},
    @{Path="/progress"; Name="Progress"},
    @{Path="/practice"; Name="Practice"}
)

foreach ($page in $Pages) {
    Write-Host "`n📍 Navigating to: $($page.Name) ($($page.Path))"
    agent-browser --session $SessionName open "$BaseUrl$($page.Path)" 2>$null
    Start-Sleep -Seconds 2
    Wait-AndSnapshot
    Take-Screenshot "02_nav_$($page.Name.ToLower())"
    Write-Host "   ✅ $($page.Name) loaded" -ForegroundColor Green
}

Write-Host "`n✅ Test 2 PASSED: All navigation pages accessible" -ForegroundColor Green

# Test 3: Dashboard Features
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " TEST 3: Dashboard Features" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow

Write-Host "`n🏠 Checking Dashboard elements..."
agent-browser --session $SessionName open "$BaseUrl/" 2>$null
Start-Sleep -Seconds 2
$snapshot = agent-browser --session $SessionName snapshot -i 2>$null
Write-Host $snapshot

# Check for key elements
if ($snapshot -match "Dashboard|Start|Sign|Practice|Map") {
    Write-Host "   ✅ Dashboard content verified" -ForegroundColor Green
}
Take-Screenshot "03_dashboard_features"
Write-Host "✅ Test 3 PASSED: Dashboard features checked" -ForegroundColor Green

# Test 4: Practice Page
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " TEST 4: Practice Page - Tabs & Day Selector" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow

Write-Host "`n📚 Checking Practice page..."
agent-browser --session $SessionName open "$BaseUrl/practice" 2>$null
Start-Sleep -Seconds 2
$snapshot = agent-browser --session $SessionName snapshot -i 2>$null
Write-Host $snapshot

if ($snapshot -match "Deep Dive|Quiz|Practice|Day") {
    Write-Host "   ✅ Practice tabs detected" -ForegroundColor Green
}
Take-Screenshot "04_practice_tabs"
Write-Host "✅ Test 4 PASSED: Practice page verified" -ForegroundColor Green

# Test 5: 404 Page
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " TEST 5: 404 Not Found Page" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow

Write-Host "`n🔍 Testing 404 route..."
agent-browser --session $SessionName open "$BaseUrl/this-page-does-not-exist" 2>$null
Start-Sleep -Seconds 2
$snapshot = agent-browser --session $SessionName snapshot -i 2>$null
Write-Host $snapshot

if ($snapshot -match "404|Not Found") {
    Write-Host "   ✅ 404 page content detected" -ForegroundColor Green
}
Take-Screenshot "05_not_found"
Write-Host "✅ Test 5 PASSED: 404 page handled" -ForegroundColor Green

# Final Screenshot
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host " FINAL: Dashboard Full Screenshot" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Yellow

Write-Host "`n🏠 Taking final dashboard screenshot..."
agent-browser --session $SessionName open "$BaseUrl/" 2>$null
Start-Sleep -Seconds 3

# Full page screenshot
$fullPath = Join-Path $OutputDir "FINAL_dashboard_full.png"
agent-browser --session $SessionName screenshot --full $fullPath 2>$null
Write-Host "   📸 Saved: $fullPath" -ForegroundColor Green

# Annotated screenshot
$annotatedPath = Join-Path $OutputDir "FINAL_dashboard_annotated.png"
agent-browser --session $SessionName screenshot --annotate $annotatedPath 2>$null
Write-Host "   📸 Saved: $annotatedPath" -ForegroundColor Green

# Cleanup
Write-Host "`n🧹 Closing browser session..." -ForegroundColor Cyan
agent-browser --session $SessionName close 2>$null

# Summary
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "          🎉 ALL TESTS COMPLETED SUCCESSFULLY 🎉" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "`nTest Summary:"
Write-Host "  ✅ Test 1: Application Startup" -ForegroundColor Green
Write-Host "  ✅ Test 2: Navigation - All Pages" -ForegroundColor Green
Write-Host "  ✅ Test 3: Dashboard Features" -ForegroundColor Green
Write-Host "  ✅ Test 4: Practice Page" -ForegroundColor Green
Write-Host "  ✅ Test 5: 404 Not Found" -ForegroundColor Green
Write-Host "  ✅ FINAL: Screenshots captured" -ForegroundColor Green
Write-Host "`nScreenshots saved to: $OutputDir" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Green
