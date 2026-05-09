# archive-workspace.ps1
# Moves all task folders from workspace/ into archive/<timestamp>/
# Run from any location — paths are resolved relative to this script.

$root      = Split-Path $PSScriptRoot -Parent
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$archive   = Join-Path $root "archive\$timestamp"
$workspace = Join-Path $root "workspace"

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
    Write-Host "Archived $moved task(s) to archive/$timestamp"
} else {
    Write-Host "Nothing to archive."
}
