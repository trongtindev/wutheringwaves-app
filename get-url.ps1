# Original script was inspired by astrite.gg
# Original script was inspired by https://gist.githubusercontent.com/Luzefiru/19c0759bea1b9e7ef480bb39303b3f6c/raw/a316c642c3874429c751b82b4ae16963511d50ee/get-url.ps1
# @theREalpha for creating this script
# @antisocial93 for screening multiple registry entry logic
# @timas130 for adding CN server support
# Extracts Wuthering Waves CN, Global Convene URL including for EGS version.
# Falls back to Manual Game path entry if everything fails.

# localization
param (
  [string]$locale = "en"
)
$localization = @{
  "en" = @{
    "findGamePath"          = "Attempting to find game path automatically..."
    "enterGamePathManually" = "Couldn't automatically find game path. Please enter game path manually."
    "invalidGamePath" = "Invalid game path. Please try again."
    "unableToFindUrl" = "Unable to find Gacha Url. Please open Convene Records in game, or report here https://github.com/trongtindev/wutheringwaves-app/issues."
    "gachaUrlResult" = "Gacha Url has been saved to clipboard."
  }
  "vi" = @{
    "findGamePath"          = "Đang tự động tìm thư mục chứa Wuthering Waves..."
    "enterGamePathManually" = "Không thể tìm thấy thư mục chứa Wuthering Waves. Vui lòng nhập đường dẫn tới Wuthering Waves thủ công."
    "invalidGamePath" = "Thư mục chứa Wuthering Waves không đúng. Vui lòng thử lại."
    "unableToFindUrl" = "Không tìm thấy Gacha URL. Vui lòng mở lịch sử trong game lên trước hoặc báo lỗi tại https://github.com/trongtindev/wutheringwaves-app/issues."
    "gachaUrlResult" = "Gacha URL đã được sao chép vào bộ nhớ. Hoặc bạn có thể sao chép thủ công."
  }
}
function Get-LocalizedString {
  param (
    [string]$key
  )
  $culture = (Get-Culture).Name
  if ($localization.ContainsKey($culture) -and $localization[$culture].ContainsKey($key)) {
    return $localization[$culture][$key]
  } else {
    $defaultCulture = "en"
    return $localization[$defaultCulture][$key]
  }
}

# main application
Add-Type -AssemblyName System.Web

$64 = "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
$32 = "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
Write-Output "Attempting to find URL automatically..."

# Native
try {
    Write-Output "Checking registry for game path..."
    $gamePath = (Get-ItemProperty -Path $32, $64 | Where-Object { $_.DisplayName -like "*wuthering*" } | Select-Object -ExpandProperty InstallPath)
    if ($gamePath) {
        Write-Output "Game path from registry: $gamePath"
        if ((Test-Path ($gamePath + '\Client\Saved\Logs\Client.log')) -or (Test-Path ($gamePath + '\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView\debug.log'))) {
            $gachaLogPathExists = $true
            Write-Output "Log files found in registry path."
        }
        else {
            $gachaLogPathExists = $false
            Write-Output "Log files not found in registry path."
        }
    }
    else {
        $gachaLogPathExists = $false
        Write-Output "Game path not found in registry."
    }
}
catch {
    Write-Output "Error accessing registry: $_"
    $gamePath = $null
    $gachaLogPathExists = $false
}

# MUI Cache
if (!$gachaLogPathExists) {
    Write-Output "Checking MUI Cache..."
    $muiCachePath = "Registry::HKEY_CURRENT_USER\Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache"
    $filteredEntries = (Get-ItemProperty -Path $muiCachePath).PSObject.Properties | Where-Object { $_.Value -like "*wuthering*" } | Where-Object { $_.Name -like "*client-win64-shipping.exe*" }
    if ($filteredEntries.Count -ne 0) {
        Write-Output "Entries found: $($filteredEntries.Count)"
        foreach ($entry in $filteredEntries) {
            $gamePath = ($entry.Name -split '\\client\\')[0]
            Write-Output "Game path from MUI Cache: $gamePath"
            if ((Test-Path ($gamePath + '\Client\Saved\Logs\Client.log')) -or (Test-Path ($gamePath + '\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView\debug.log'))) {
                $gachaLogPathExists = $true
                Write-Output "Log files found in MUI Cache path."
                break
            }
            else {
                Write-Output "Log files not found in MUI Cache path."
            }
        }
    }
    else {
        Write-Output "No entries found in MUI Cache."
    }
}

