Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. "$PSScriptRoot\s3Common.ps1" -Prefix ASSETS

$root         = Resolve-Path (Join-Path $PSScriptRoot '..')
$endpointArgs = @('--endpoint-url', $env:ASSETS_S3_ENDPOINT)

aws s3 sync "s3://$($env:ASSETS_S3_BUCKET)/data/content/" "$root\data\content\" @endpointArgs --delete
if ($LASTEXITCODE -ne 0) { throw "aws s3 sync (data/content) exited with code $LASTEXITCODE" }

aws s3 sync "s3://$($env:ASSETS_S3_BUCKET)/public/" "$root\public\" @endpointArgs --delete
if ($LASTEXITCODE -ne 0) { throw "aws s3 sync (public) exited with code $LASTEXITCODE" }

Write-Host 'Assets pulled from S3.'
