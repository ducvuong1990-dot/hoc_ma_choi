param(
  [string]$Lesson = "",
  [string]$BaseUrl = "https://apikey.click/v1",
  [string]$Model = "gpt-image-2",
  [string]$Size = "auto",
  [string]$Quality = "",
  [int]$Limit = 0,
  [int]$MaxTime = 240,
  [switch]$Overwrite,
  [switch]$UpdateViewer
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$lessonsDir = Join-Path $root "lessons"
$logPath = Join-Path $lessonsDir "images2_generation_ps.log"
$errPath = Join-Path $lessonsDir "images2_generation_ps_errors.log"

function Write-Log([string]$Message) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
  try {
    Add-Content -Path $logPath -Value $line -Encoding UTF8 -ErrorAction Stop
  } catch {
    # Multiple parallel workers may touch the shared summary log at once.
  }
  Write-Output $line
}

function Write-ErrLog([string]$Message) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
  try {
    Add-Content -Path $errPath -Value $line -Encoding UTF8 -ErrorAction Stop
  } catch {
    # Keep the worker alive even if the shared error log is briefly locked.
  }
  Write-Output $line
}

function Get-LessonDirs {
  if ($Lesson) {
    $path = $Lesson
    if (-not [System.IO.Path]::IsPathRooted($path)) {
      $path = Join-Path $lessonsDir $Lesson
    }
    if (-not (Test-Path $path)) {
      throw "Lesson not found: $path"
    }
    return @(Get-Item $path)
  }
  return @(Get-ChildItem -Path $lessonsDir -Directory -Filter "grade*_*" | Where-Object { Test-Path (Join-Path $_.FullName "prompts.json") } | Sort-Object Name)
}

function Build-Prompt([string]$Prompt) {
  return @"
$Prompt
Create a warm child-friendly vector illustration inspired by this lesson prompt.
Important: do not include any letters, words, numbers, captions, labels, UI text, handwriting, or readable text in the image.
The Vietnamese lesson text will be rendered separately by HTML/SVG to avoid font and spelling errors.
Use only objects, children, classroom materials, nature, shapes, colors, and simple scenes.
No copyrighted characters, no watermark, no logo.
"@
}

function Invoke-ImageRequest([string]$Prompt, [string]$OutPath) {
  $tempDir = Join-Path $env:TEMP ("images2_" + [guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Path $tempDir | Out-Null
  try {
    $bodyPath = Join-Path $tempDir "body.json"
    $responsePath = Join-Path $tempDir "response.json"
    $body = @{
      model = $Model
      prompt = $Prompt
      size = $Size
      n = 1
    }
    if ($Quality) {
      $body.quality = $Quality
    }
    $body = $body | ConvertTo-Json -Depth 8 -Compress
    [System.IO.File]::WriteAllText($bodyPath, $body, [System.Text.UTF8Encoding]::new($false))

    $url = $BaseUrl.TrimEnd("/") + "/images/generations"
    $status = & curl.exe -sS --max-time $MaxTime -o $responsePath -w "%{http_code}" -X POST $url `
      -H "Authorization: Bearer $env:OPENAI_API_KEY" `
      -H "Content-Type: application/json" `
      --data-binary "@$bodyPath"

    $responseText = if (Test-Path $responsePath) { Get-Content -Raw -Path $responsePath } else { "" }
    if ($LASTEXITCODE -ne 0) {
      throw "curl exit code $LASTEXITCODE"
    }
    if ($status -ne "200") {
      throw "HTTP $status $($responseText.Substring(0, [Math]::Min(500, $responseText.Length)))"
    }
    $json = $responseText | ConvertFrom-Json
    $b64 = $json.data[0].b64_json
    if (-not $b64) {
      throw "Response missing data[0].b64_json"
    }
    [System.IO.File]::WriteAllBytes($OutPath, [Convert]::FromBase64String($b64))
  } finally {
    Remove-Item -Path $tempDir -Recurse -Force -ErrorAction SilentlyContinue
  }
}

function Update-Viewer([System.IO.DirectoryInfo]$LessonDir, [int]$SlideCount) {
  Write-Log "viewer kept on SVG for $($LessonDir.Name) to preserve Vietnamese text"
}

if (-not $env:OPENAI_API_KEY) {
  throw "OPENAI_API_KEY is not set."
}

Write-Log "Images 2 batch started. BaseUrl=$BaseUrl Model=$Model Size=$Size Quality=$Quality"
$lessonDirs = Get-LessonDirs
$totalGenerated = 0

foreach ($lessonDir in $lessonDirs) {
  $promptsPath = Join-Path $lessonDir.FullName "prompts.json"
  $prompts = Get-Content -Raw -Path $promptsPath | ConvertFrom-Json
  $slides = @($prompts.slides)
  if ($Limit -gt 0) {
    $slides = @($slides | Select-Object -First $Limit)
  }
  $images2 = Join-Path $lessonDir.FullName "images2"
  New-Item -ItemType Directory -Path $images2 -Force | Out-Null
  Write-Log "Lesson $($lessonDir.Name): $($slides.Count) slide(s)"

  foreach ($slide in $slides) {
    $num = [int]$slide.slide_number
    $outPath = Join-Path $images2 ("slide-{0:D2}.png" -f $num)
    if ((Test-Path $outPath) -and -not $Overwrite) {
      Write-Log "skip $($lessonDir.Name) slide-$('{0:D2}' -f $num): exists"
      continue
    }
    try {
      Write-Log "generate $($lessonDir.Name) slide-$('{0:D2}' -f $num)"
      Invoke-ImageRequest -Prompt (Build-Prompt $slide.prompt) -OutPath $outPath
      $totalGenerated += 1
    } catch {
      Write-ErrLog "$($lessonDir.Name) slide-$('{0:D2}' -f $num): $($_.Exception.Message)"
    }
  }

  if ($UpdateViewer -and $Limit -eq 0) {
    Update-Viewer -LessonDir $lessonDir -SlideCount @($prompts.slides).Count
  }
}

Write-Log "Images 2 batch finished. Generated=$totalGenerated"
