# ======================================================================
# optimize-images.ps1
# Creates -sm, -lg, and WebP versions of all JPGs in /public/media/projects
# Requires ffmpeg installed and reachable at $ffmpegPath
#
# Usage:
#   .\optimize-images.ps1                          # Process all projects
#   .\optimize-images.ps1 -ProjectId "casa-no-alto" # Process one project
#   .\optimize-images.ps1 -ForceRebuild            # Delete and regenerate all
#   .\optimize-images.ps1 -ProjectId "loule" -ForceRebuild
#
# Parameters:
#   -ForceRebuild : Delete existing -sm/-lg .jpg/.webp before regenerating
#   -ProjectId    : Process only one folder under /public/media/projects
#
# ======================================================================

param(
    [switch]$ForceRebuild = $false,
    [string]$ProjectId = ""
)

$ffmpegPath = "C:\Users\Adriana Paiva\Downloads\ffmpeg80fullbuild\bin\ffmpeg.exe"
$root = "C:\Users\Adriana Paiva\ceuconstruction\public\media\projects"
$totalFailures = 0

if ($ProjectId) {
    Write-Host "Starting optimization for project: $ProjectId"
} else {
    Write-Host "Starting optimization in $root"
}
if ($ForceRebuild) {
    Write-Host "Mode: Force rebuild (deleting existing optimized files)"
}
Write-Host ""

# Get folders to process
$folders = Get-ChildItem -Path $root -Directory
if ($ProjectId) {
    $folders = $folders | Where-Object { $_.Name -eq $ProjectId }
    if ($folders.Count -eq 0) {
        Write-Host "Error: Project '$ProjectId' not found in $root" -ForegroundColor Red
        exit 1
    }
}

$folders | ForEach-Object {
    $folder = $_.FullName
    $projectName = $_.Name
    Write-Host "Processing folder: $projectName"

    Get-ChildItem -Path $folder -Filter "*.jpg" |
        Where-Object { $_.Name -notmatch "-(sm|lg)\.jpg$" } |
        ForEach-Object {
            $input = $_.FullName
            $basename = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)

            $smJpg = Join-Path $folder ($basename + "-sm.jpg")
            $lgJpg = Join-Path $folder ($basename + "-lg.jpg")
            $smWebp = Join-Path $folder ($basename + "-sm.webp")
            $lgWebp = Join-Path $folder ($basename + "-lg.webp")

            # Force rebuild: delete existing files
            if ($ForceRebuild) {
                @($smJpg, $lgJpg, $smWebp, $lgWebp) | ForEach-Object {
                    if (Test-Path $_) {
                        Remove-Item $_ -Force
                        Write-Host "  Deleted $(Split-Path $_ -Leaf)" -ForegroundColor Yellow
                    }
                }
            }

            # Check if all outputs exist
            $allExist = (Test-Path $smJpg) -and (Test-Path $lgJpg) -and (Test-Path $smWebp) -and (Test-Path $lgWebp)

            if ($allExist -and -not $ForceRebuild) {
                Write-Host "  Skipping $($_.Name) (already optimized)"
            }
            else {
                Write-Host "  Processing $($_.Name)..."

                # JPG - small (approx 1600px)
                if (-not (Test-Path $smJpg)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=1600:-1" -q:v 5 $smJpg
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "    [X] Failed to create $($basename)-sm.jpg" -ForegroundColor Red
                        $totalFailures++
                    } else {
                        Write-Host "    Created $($basename)-sm.jpg"
                    }
                }

                # JPG - large (approx 2560px)
                if (-not (Test-Path $lgJpg)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=2560:-1" -q:v 4 $lgJpg
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "    [X] Failed to create $($basename)-lg.jpg" -ForegroundColor Red
                        $totalFailures++
                    } else {
                        Write-Host "    Created $($basename)-lg.jpg"
                    }
                }

                # WebP - small
                if (-not (Test-Path $smWebp)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=1600:-1" -q:v 40 -c:v libwebp $smWebp
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "    [X] Failed to create $($basename)-sm.webp" -ForegroundColor Red
                        $totalFailures++
                    } else {
                        Write-Host "    Created $($basename)-sm.webp"
                    }
                }

                # WebP - large
                if (-not (Test-Path $lgWebp)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=2560:-1" -q:v 40 -c:v libwebp $lgWebp
                    if ($LASTEXITCODE -ne 0) {
                        Write-Host "    [X] Failed to create $($basename)-lg.webp" -ForegroundColor Red
                        $totalFailures++
                    } else {
                        Write-Host "    Created $($basename)-lg.webp"
                    }
                }
            }
        }
}

Write-Host ""
if ($totalFailures -eq 0) {
    Write-Host "Optimization complete for all project folders." -ForegroundColor Green
    exit 0
} else {
    Write-Host "Optimization completed with $totalFailures failure(s)." -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Yellow
    exit 1
}
