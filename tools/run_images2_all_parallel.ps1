param(
  [int]$MaxParallel = 3,
  [string]$BaseUrl = "https://apikey.click/v1",
  [string]$Model = "gpt-image-2",
  [string]$Size = "auto",
  [string]$Quality = "",
  [switch]$Overwrite
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$lessonsDir = Join-Path $root "lessons"
$jobDir = Join-Path $lessonsDir "images2_jobs"
$runner = Join-Path $PSScriptRoot "generate_images2_slides.ps1"
$summaryLog = Join-Path $lessonsDir "images2_parallel.log"
New-Item -ItemType Directory -Path $jobDir -Force | Out-Null

function Write-Summary([string]$Message) {
  $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
  try {
    Add-Content -Path $summaryLog -Value $line -Encoding UTF8 -ErrorAction Stop
  } catch {
    # The console output and per-job logs are authoritative during parallel runs.
  }
  Write-Output $line
}

function Get-PngCount([System.IO.DirectoryInfo]$LessonDir) {
  $images2 = Join-Path $LessonDir.FullName "images2"
  if (-not (Test-Path $images2)) { return 0 }
  return @(Get-ChildItem -Path $images2 -Filter "slide-*.png" -ErrorAction SilentlyContinue).Count
}

function Get-SlideCount([System.IO.DirectoryInfo]$LessonDir) {
  $prompts = Get-Content -Raw -Path (Join-Path $LessonDir.FullName "prompts.json") | ConvertFrom-Json
  return @($prompts.slides).Count
}

if (-not $env:OPENAI_API_KEY) {
  throw "OPENAI_API_KEY is not set."
}

Write-Summary "Parallel Images 2 batch started. MaxParallel=$MaxParallel BaseUrl=$BaseUrl Model=$Model Size=$Size Quality=$Quality"

$lessons = @(Get-ChildItem -Path $lessonsDir -Directory -Filter "grade*_*" |
  Where-Object { Test-Path (Join-Path $_.FullName "prompts.json") } |
  Sort-Object Name)

if (-not $Overwrite) {
  $lessons = @($lessons | Where-Object { (Get-PngCount $_) -lt (Get-SlideCount $_) })
}

Write-Summary "Incomplete lessons: $($lessons.Count)"
$active = @()
$index = 0
$ps = (Get-Command powershell).Source

while ($index -lt $lessons.Count -or $active.Count -gt 0) {
  while ($index -lt $lessons.Count -and $active.Count -lt $MaxParallel) {
    $lesson = $lessons[$index]
    $index += 1
    $out = Join-Path $jobDir "$($lesson.Name).log"
    $err = Join-Path $jobDir "$($lesson.Name).err.log"
    $args = @(
      "-ExecutionPolicy", "Bypass",
      "-File", $runner,
      "-Lesson", $lesson.Name,
      "-BaseUrl", $BaseUrl,
      "-Model", $Model,
      "-Size", $Size,
      "-Quality", $Quality,
      "-UpdateViewer"
    )
    if ($Overwrite) {
      $args += "-Overwrite"
    }
    $proc = Start-Process -FilePath $ps -ArgumentList $args -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput $out -RedirectStandardError $err -PassThru
    $active += [pscustomobject]@{ Process = $proc; Lesson = $lesson.Name; Out = $out; Err = $err }
    Write-Summary "started $($lesson.Name) pid=$($proc.Id)"
  }

  Start-Sleep -Seconds 10
  $stillActive = @()
  foreach ($job in $active) {
    if ($job.Process.HasExited) {
      Write-Summary "finished $($job.Lesson) exit=$($job.Process.ExitCode)"
    } else {
      $stillActive += $job
    }
  }
  $active = $stillActive
}

$totalPng = @(Get-ChildItem -Path $lessonsDir -Recurse -Directory -Filter "images2" |
  ForEach-Object { Get-ChildItem -Path $_.FullName -Filter "slide-*.png" -ErrorAction SilentlyContinue }).Count
Write-Summary "Parallel Images 2 batch finished. PNG=$totalPng"
