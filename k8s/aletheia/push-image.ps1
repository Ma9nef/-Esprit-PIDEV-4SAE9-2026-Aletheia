# Build a Docker image and push to the local registry (host.docker.internal:5000)
# Prereq: same as load-eureka-image.ps1 (insecure registries, registry:2 on 5000)
#
# Example:
#   powershell -ExecutionPolicy Bypass -File .\k8s\aletheia\push-image.ps1 -Name aletheia-offer -Context backend\microservices\offer
#
param(
    [Parameter(Mandatory = $true)]
    [string] $Name,
    [Parameter(Mandatory = $true)]
    [string] $Context,
    [string] $Tag = "local"
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$ctxPath = Join-Path $repoRoot $Context
if (-not (Test-Path $ctxPath)) {
    Write-Error "Context path not found: $ctxPath"
    exit 1
}

$localImage = "${Name}:$Tag"
$remote = "host.docker.internal:5000/${Name}:$Tag"

Write-Host "Building $localImage from $ctxPath ..."
docker build -t $localImage $ctxPath
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Tag + push $remote ..."
docker tag $localImage $remote
docker push $remote
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed. Check Docker Engine has insecure-registries for host.docker.internal:5000"
    exit 1
}
Write-Host "OK: $remote"
