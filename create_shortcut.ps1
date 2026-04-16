$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$HOME\Desktop\Champions Deck.lnk")

$BravePath = "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
if (!(Test-Path $BravePath)) {
    $BravePath = "C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
}
if (!(Test-Path $BravePath)) {
    $BravePath = "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe"
}

if (Test-Path $BravePath) {
    $Shortcut.TargetPath = $BravePath
    $Shortcut.Arguments = "--app=""file:///C:/Users/nishi/Desktop/pokemon_champions/index.html"""
    $Shortcut.IconLocation = "C:\Users\nishi\Desktop\pokemon_champions\assets\app_icon.ico"
    $Shortcut.Description = "Pokémon Champions Strategy Suite"


    $Shortcut.WorkingDirectory = "C:\Users\nishi\Desktop\pokemon_champions"
    $Shortcut.Save()
    Write-Host "Success"
} else {
    $Shortcut.TargetPath = "C:\Users\nishi\Desktop\pokemon_champions\index.html"
    $Shortcut.Save()
    Write-Host "Default"
}

