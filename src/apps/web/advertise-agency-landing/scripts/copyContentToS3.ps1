# copyContentToS3.ps1 - Selective S3 deployment with manifest-based diff
# Usage: powershell -File copyContentToS3.ps1 [-verbose]
#   --verbose  Show detailed list of added, changed, and removed files

param(
    [switch]$verbose
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# S3 constants
$MANIFEST_FILE = 'manifest.json'
$BUILD_META_FILE = 'buildMeta.json'

# Colors
function Write-Info { param($Message) Write-Host "[deploy] $Message" -ForegroundColor Cyan }
function Write-Success { param($Message) Write-Host "[deploy] " -NoNewline -ForegroundColor Cyan; Write-Host "OK: $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "[deploy] " -NoNewline -ForegroundColor Cyan; Write-Host "WARN: $Message" -ForegroundColor Yellow }
function Write-Err { param($Message) Write-Host "[deploy] " -NoNewline -ForegroundColor Cyan; Write-Host "ERR: $Message" -ForegroundColor Red }
function Write-Dim { param($Message) Write-Host $Message -ForegroundColor DarkGray }

function Format-Bytes {
    param([long]$Bytes)
    if ($Bytes -lt 1024) { return "$Bytes B" }
    elseif ($Bytes -lt 1MB) { return "$([math]::Round($Bytes / 1KB, 1)) KB" }
    else { return "$([math]::Round($Bytes / 1MB, 2)) MB" }
}

# Source S3 credentials
. "$PSScriptRoot\s3Common.ps1" -Prefix CONTENT

$S3Uri = "s3://$($env:CONTENT_S3_BUCKET)"
$RootDir = Resolve-Path (Join-Path $PSScriptRoot '..')
$BuildDir = Join-Path $RootDir 'build\client'
$endpointArgs = @('--endpoint-url', $env:CONTENT_S3_ENDPOINT)

# Temp files for cleanup
$TempBuildMeta = "$env:TEMP\buildMeta.$PID.json"
$TempManifest = "$env:TEMP\manifest.$PID.json"

# Cleanup function
function Cleanup {
    Remove-Item $TempBuildMeta -Force -ErrorAction SilentlyContinue
    Remove-Item $TempManifest -Force -ErrorAction SilentlyContinue
}
trap { Cleanup; exit 1 }

# Counters (derived from arrays at end)
$BytesUploaded = 0
$FilesRemoved = 0
$FilesAdded = 0
$FilesChanged = 0

Write-Info "Starting selective deployment to S3..."
Write-Dim "Endpoint: $env:CONTENT_S3_ENDPOINT"
Write-Dim "Bucket: $env:CONTENT_S3_BUCKET"

# Fetch remote buildMeta.json with cleanup
Write-Info "Fetching remote buildMeta.json..."
$RemoteBuildMeta = $null
try {
    aws s3 cp "$S3Uri/$BUILD_META_FILE" "$TempBuildMeta" @endpointArgs --quiet 2>$null
    if ($LASTEXITCODE -eq 0) {
        $RemoteBuildMeta = Get-Content "$TempBuildMeta" -Raw
    }
} finally {
    Cleanup
}

# Check if first deployment or compare hashes
$HashesMatch = $false
if ([string]::IsNullOrWhiteSpace($RemoteBuildMeta)) {
    Write-Warning "No remote buildMeta.json found - first deployment"
} else {
    # Extract build hashes
    $RemoteHash = ($RemoteBuildMeta | ConvertFrom-Json).buildHash
    $LocalMeta = Get-Content "$BuildDir\buildMeta.json" -Raw | ConvertFrom-Json
    $LocalHash = $LocalMeta.buildHash

    $RemoteHashDisplay = if ($RemoteHash) { $RemoteHash } else { 'N/A' }
    $LocalHashDisplay = if ($LocalHash) { $LocalHash } else { 'N/A' }

    Write-Dim "Remote build hash: $RemoteHashDisplay"
    Write-Dim "Local build hash:  $LocalHashDisplay"

    if ($RemoteHash -eq $LocalHash) {
        $HashesMatch = $true
    }
}

# Exit if hashes match
if ($HashesMatch) {
    Write-Success "Build hashes match - no deployment needed"
    Write-Host ""
    Write-Dim "=== Deployment Summary ==="
    Write-Dim "Status: SKIPPED (no changes)"
    Write-Dim "Build hash: $LocalHash"
    exit 0
}

Write-Info "Build hashes differ - computing file diff..."

# Fetch remote manifest.json
Write-Info "Fetching remote manifest.json..."
$RemoteManifestRaw = $null
aws s3 cp "$S3Uri/$MANIFEST_FILE" "$TempManifest" @endpointArgs --quiet 2>$null
if ($LASTEXITCODE -eq 0) {
    $RemoteManifestRaw = Get-Content "$TempManifest" -Raw
} else {
    Write-Err "Failed to fetch remote manifest.json"
    exit 1
}
# Cleanup temp files
Cleanup

# Parse manifests and compute diff
$LocalManifest = Get-Content "$BuildDir\manifest.json" -Raw | ConvertFrom-Json
if ($RemoteManifestRaw) {
    $RemoteManifest = $RemoteManifestRaw | ConvertFrom-Json
    $RemoteFiles = $RemoteManifest.files
} else {
    $RemoteFiles = $null
}

$LocalFiles = $LocalManifest.files

$AddedFiles = @()
$ChangedFiles = @()
$RemovedFiles = @()
$UnchangedFiles = @()

# Get list of local file paths
$LocalPaths = $LocalFiles.PSObject.Properties.Name

# Helper function to get entry from PSCustomObject by property name

# Helper function to get entry from PSCustomObject by property name
function Get-Entry {
    param($Obj, $Path)
    $prop = $Obj.PSObject.Properties[$Path]
    if ($null -ne $prop) {
        return $prop.Value
    }
    return $null
}

# Check local files against remote
foreach ($path in $LocalPaths) {
    $entry = Get-Entry -Obj $LocalFiles -Path $path
    $remoteEntry = $null
    if ($RemoteFiles) {
        $remoteEntry = Get-Entry -Obj $RemoteFiles -Path $path
    }

    if ($null -eq $remoteEntry) {
        $AddedFiles += $path
    } elseif ($null -eq $remoteEntry.sha256 -or $remoteEntry.sha256 -ne $entry.sha256) {
        $ChangedFiles += $path
    } else {
        $UnchangedFiles += $path
    }
}

# Check for removed files (in remote but not in local)
if ($RemoteFiles) {
    $RemotePaths = $RemoteFiles.PSObject.Properties.Name
    foreach ($path in $RemotePaths) {
        $localEntry = Get-Entry -Obj $LocalFiles -Path $path
        if ($null -eq $localEntry) {
            $RemovedFiles += $path
        }
    }
}

Write-Info "Files to add: $($AddedFiles.Count)"
Write-Info "Files to change: $($ChangedFiles.Count)"
Write-Info "Files to remove: $($RemovedFiles.Count)"
Write-Info "Files unchanged: $($UnchangedFiles.Count)"

# Verbose output: list files
if ($verbose) {
    if ($AddedFiles.Count -gt 0) {
        Write-Host ""
        Write-Host "Added files:" -ForegroundColor Yellow
        foreach ($f in $AddedFiles) {
            Write-Host "  + $f" -ForegroundColor Green
        }
    }
    if ($ChangedFiles.Count -gt 0) {
        Write-Host ""
        Write-Host "Changed files:" -ForegroundColor Yellow
        foreach ($f in $ChangedFiles) {
            Write-Host "  ~ $f" -ForegroundColor Cyan
        }
    }
    if ($RemovedFiles.Count -gt 0) {
        Write-Host ""
        Write-Host "Removed files:" -ForegroundColor Yellow
        foreach ($f in $RemovedFiles) {
            Write-Host "  - $f" -ForegroundColor DarkRed
        }
    }
}

if ($AddedFiles.Count -eq 0 -and $ChangedFiles.Count -eq 0 -and $RemovedFiles.Count -eq 0) {
    Write-Warning "No files to sync despite hash mismatch"
    exit 0
}

# Upload function
function Upload-File {
    param(
        [string]$File,
        [string]$CacheControl,
        [long]$Size
    )

    $Src = Join-Path $BuildDir $File
    $Dest = "$S3Uri/$File"

    aws s3 cp $Src $Dest --cache-control $CacheControl --quiet @endpointArgs 2>$null
    if ($LASTEXITCODE -eq 0) {
        $script:BytesUploaded += $Size
        return $true
    }
    return $false
}

# Upload added and changed files
Write-Host ""
Write-Info "Uploading files..."

$FilesAdded = 0
$FilesChanged = 0

foreach ($file in $AddedFiles) {
    $entry = Get-Entry -Obj $LocalFiles -Path $file
    $cacheControl = $entry.cacheControl
    if (-not $cacheControl) { $cacheControl = 'public,max-age=3600' }
    $size = $entry.size

    if (Upload-File -File $file -CacheControl $cacheControl -Size $size) {
        $FilesAdded++
    } else {
        Write-Err "Failed to upload: $file"
    }
}

foreach ($file in $ChangedFiles) {
    $entry = Get-Entry -Obj $LocalFiles -Path $file
    $cacheControl = $entry.cacheControl
    if (-not $cacheControl) { $cacheControl = 'public,max-age=3600' }
    $size = $entry.size

    if (Upload-File -File $file -CacheControl $cacheControl -Size $size) {
        $FilesChanged++
    } else {
        Write-Err "Failed to upload: $file"
    }
}

# Delete removed files
if ($RemovedFiles.Count -gt 0) {
    Write-Host ""
    Write-Info "Deleting removed files..."

    foreach ($file in $RemovedFiles) {
        $Dest = "$S3Uri/$file"
        $AwsParams = @(
            's3', 'rm', $Dest,
            '--quiet'
        ) + $endpointArgs

        aws @AwsParams 2>$null
        if ($LASTEXITCODE -eq 0) {
            $FilesRemoved++
        } else {
            Write-Err "Failed to delete: $file"
        }
    }
}

# Upload manifests LAST (critical for atomic state)
Write-Host ""
Write-Info "Updating remote manifests..."

$ManifestParams = @(
    's3', 'cp', "$BuildDir\manifest.json", "$S3Uri/manifest.json",
    '--cache-control', 'no-cache',
    '--quiet'
) + $endpointArgs

aws @ManifestParams 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Err "Failed to upload manifest.json"
    exit 1
}

$BuildMetaParams = @(
    's3', 'cp', "$BuildDir\buildMeta.json", "$S3Uri/buildMeta.json",
    '--cache-control', 'no-cache',
    '--quiet'
) + $endpointArgs

aws @BuildMetaParams 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Err "Failed to upload buildMeta.json"
    exit 1
}

# Print summary
Write-Host ""
Write-Success "Deployment complete"
Write-Host ""
Write-Dim "=== Deployment Summary ==="
Write-Dim "Status: COMPLETED"
Write-Dim "--------------------------------"
Write-Dim "Files added:     $FilesAdded"
Write-Dim "Files changed:   $FilesChanged"
Write-Dim "Files removed:   $FilesRemoved"
Write-Dim "Files unchanged: $($UnchangedFiles.Count)"
Write-Dim "--------------------------------"
Write-Dim "Total uploaded:  $(Format-Bytes $BytesUploaded)"
