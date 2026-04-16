Add-Type -AssemblyName System.Drawing

$pngPath = "C:\Users\nishi\Desktop\pokemon_champions\assets\app_icon.png"
$icoPath = "C:\Users\nishi\Desktop\pokemon_champions\assets\app_icon.ico"

if (Test-Path $pngPath) {
    $bmp = [System.Drawing.Bitmap]::FromFile($pngPath)
    $iconPointer = $bmp.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($iconPointer)
    
    $fileStream = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
    $icon.Save($fileStream)
    $fileStream.Close()
    
    $bmp.Dispose()
    Write-Host "Success"
} else {
    Write-Host "PNG not found"
}
