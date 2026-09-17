Add-Type -AssemblyName System.IO.Compression.FileSystem
$zipPath = "docs/db update.docx"
$outputPath = "scratch/db_update_text.txt"

$zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
$entry = $zip.Entries | Where-Object { $_.FullName -eq "word/document.xml" }
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xmlText = $reader.ReadToEnd()
$stream.Close()
$zip.Dispose()

$matches = [regex]::Matches($xmlText, '<w:p\b[^>]*>(.*?)</w:p>')
$lines = foreach ($m in $matches) {
    $tMatches = [regex]::Matches($m.Value, '<w:t\b[^>]*>(.*?)</w:t>')
    ($tMatches | ForEach-Object { $_.Groups[1].Value }) -join ''
}

$lines | Out-File -FilePath $outputPath -Encoding utf8
Write-Host "Extracted $($lines.Count) lines to $outputPath"
