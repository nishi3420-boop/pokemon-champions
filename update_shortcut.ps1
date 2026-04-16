$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$HOME\Desktop\Champions Deck.lnk")
$Shortcut.IconLocation = "C:\Users\nishi\Desktop\pokemon_champions\assets\app_icon_fixed.ico"
$Shortcut.Save()
Write-Host "Updated Shortcut"
