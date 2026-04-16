Add-Type -AssemblyName System.Drawing

# 先ほど送っていただいた画像を、手動設定用に変換
$pngPath = "C:\Users\nishi\Desktop\pokemon_champions\assets\logo.png"
$icoPath = "C:\Users\nishi\Desktop\pokemon_champions\assets\champions_final.ico"

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
    Write-Host "Logo not found"
}
