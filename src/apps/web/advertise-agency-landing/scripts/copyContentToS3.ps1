Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

. "$PSScriptRoot\s3Common.ps1" -Prefix CONTENT

$root = Resolve-Path (Join-Path $PSScriptRoot '..')

aws s3 sync "$root\build\client\" "s3://$($env:CONTENT_S3_BUCKET)/" `
  --endpoint-url $env:CONTENT_S3_ENDPOINT `
  --delete
if ($LASTEXITCODE -ne 0) { throw "aws s3 sync (build/client) exited with code $LASTEXITCODE" }

Write-Host 'Upload to Beget S3 complete.'
