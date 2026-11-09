# Renders the scissors mark from src/assets/favicon.svg into PNG/ICO icons for browsers, iOS and Android.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-icons.ps1
Add-Type -AssemblyName System.Drawing

$out = Join-Path $PSScriptRoot '..\src\assets\icons'
New-Item -ItemType Directory -Force $out | Out-Null

$bg = [Drawing.ColorTranslator]::FromHtml('#0d0d0d')
$fg = [Drawing.ColorTranslator]::FromHtml('#6db3f2')

function New-Icon([int]$n, [bool]$rounded, [double]$inset = 0) {
  $bmp = New-Object Drawing.Bitmap $n, $n, ([Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear([Drawing.Color]::Transparent)
  $brush = New-Object Drawing.SolidBrush $bg
  if ($rounded) {
    $r = $n * 14 / 64; $d = 2 * $r
    $path = New-Object Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $d, $d, 180, 90); $path.AddArc($n - $d, 0, $d, $d, 270, 90)
    $path.AddArc($n - $d, $n - $d, $d, $d, 0, 90); $path.AddArc(0, $n - $d, $d, $d, 90, 90)
    $path.CloseFigure(); $g.FillPath($brush, $path)
  } else { $g.FillRectangle($brush, 0, 0, $n, $n) }

  # Same geometry as favicon.svg (64-unit grid), optionally shrunk toward the centre for safe-zone icons.
  $s = $n / 64 * (1 - 2 * $inset); $o = $n * $inset
  $penW = [Math]::Max(3.6 * $s, 1.5)
  $pen = New-Object Drawing.Pen $fg, $penW
  $pen.StartCap = [Drawing.Drawing2D.LineCap]::Round; $pen.EndCap = [Drawing.Drawing2D.LineCap]::Round
  $P = { param($v) $o + $v * $s }
  foreach ($cy in 20, 44) { $g.DrawEllipse($pen, (& $P 13.5), (& $P ($cy - 6.5)), 13 * $s, 13 * $s) }
  $g.DrawLine($pen, (& $P 25.5), (& $P 24.5), (& $P 50), (& $P 49))
  $g.DrawLine($pen, (& $P 25.5), (& $P 39.5), (& $P 50), (& $P 15))
  $g.Dispose()
  return $bmp
}

function Save-Png($bmp, $path) { $bmp.Save($path, [Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose() }

Save-Png (New-Icon 180 $false 0.08) (Join-Path $out 'apple-touch-icon.png')
Save-Png (New-Icon 192 $true) (Join-Path $out 'icon-192.png')
Save-Png (New-Icon 512 $true) (Join-Path $out 'icon-512.png')
Save-Png (New-Icon 512 $false 0.12) (Join-Path $out 'icon-maskable-512.png')

# favicon.ico with PNG-compressed 16/32/48 frames (supported by every current browser and Google Search).
$frames = foreach ($n in 16, 32, 48) {
  $bmp = New-Icon $n $true
  $ms = New-Object IO.MemoryStream
  $bmp.Save($ms, [Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose()
  @{ size = $n; bytes = $ms.ToArray() }
}
$ico = New-Object IO.MemoryStream
$w = New-Object IO.BinaryWriter $ico
$w.Write([UInt16]0); $w.Write([UInt16]1); $w.Write([UInt16]$frames.Count)
$offset = 6 + 16 * $frames.Count
foreach ($f in $frames) {
  $w.Write([byte]$f.size); $w.Write([byte]$f.size); $w.Write([byte]0); $w.Write([byte]0)
  $w.Write([UInt16]1); $w.Write([UInt16]32); $w.Write([UInt32]$f.bytes.Length); $w.Write([UInt32]$offset)
  $offset += $f.bytes.Length
}
foreach ($f in $frames) { $w.Write($f.bytes) }
$w.Flush()
[IO.File]::WriteAllBytes((Join-Path $out 'favicon.ico'), $ico.ToArray())

Get-ChildItem $out | ForEach-Object { "{0,-24} {1,7:N0} bytes" -f $_.Name, $_.Length }