# Firewall
if (!$gachaLogPathExists) {
    Write-Output "Checking Firewall rules..."
    $firewallPath = "Registry::HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SharedAccess\Parameters\FirewallPolicy\FirewallRules"
    $filteredEntries = (Get-ItemProperty -Path $firewallPath).PSObject.Properties | Where-Object { $_.Value -like "*wuthering*" } | Where-Object { $_.Name -like "*client-win64-shipping*" }
    if ($filteredEntries.Count -ne 0) {
        Write-Output "Entries found: $($filteredEntries.Count)"
        foreach ($entry in $filteredEntries) {
            $gamePath = (($entry.Value -split 'App=')[1] -split '\\client\\')[0]
            Write-Output "Game path from Firewall rules: $gamePath"
            if ((Test-Path ($gamePath + '\Client\Saved\Logs\Client.log')) -or (Test-Path ($gamePath + '\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView\debug.log'))) {
                $gachaLogPathExists = $true
                Write-Output "Log files found in Firewall rules path."
                break
            }
            else {
                Write-Output "Log files not found in Firewall rules path."
            }
        }
    }
    else {
        Write-Output "No entries found in Firewall rules."
    }
}


# Common Installation Paths
if (!$gachaLogPathExists) {
    Write-Output "Checking common installation paths..."
    $diskLetters = (Get-PSDrive -PSProvider FileSystem).Name
    foreach ($diskLetter in $diskLetters) {
        $gamePaths = @(
            "$diskLetter`:\Wuthering Waves Game",
            "$diskLetter`:\Wuthering Waves\Wuthering Waves Game",
            "$diskLetter`:\Program Files\Epic Games\WutheringWavesj3oFh\Wuthering Waves Game"
        )

        foreach ($path in $gamePaths) {
            Write-Output "Checking path: $path"
            if ((Test-Path ($path + '\Client\Saved\Logs\Client.log')) -or (Test-Path ($path + '\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView\debug.log'))) {
                $gamePath = $path
                $gachaLogPathExists = $true
                Write-Output "Log files found in common path: $path"
                break
            }
            else {
                Write-Output "Log files not found in path: $path"
            }
        }

        if ($gachaLogPathExists) {
            break
        }
    }
}

# Manual
while (!$gachaLogPathExists) {
    Write-Host "Game install location not found or log files missing. If you think that your installation directory is correct and it's still not working, please join our Discord server for help: https://discord.gg/mADnEXwZGT. Otherwise, please enter the game install location path."
    Write-Host 'Common install locations:'
    Write-Host '  C:\Wuthering Waves' -ForegroundColor Yellow
    Write-Host '  C:\Wuthering Waves\Wuthering Waves Game' -ForegroundColor Yellow
    Write-Host '  C:\Program Files\Epic Games\WutheringWavesj3oFh' -ForegroundColor Yellow
    $path = Read-Host "Path"
    if ($path) {
        $gamePath = $path
        Write-Output "User provided path: $path"
        if ((Test-Path ($gamePath + '\Client\Saved\Logs\Client.log')) -or (Test-Path ($gamePath + '\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView\debug.log'))) {
            $gachaLogPathExists = $true
            Write-Output "Log files found in user-provided path: $path"
        }
        else {
            Write-Host "Could not find log files. Did you set your game location properly or open your Convene History first?" -ForegroundColor Red
            Write-Output "Log files not found in user-provided path: $path"
        }
    }
    else {
        Write-Host "Invalid game location. Did you set your game location properly?" -ForegroundColor Red
    }
}

$gachaLogPath = $gamePath + '\Client\Saved\Logs\Client.log'
$debugLogPath = $gamePath + '\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView\debug.log'

if (Test-Path $gachaLogPath) {
    Write-Output "Reading Client.log..."
    $gachaUrlEntry = Get-Content $gachaLogPath | Select-String -Pattern "https://aki-gm-resources(-oversea)?\.aki-game\.(net|com)" | Select-Object -Last 1
}
else {
    $gachaUrlEntry = $null
    Write-Output "Client.log not found."
}

if (Test-Path $debugLogPath) {
    Write-Output "Reading debug.log..."
    $debugUrlEntry = Get-Content $debugLogPath | Select-String -Pattern '"#url": "(https://aki-gm-resources(-oversea)?\.aki-game\.(net|com)[^"]*)"' | Select-Object -Last 1
    $debugUrl = $debugUrlEntry.Matches.Groups[1].Value
}
else {
    $debugUrl = $null
    Write-Output "debug.log not found."
}

if ($gachaUrlEntry -or $debugUrl) {
    if ($gachaUrlEntry) {
        $urlToCopy = $gachaUrlEntry -replace '.*?(https://aki-gm-resources(-oversea)?\.aki-game\.(net|com)[^"]*).*', '$1'
        # Write-Output "URL found in Client.log: $urlToCopy"
    }
    if ([string]::IsNullOrWhiteSpace($urlToCopy)) {
        $urlToCopy = $debugUrl
        # Write-Output "URL found in debug.log: $urlToCopy"
    }

    if ([string]::IsNullOrWhiteSpace($urlToCopy)) {
        Write-Host "Cannot find the convene history URL in both Client.log and debug.log! Please open your Convene History first!" -ForegroundColor Red
    }
    else {
        Write-Host "`nConvene Record URL: $urlToCopy" -ForegroundColor Green
        Set-Clipboard $urlToCopy
    }
}
else {
    Write-Host "Cannot find the convene history URL in both Client.log and debug.log! Please open your Convene History first!" -ForegroundColor Red
}
