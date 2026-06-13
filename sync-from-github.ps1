param(
  [switch]$StashLocalChanges
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "git"
  $psi.WorkingDirectory = (Get-Location).Path
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true
  $psi.CreateNoWindow = $true
  $psi.Arguments = ($Arguments | ForEach-Object {
    if ($_ -match '[\s"]') {
      '"' + ($_ -replace '"', '\"') + '"'
    } else {
      $_
    }
  }) -join " "

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi

  [void]$process.Start()
  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()

  if ($process.ExitCode -ne 0) {
    if ($stderr.Trim()) {
      $stderr.TrimEnd() | Write-Host
    }
    if ($stdout.Trim()) {
      $stdout.TrimEnd() | Write-Host
    }
    throw "git $($Arguments -join ' ') failed with exit code $($process.ExitCode)."
  }

  $outputText = if ($stdout.Trim()) { $stdout } else { $stderr }
  if (-not $outputText) {
    return @()
  }

  return ($outputText -split "`r?`n")
}

function Get-GitFirstLine {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $lines = @(Invoke-Git -Arguments $Arguments)
  if ($lines.Count -eq 0) {
    return ""
  }

  return [string]$lines[0]
}

try {
  if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw "Git is not available in PATH."
  }

  if (-not $PSScriptRoot) {
    throw "Unable to resolve the script directory."
  }

  Set-Location -LiteralPath $PSScriptRoot

  $insideRepo = (Get-GitFirstLine -Arguments @("rev-parse", "--is-inside-work-tree")).Trim()
  if ($insideRepo -ne "true") {
    throw "This script must be run from inside the Git repository."
  }

  $statusLines = @(Invoke-Git -Arguments @("status", "--porcelain"))
  $workingTreeDirty = $statusLines.Count -gt 0 -and ($statusLines -join "").Trim().Length -gt 0
  $stashed = $false

  if ($workingTreeDirty) {
    if ($StashLocalChanges) {
      Write-Step "Stashing local changes"
      $stashLabel = "sync-from-github auto stash $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
      Invoke-Git -Arguments @("stash", "push", "-u", "-m", $stashLabel) | Out-Null
      $stashed = $true
    } else {
      Write-Host "Local changes were found. Sync stopped to avoid overwriting work." -ForegroundColor Yellow
      Write-Host "Commit or stash them first, or rerun with -StashLocalChanges." -ForegroundColor Yellow
      Write-Host ""
      $statusLines | Write-Host
      exit 1
    }
  }

  Write-Step "Fetching origin"
  Invoke-Git -Arguments @("fetch", "origin") | Out-Null

  $currentBranch = (Get-GitFirstLine -Arguments @("rev-parse", "--abbrev-ref", "HEAD")).Trim()
  if ($currentBranch -ne "main") {
    Write-Step "Switching to main"
    Invoke-Git -Arguments @("checkout", "main") | Out-Null
  }

  Write-Step "Pulling latest origin/main"
  Invoke-Git -Arguments @("pull", "--rebase", "origin", "main") | Out-Null

  if ($stashed) {
    Write-Step "Restoring stashed changes"
    Invoke-Git -Arguments @("stash", "pop") | Out-Null
  }

  $head = (Get-GitFirstLine -Arguments @("log", "-1", "--oneline")).Trim()
  Write-Step "Sync complete"
  Write-Host $head -ForegroundColor Green
  exit 0
} catch {
  Write-Host ""
  Write-Host "Sync failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
