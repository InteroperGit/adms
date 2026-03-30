# s3-common.ps1 — shared S3 setup. Dot-source with a prefix: . scripts/s3-common.ps1 -Prefix ASSETS
# Sets AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_DEFAULT_REGION from <Prefix>_S3_* vars.
param(
    [Parameter(Mandatory)][string]$Prefix
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$envFile = Join-Path $PSScriptRoot '..\..\.env.deploy'
if (-not (Test-Path $envFile)) {
    Write-Host "FATAL: .env.deploy not found at $envFile" -ForegroundColor Red
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -notmatch '=') { return }
    $key, $value = $_ -split '=', 2
    [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), 'Process')
}

$accessKeyVar  = "${Prefix}_S3_ACCESS_KEY"
$secretKeyVar  = "${Prefix}_S3_SECRET_KEY"
$regionVar     = "${Prefix}_S3_REGION"
$bucketVar     = "${Prefix}_S3_BUCKET"
$endpointVar   = "${Prefix}_S3_ENDPOINT"

foreach ($var in @($accessKeyVar, $secretKeyVar, $regionVar, $bucketVar, $endpointVar)) {
    $val = [System.Environment]::GetEnvironmentVariable($var, 'Process')
    if ([string]::IsNullOrWhiteSpace($val)) {
        Write-Host "FATAL: required env var $var is not set" -ForegroundColor Red
        exit 1
    }
}

$env:AWS_ACCESS_KEY_ID     = [System.Environment]::GetEnvironmentVariable($accessKeyVar,  'Process')
$env:AWS_SECRET_ACCESS_KEY = [System.Environment]::GetEnvironmentVariable($secretKeyVar,  'Process')
$env:AWS_DEFAULT_REGION    = [System.Environment]::GetEnvironmentVariable($regionVar,     'Process')

$bucket   = [System.Environment]::GetEnvironmentVariable($bucketVar,    'Process')
$endpoint = [System.Environment]::GetEnvironmentVariable($endpointVar,  'Process')

Write-Host "[$Prefix] S3 config loaded:"
Write-Host "  $accessKeyVar  = $($env:AWS_ACCESS_KEY_ID.Substring(0, [Math]::Min(4, $env:AWS_ACCESS_KEY_ID.Length)))***"
Write-Host "  $secretKeyVar  = ***"
Write-Host "  $regionVar     = $($env:AWS_DEFAULT_REGION)"
Write-Host "  $bucketVar     = $bucket"
Write-Host "  $endpointVar   = $endpoint"
