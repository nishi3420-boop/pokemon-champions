@echo off
set "APP_PATH=%~dp0index.html"
set "BRAVE_PATH_1=C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
set "BRAVE_PATH_2=C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe"
set "BRAVE_PATH_3=%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe"

if exist "%BRAVE_PATH_1%" (
    start "" "%BRAVE_PATH_1%" --app="file:///%APP_PATH%" --window-size=1200,900
) else if exist "%BRAVE_PATH_2%" (
    start "" "%BRAVE_PATH_2%" --app="file:///%APP_PATH%" --window-size=1200,900
) else if exist "%BRAVE_PATH_3%" (
    start "" "%BRAVE_PATH_3%" --app="file:///%APP_PATH%" --window-size=1200,900
) else (
    echo Braveが見つかりませんでした。通常のブラウザで開きます。
    start "" "%APP_PATH%"
)
exit
