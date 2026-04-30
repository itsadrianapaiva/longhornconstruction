# To generate new en.json and pt.json data from project folders already optimized. Run: .\scripts\generate-featured-projects-data.ps1

$order = @(
  "cowboy",
  "cox",
  "paris",
  "toulon",
  "arbuckle",
  "cape-cod",
  "denton",
  "hightower",
  "kevin",
  "knox",
  "princeton",
  "shiplap"
)

$projectsRoot = Join-Path (Get-Location) "public\media\projects"
$outputDir = Join-Path (Get-Location) "generated-data"

New-Item -ItemType Directory -Force $outputDir | Out-Null

function Convert-SlugToTitle {
  param([string]$Slug)

  $textInfo = (Get-Culture).TextInfo
  $spaced = $Slug -replace "-", " "
  return $textInfo.ToTitleCase($spaced)
}

function Get-ImageNumber {
  param([string]$BaseName)

  return [int]($BaseName -replace "-lg", "")
}

$items = foreach ($projectId in $order) {
  $folder = Join-Path $projectsRoot $projectId

  if (-not (Test-Path $folder)) {
    throw "Missing project folder: $folder"
  }

  $images = Get-ChildItem $folder -File |
    Where-Object { $_.Name -match '^\d+-lg\.jpg$' } |
    Sort-Object { Get-ImageNumber $_.BaseName }

  if ($images.Count -eq 0) {
    throw "No -lg.jpg images found for project: $projectId"
  }

  $title = Convert-SlugToTitle $projectId

  $preferredThumbnail = $images | Where-Object { $_.Name -eq "1-lg.jpg" } | Select-Object -First 1
  $thumbnailImage = if ($preferredThumbnail) { $preferredThumbnail } else { $images[0] }
  $thumbnailNumber = Get-ImageNumber $thumbnailImage.BaseName

  if ($thumbnailNumber -ne 1) {
    Write-Host "Warning: $projectId does not have 1-lg.jpg. Using $($thumbnailImage.Name) as thumbnail." -ForegroundColor Yellow
  }

  $gallery = foreach ($image in $images) {
    $number = Get-ImageNumber $image.BaseName
    $webpPath = Join-Path $folder "$number-lg.webp"

    if (-not (Test-Path $webpPath)) {
      throw "Missing WebP pair for $projectId image $number"
    }

    [ordered]@{
      alt = "$title - photo $number"
      width = 2560
      height = 1600
      sources = @(
        [ordered]@{
          src = "/media/projects/$projectId/$number-lg.jpg"
          format = "jpg"
        },
        [ordered]@{
          src = "/media/projects/$projectId/$number-lg.webp"
          format = "webp"
        }
      )
    }
  }

  [ordered]@{
    id = $projectId
    title = $title
    category = "residential"
    technology = @("Traditional")
    thumbnail = [ordered]@{
      src = "/media/projects/$projectId/$thumbnailNumber-lg.jpg"
      alt = "$title - featured project"
      width = 1600
      height = 1000
    }
    gallery = $gallery
  }
}

$json = $items | ConvertTo-Json -Depth 20

Set-Content -Path (Join-Path $outputDir "projects-items.pt.json") -Value $json -Encoding UTF8
Set-Content -Path (Join-Path $outputDir "projects-items.es.json") -Value $json -Encoding UTF8

Write-Host ""
Write-Host "Generated:" -ForegroundColor Green
Write-Host "generated-data/projects-items.pt.json"
Write-Host "generated-data/projects-items.es.json"
