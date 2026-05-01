# Build Eureka image and get it into your Kubernetes (Docker Desktop)
#
# 1) Tries: copy image TAR into a kindest/node control-plane (if listed by docker)
# 2) Fallback: local registry on port 5000 + push to host.docker.internal:5000
#    (use eureka-registry.yaml) - works when "docker ps" only shows
#    Compose, not the kind node containers.
#
# From repo root:
#   powershell -ExecutionPolicy Bypass -File .\k8s\aletheia\load-eureka-image.ps1

$ErrorActionPreference = "Stop"
$image = "aletheia-eureka:local"
$tar = Join-Path $env:TEMP "aletheia-eureka-k8s.tar"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$eurekaContext = Join-Path $repoRoot "backend\eureka"
Write-Host "Building $image from $eurekaContext ..."
docker build -t $image $eurekaContext
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

function GetDockerArgs {
    param($ExtraArgs, [string]$DockerCtx)
    if ($DockerCtx) {
        return , @("--context", $DockerCtx) + $ExtraArgs
    }
    return , $ExtraArgs
}

function FindKindControlPlane {
    $ctxOrder = @("desktop-linux", "default", [string]::Empty)
    foreach ($ctx in $ctxOrder) {
        $c = if ($ctx) { $ctx } else { $null }
        # ps -a: include stopped; usually CP is always running
        foreach ($psMode in @("ps", "ps -a")) {
            $base = $psMode -split " "
            $a = GetDockerArgs ($base + @("-q", "-f", "label=io.x-k8s.kind.role=control-plane")) $c
            $id = & docker @a 2>$null | Select-Object -First 1
            if ($id) {
                $a = GetDockerArgs @("ps", "--filter", "id=$id", "--format", "{{.Names}}") $c
                $n = (& docker @a 2>$null).Trim()
                if ($n) { return @{ Name = $n; Ctx = $c } }
            }
            $a = GetDockerArgs ($base + @("-q", "-f", "ancestor=kindest/node")) $c
            $id = & docker @a 2>$null | Select-Object -First 1
            if ($id) {
                $a = GetDockerArgs @("ps", "--filter", "id=$id", "--format", "{{.Names}}") $c
                $n = (& docker @a 2>$null).Trim()
                if ($n) { return @{ Name = $n; Ctx = $c } }
            }
        }
        $a = GetDockerArgs @("ps", "-a", "--format", "{{.Names}}") $c
        $candidates = & docker @a 2>$null
        if (-not $candidates) { $a = GetDockerArgs @("ps", "--format", "{{.Names}}") $c; $candidates = & docker @a 2>$null }
        $hit = $candidates | Where-Object { $_ -match 'control.?plane' } | Select-Object -First 1
        if (-not $hit) { $hit = $candidates | Where-Object { $_ -match 'kindest|kind' } | Select-Object -First 1 }
        if ($hit) { return @{ Name = $hit; Ctx = $c } }
    }
    return $null
}

$info = FindKindControlPlane
if ($info) {
    Write-Host "Found kind node: $($info.Name) (importing TAR) ..."
    Write-Host "Saving image to $tar ..."
    docker save $image -o $tar
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    $node = $info.Name
    $ctx = $info.Ctx
    if ($ctx) {
        $a = GetDockerArgs @("cp", $tar, "${node}:/aletheia-eureka-k8s.tar") $ctx
        & docker @a
        $a = GetDockerArgs @("exec", $node, "ctr", "-n", "k8s.io", "images", "import", "/aletheia-eureka-k8s.tar") $ctx
        & docker @a
    } else {
        docker cp $tar "${node}:/aletheia-eureka-k8s.tar"
        docker exec $node ctr -n k8s.io images import /aletheia-eureka-k8s.tar
    }
    Remove-Item $tar -Force -ErrorAction SilentlyContinue
    Write-Host "OK. Next: kubectl apply -f k8s/aletheia/eureka.yaml"
    exit 0
}

# --- Fallback: no kindest control-plane in "docker ps" (common on Docker Desktop) ---

Write-Host ""
Write-Host "No kindest control-plane in docker. Using local registry (port 5000) + push to host.docker.internal:5000"
Write-Host "kubectl context:" 
kubectl config current-context 2>$null
kubectl get nodes 2>$null
Write-Host ""

$regC = "aletheia-k8s-registry"
try {
    $inUse = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
    if ($inUse) { Write-Warning "Port 5000 is in use. If registry start fails, free port 5000 or edit this script." }
} catch { }

$ex = docker ps -aq -f "name=aletheia-k8s-registry"
if ($ex) {
    docker start $regC 2>$null | Out-Null
} else {
    docker run -d -p 5000:5000 --name $regC --restart=unless-stopped registry:2
    if ($LASTEXITCODE -ne 0) { exit 1 }
}
Start-Sleep -Seconds 2

$regTag = "host.docker.internal:5000/aletheia-eureka:local"
docker tag $image $regTag
docker push $regTag
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Push failed. Add this to Docker Desktop > Settings > Docker Engine, then Apply & restart:" 
    Write-Host '  "insecure-registries": [ "host.docker.internal:5000", "127.0.0.1:5000" ]' 
    Write-Host ""
    Write-Host "Then re-run this script, or run manually:" 
    Write-Host "  docker tag $image $regTag" 
    Write-Host "  docker push $regTag" 
    exit 1
}

Write-Host "OK. Next: kubectl apply -f k8s/aletheia/eureka-registry.yaml"
Write-Host "Then:  kubectl -n aletheia port-forward svc/eureka 8761:8761"
