$url = "https://github.com/raysan5/raylib/releases/download/5.0/raylib-5.0_win64_msvc16.zip"
$zipPath = "raylib.zip"
Write-Host "Downloading Raylib..."
Invoke-WebRequest -Uri $url -OutFile $zipPath
Write-Host "Extracting Raylib..."
Expand-Archive -Path $zipPath -DestinationPath .
Write-Host "Setup Complete."
