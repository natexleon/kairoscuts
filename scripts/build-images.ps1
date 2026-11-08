# Regenerates src/images/ from the original full-resolution photos embedded in the backup single-file site.
# Usage: powershell -NoProfile -ExecutionPolicy Bypass -File scripts/build-images.ps1
param(
  [string]$Source = 'C:\Users\miche\Downloads\Kairos Cuts Website.backup.html'
)
Add-Type -AssemblyName System.Drawing

$outDir = Join-Path $PSScriptRoot '..\src\images'
New-Item -ItemType Directory -Force $outDir | Out-Null

# Index order matches the order photos appear in the original file.
$plan = @(
  @{ name = 'dee-owner-kairos-cuts-stoney-creek'; widths = 640, 960, 1350 },
  @{ name = 'kairos-cuts-team-stoney-creek-barbershop'; widths = 700, 1050, 1400 },
  @{ name = 'fade-haircut-kairos-cuts'; widths = 450, 900 },
  @{ name = 'gentlemens-haircut-kairos-cuts'; widths = 450, 900 },
  @{ name = 'locs-by-shia-kairos-cuts'; widths = 450, 900 },
  @{ name = 'barber-dee'; widths = 420, 810 },
  @{ name = 'barber-tiago'; widths = 420, 810 },
  @{ name = 'barber-joban'; widths = 420, 810 },
  @{ name = 'barber-dami'; widths = 420, 810 },
  @{ name = 'barber-shia'; widths = 420, 810 },
  @{ name = 'barber-shi'; widths = 420, 810 },
  @{ name = 'barber-dante'; widths = 420, 810 },
  @{ name = 'haircut-in-progress-kairos-cuts'; widths = 360, 640 },
  @{ name = 'beard-trim-kairos-cuts'; widths = 360, 640 },
  @{ name = 'locs-kairos-cuts'; widths = 360, 640 },
  @{ name = 'kairos-cuts-crew'; widths = 360, 640 },
  @{ name = 'fade-kairos-cuts'; widths = 360, 640 },
  @{ name = 'textured-styling-kairos-cuts'; widths = 360, 640 },
  @{ name = 'kairos-cuts-waiting-area'; widths = 360, 640 },
  @{ name = 'kairos-cuts-storefront-king-street-west-stoney-creek'; widths = 600, 1000 }
)

$codec = [Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object Drawing.Imaging.EncoderParameter ([Drawing.Imaging.Encoder]::Quality), 80L

function Save-Resized($img, [Drawing.Rectangle]$src, [int]$w, [int]$h, [string]$path) {
  $bmp = New-Object Drawing.Bitmap $w, $h
  $g = [Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [Drawing.Drawing2D.CompositingQuality]::HighQuality
  $attr = New-Object Drawing.Imaging.ImageAttributes
  $attr.SetWrapMode([Drawing.Drawing2D.WrapMode]::TileFlipXY)
  $g.DrawImage($img, (New-Object Drawing.Rectangle 0, 0, $w, $h), $src.X, $src.Y, $src.Width, $src.Height, [Drawing.GraphicsUnit]::Pixel, $attr)
  $bmp.Save($path, $codec, $params)
  $g.Dispose(); $bmp.Dispose()
}

$html = [IO.File]::ReadAllText($Source)
$found = [regex]::Matches($html, 'data:image/jpeg;base64,([A-Za-z0-9+/=]+)')
if ($found.Count -ne $plan.Count) { throw "Expected $($plan.Count) photos, found $($found.Count)" }

$manifest = [ordered]@{}
for ($i = 0; $i -lt $plan.Count; $i++) {
  $entry = $plan[$i]
  $bytes = [Convert]::FromBase64String($found[$i].Groups[1].Value)
  $ms = New-Object IO.MemoryStream (,$bytes)
  $img = [Drawing.Image]::FromStream($ms)
  if ($img.PropertyIdList -contains 0x0112) {
    switch ([BitConverter]::ToUInt16($img.GetPropertyItem(0x0112).Value, 0)) {
      3 { $img.RotateFlip([Drawing.RotateFlipType]::Rotate180FlipNone) }
      6 { $img.RotateFlip([Drawing.RotateFlipType]::Rotate90FlipNone) }
      8 { $img.RotateFlip([Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
  }
  $full = New-Object Drawing.Rectangle 0, 0, $img.Width, $img.Height
  $widths = @($entry.widths | Where-Object { $_ -le $img.Width })
  foreach ($w in $widths) {
    $h = [int][Math]::Round($img.Height * $w / $img.Width)
    Save-Resized $img $full $w $h (Join-Path $outDir "$($entry.name)-$w.jpg")
  }
  $manifest[$entry.name] = [ordered]@{ width = $img.Width; height = $img.Height; widths = $widths }

  if ($i -eq 19) {
    # Social preview: 1200x630 centre crop of the storefront photo.
    $cropH = [int][Math]::Round($img.Width * 630 / 1200)
    $rect = New-Object Drawing.Rectangle 0, ([int](($img.Height - $cropH) / 2)), $img.Width, $cropH
    Save-Resized $img $rect 1200 630 (Join-Path $outDir 'og-kairos-cuts-stoney-creek.jpg')
  }
  "{0,2} {1}: {2}x{3} -> {4}" -f $i, $entry.name, $img.Width, $img.Height, ($widths -join ', ')
  $img.Dispose(); $ms.Dispose()
}

[IO.File]::WriteAllText((Join-Path $outDir 'manifest.json'), (ConvertTo-Json -InputObject $manifest -Depth 4))
"manifest written"
