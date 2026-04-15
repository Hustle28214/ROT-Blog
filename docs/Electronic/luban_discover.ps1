$port = 9999
$timeoutMs = 5000
$query = "WHO_IS_LUBANCAT"
$username = "cat"

$adapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    $_.IPAddress -notlike "198.18.*" -and
    $_.IPAddress -notlike "127.*"
}

if (-not $adapters) {
    Write-Host "No suitable network interface found" -ForegroundColor Red
    exit 1
}

$wlan = $adapters | Where-Object { $_.InterfaceAlias -like "*WLAN*" -or $_.InterfaceAlias -like "*Wi-Fi*" } | Select-Object -First 1
if ($wlan) {
    $adapter = $wlan
    Write-Host "Selected WLAN interface: $($adapter.InterfaceAlias)" -ForegroundColor Green
} else {
    $adapter = $adapters | Select-Object -First 1
    Write-Host "No WLAN found, using: $($adapter.InterfaceAlias)" -ForegroundColor Yellow
}

$localIP = $adapter.IPAddress
$prefixLength = $adapter.PrefixLength

if ($prefixLength -eq 24) {
    $ipParts = $localIP -split '\.'
    $broadcast = "$($ipParts[0]).$($ipParts[1]).$($ipParts[2]).255"
} else {
    $broadcast = "255.255.255.255"
    Write-Host "Warning: non-/24 subnet, broadcast may be incorrect" -ForegroundColor Yellow
}

Write-Host "Local IP: $localIP" -ForegroundColor Cyan
Write-Host "Broadcast: $broadcast" -ForegroundColor Cyan

$client = New-Object System.Net.Sockets.UdpClient
$client.Client.SetSocketOption([System.Net.Sockets.SocketOptionLevel]::Socket, [System.Net.Sockets.SocketOptionName]::Broadcast, $true)
$client.Client.ReceiveTimeout = $timeoutMs

try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($query)
    $client.Send($bytes, $bytes.Length, $broadcast, $port) | Out-Null
    Write-Host "Broadcast sent to $broadcast`:$port" -ForegroundColor Green

    $remoteEP = New-Object System.Net.IPEndPoint([System.Net.IPAddress]::Any, 0)
    $data = $client.Receive([ref]$remoteEP)
    $ip = [System.Text.Encoding]::UTF8.GetString($data).Trim()
    Write-Host "Found LubanCat at IP: $ip" -ForegroundColor Green

    Start-Process "ssh" -ArgumentList "$username@$ip"
} catch [System.Net.Sockets.SocketException] {
    Write-Host "Socket error: $_" -ForegroundColor Red
} catch {
    Write-Host "Timeout or error: $_" -ForegroundColor Yellow
} finally {
    $client.Close()
}