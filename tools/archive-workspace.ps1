# archive-workspace.ps1
# Moves all task folders from a project's workspace/ into its archive/<timestamp>/
# Usage: .\archive-workspace.ps1 -Project <project-name>

param(
    [Parameter(Mandatory)][string]$Project
)

$root      = Split-Path $PSScriptRoot -Parent
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archive   = Join-Path $root "projects\$Project\archive\$timestamp"
$workspace = Join-Path $root "projects\$Project\workspace"

if (-not (Test-Path $workspace)) {
    Write-Error "Project '$Project' not found or has no workspace at projects/$Project/workspace"
    exit 1
}

$moved = 0

Get-ChildItem -Path $workspace -Directory | ForEach-Object {
    $workerDir = $_
    Get-ChildItem -Path $workerDir.FullName -Directory | ForEach-Object {
        $taskDir = $_
        $dest = Join-Path $archive $workerDir.Name $taskDir.Name
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
        Move-Item -Path $taskDir.FullName -Destination (Split-Path $dest -Parent)
        $moved++
    }
}

if ($moved -gt 0) {
    Write-Host "Archived $moved task(s) to projects/$Project/archive/$timestamp"
} else {
    Write-Host "Nothing to archive."
}
