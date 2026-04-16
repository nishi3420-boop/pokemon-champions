Add-Type -AssemblyName System.Drawing
$png = "C:\Users\nishi\Desktop\pokemon_champions\assets\logo.png"
$ico = "C:\Users\nishi\Desktop\pokemon_champions\assets\champions_final.ico"

# 古いファイルを削除
if (Test-Path $ico) { Remove-Item $ico }

$bmp = [System.Drawing.Bitmap]::FromFile($png)
$hIcon = $bmp.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)

$stream = [System.IO.File]::Create($ico)
$icon.Save($stream)
$stream.Dispose()
$icon.Dispose()
$bmp.Dispose()
Write-Host "Success"
