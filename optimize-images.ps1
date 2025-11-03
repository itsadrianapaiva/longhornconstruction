# ======================================================================
# optimize-images.ps1
# Creates -sm, -lg, and WebP versions of all JPGs in /public/media/projects
# Requires ffmpeg installed and reachable at $ffmpegPath
# To run: cd "C:\Users\Adriana Paiva\ceuconstruction"
#.\optimize-images.ps1

# ======================================================================

$ffmpegPath = "C:\Users\Adriana Paiva\Downloads\ffmpeg80fullbuild\bin\ffmpeg.exe"
$root = "C:\Users\Adriana Paiva\ceuconstruction\public\media\projects"

Write-Host "Starting optimization in $root"
Write-Host ""

Get-ChildItem -Path $root -Directory | ForEach-Object {
    $folder = $_.FullName
    Write-Host "Processing folder: $folder"

    Get-ChildItem -Path $folder -Filter "*.jpg" |
        Where-Object { $_.Name -notmatch "-(sm|lg)\.jpg$" } |
        ForEach-Object {
            $input = $_.FullName
            $basename = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)

            $smJpg = Join-Path $folder ($basename + "-sm.jpg")
            $lgJpg = Join-Path $folder ($basename + "-lg.jpg")
            $smWebp = Join-Path $folder ($basename + "-sm.webp")
            $lgWebp = Join-Path $folder ($basename + "-lg.webp")

            if ((Test-Path $smJpg) -and (Test-Path $lgJpg) -and (Test-Path $smWebp) -and (Test-Path $lgWebp)) {
                Write-Host "  Skipping $($_.Name) (already optimized)"
            }
            else {
                Write-Host "  Processing $($_.Name)..."

                # JPG - small (≈1600px)
                if (-not (Test-Path $smJpg)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=1600:-1" -q:v 5 $smJpg
                    Write-Host "    Created $($basename)-sm.jpg"
                }

                # JPG - large (≈2560px)
                if (-not (Test-Path $lgJpg)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=2560:-1" -q:v 4 $lgJpg
                    Write-Host "    Created $($basename)-lg.jpg"
                }

                # WebP - small
                if (-not (Test-Path $smWebp)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=1600:-1" -q:v 40 -c:v libwebp $smWebp
                    Write-Host "    Created $($basename)-sm.webp"
                }

                # WebP - large
                if (-not (Test-Path $lgWebp)) {
                    & $ffmpegPath -hide_banner -loglevel error -i $input -vf "scale=2560:-1" -q:v 40 -c:v libwebp $lgWebp
                    Write-Host "    Created $($basename)-lg.webp"
                }
            }
        }
}

Write-Host ""
Write-Host "Optimization complete for all project folders."
