Add-Type -AssemblyName System.Drawing

function Optimize-Img($srcPath, $destPath, $maxWidth, $quality) {
    if (Test-Path $srcPath) {
        $img = [System.Drawing.Image]::FromFile($srcPath)
        $ratio = $maxWidth / $img.Width
        $newWidth = [int]$maxWidth
        $newHeight = [int]($img.Height * $ratio)
        if ($img.Width -le $maxWidth) {
            $newWidth = $img.Width
            $newHeight = $img.Height
        }
        $bmp = new-object System.Drawing.Bitmap($newWidth, $newHeight)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($img, 0, 0, $newWidth, $newHeight)
        
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
        $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        
        $img.Dispose()
        $bmp.Save($destPath, $jpegCodec, $encoderParams)
        $bmp.Dispose()
        $g.Dispose()
        Write-Host "Optimized: $destPath"
    }
}

$dir = "C:\Users\sghile\.gemini\antigravity\scratch\wedding-invitation\images"
Optimize-Img "$dir\hero.jpg" "$dir\hero_opt.jpg" 500 70
Optimize-Img "$dir\reception.jpg" "$dir\reception_opt.jpg" 500 70
Optimize-Img "$dir\bridge.jpg" "$dir\bridge_opt.jpg" 500 70

Move-Item -Force "$dir\hero_opt.jpg" "$dir\hero.jpg"
Move-Item -Force "$dir\reception_opt.jpg" "$dir\reception.jpg"
Move-Item -Force "$dir\bridge_opt.jpg" "$dir\bridge.jpg"
