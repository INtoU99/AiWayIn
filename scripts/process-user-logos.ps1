Add-Type -AssemblyName System.Drawing

$assetDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\public\resource-logos"))

function New-CanvasLogo {
  $source = [System.Drawing.Image]::FromFile((Join-Path $assetDirectory "canva-source.jpg"))
  $bitmap = New-Object System.Drawing.Bitmap 512, 512, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
  $clip.AddEllipse(4, 4, 504, 504)
  $graphics.SetClip($clip)
  $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle 0, 0, 512, 512), (New-Object System.Drawing.Rectangle 34, 34, 172, 172), [System.Drawing.GraphicsUnit]::Pixel)
  $bitmap.Save((Join-Path $assetDirectory "canva.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $clip.Dispose(); $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}

function New-MidjourneyLogo {
  $source = [System.Drawing.Image]::FromFile((Join-Path $assetDirectory "midjourney.jpg"))
  $bitmap = New-Object System.Drawing.Bitmap 512, 512, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.Clear([System.Drawing.Color]::White)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.DrawImage($source, (New-Object System.Drawing.Rectangle 8, 26, 496, 446), (New-Object System.Drawing.Rectangle 145, 175, 740, 665), [System.Drawing.GraphicsUnit]::Pixel)
  $bitmap.Save((Join-Path $assetDirectory "midjourney.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}

New-CanvasLogo
New-MidjourneyLogo
