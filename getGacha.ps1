# localization
param (
  [string]$locale = "en"
)
$localization = @{
  "en" = @{
    "findGamePath"          = "Attempting to find game path automatically..."
    "enterGamePathManually" = "Couldn't automatically find game path. Please enter game path manually."
    "invalidGamePath" = "Invalid game path. Please try again."
    "unableToFindUrl" = "Unable to find Gacha Url. Please open Convene Records in game, or report here https://github.com/trongtindev/astrite-app/issues."
    "gachaUrlResult" = "Gacha Url has been saved to clipboard."
  }
  "vi" = @{
    "findGamePath"          = "Đang tự động tìm thư mục chứa Wuthering Waves..."
    "enterGamePathManually" = "Không thể tìm thấy thư mục chứa Wuthering Waves. Vui lòng nhập đường dẫn tới Wuthering Waves thủ công."
    "invalidGamePath" = "Thư mục chứa Wuthering Waves không đúng. Vui lòng thử lại."
    "unableToFindUrl" = "Không tìm thấy Gacha URL. Vui lòng mở lịch sử trong game lên trước hoặc báo lỗi tại https://github.com/trongtindev/astrite-app/issues."
    "gachaUrlResult" = "Gacha URL đã được sao chép vào bộ nhớ. Hoặc bạn có thể sao chép thủ công."
  }
}
function Get-LocalizedString {
  param (
    [string]$key,
    [string]$locale
  )
  if ($localization.ContainsKey($locale) -and $localization[$locale].ContainsKey($key)) {
    return $localization[$locale][$key]
  } else {
    $defaultCulture = "en"
    return $localization[$defaultCulture][$key]
  }
}

# main application
Add-Type -AssemblyName System.Web
$ProgressPreference = 'SilentlyContinue'

## Find Game
$findGamePath = Get-LocalizedString -key "findGamePath" -locale $locale
Write-Output $findGamePath

$64 = "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*"
$32 = "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
$gamePath = (Get-ItemProperty -Path $32, $64 | Where-Object { $_.DisplayName -like "*wuthering*" } | Select InstallPath).PSObject.Properties.Value
$gachaLogPathExists = Test-Path ($gamePath + '\Wuthering Waves Game\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView')
$method = "automatic"

if (!$gamePath -or !$gachaLogPathExists) {
  $method = "manual"

  Write-Output " "
  $enterGamePathManually = Get-LocalizedString -key "enterGamePathManually" -locale $locale
  Write-Output $enterGamePathManually
  Write-Output "Ex. E:\Wuthering Waves"
  Write-Output " "

  $path = read-host "Game path: "
  $invalidGamePath = Get-LocalizedString -key "invalidGamePath" -locale $locale

  if ($path) {
    if ($path.EndsWith("Wuthering Waves")) {
      $gamePath = $path
      Write-Output "Manually found game path."
    }
    elseif ($path.EndsWith("Wuthering Waves Game")) {
      $gamePath = $path.replace("Wuthering Waves Game", "")
      Write-Output "Manually found game path."
    }
    else {
      Write-Output $invalidGamePath
    }
  }
  else {
    Write-Output $invalidGamePath
  }
} else {
  Write-Output "Automatically found game path."
}

Write-Output " "

$gachaLogPath = $gamePath + '\Wuthering Waves Game\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView'

#Find Gacha Url
if (Test-Path ($gachaLogPath + "\debug.log") -PathType Leaf) {
  Copy-Item -Path ($gachaLogPath + "\debug.log") -Destination ($gachaLogPath + "\debug_copy.log")
  $cacheData = Get-Content ($gachaLogPath + "\debug.log")
  Remove-Item -Path ($gachaLogPath + "\debug_copy.log")
  $cacheDataLines = $cacheData -split '1/0/'
  $url = ""

  for ($i = $cacheDataLines.Length - 1; $i -ge 0; $i--) {
    $line = $cacheDataLines[$i]

    if ($line.Contains("https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html#/record")) {
      $url = (($line -split ': "')[1].replace('",', "")) + ("&wa_method=" + $method)

      break
    }
  }

  $unableToFindUrl = Get-LocalizedString -key "unableToFindUrl" -locale $locale
  if ($url) {
    Write-Output " "
    Write-Output $url
    Set-Clipboard -Value $url
    Write-Output " "

    $gachaUrlResult = Get-LocalizedString -key "gachaUrlResult" -locale $locale
    Write-Output $gachaUrlResult
  } else {
    Write-Output " "
    Write-Output $unableToFindUrl
    Write-Output " "
  }
} else {
  Write-Output " "
  Write-Output $unableToFindUrl
  Write-Output " "
}
