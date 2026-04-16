Add-Type -AssemblyName System.Drawing
$pngPath = "C:\Users\nishi\Desktop\pokemon_champions\assets\logo.png"
$icoPath = "C:\Users\nishi\Desktop\pokemon_champions\assets\champions_final.ico"

if (Test-Path $pngPath) {
    # 画像をリサイズしてアイコンの標準的なサイズ(256x256)に合わせる
    $bmp = [System.Drawing.Bitmap]::FromFile($pngPath)
    $resized = New-Object System.Drawing.Bitmap(256, 256)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($bmp, 0, 0, 256, 256)
    
    $iconPointer = $resized.GetHicon()
    $icon = [System.Drawing.Icon]::FromHandle($iconPointer)
    
    # 互換性の高い形式で再保存
    $fileStream = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
    $icon.Save($fileStream)
    $fileStream.Close()
    
    $g.Dispose()
    $resized.Dispose()
    $bmp.Dispose()
    Write-Host "Success"
} else {
    Write-Host "Error"
}
