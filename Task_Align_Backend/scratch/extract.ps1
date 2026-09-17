[xml]$xml = Get-Content 'scratch/db_docx/word/document.xml'
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')

$paragraphs = $xml.SelectNodes('//w:p', $ns)
$output = foreach ($p in $paragraphs) {
    $p.InnerText
}
$output | Out-File -FilePath 'scratch/db_design_text.txt' -Encoding utf8

$tables = $xml.SelectNodes('//w:tbl', $ns)
$tableOutput = foreach ($t in $tables) {
    "--- TABLE START ---"
    $rows = $t.SelectNodes('.//w:tr', $ns)
    foreach ($r in $rows) {
        $cells = $r.SelectNodes('.//w:tc', $ns)
        $cellTexts = foreach ($c in $cells) {
            $c.InnerText -replace '\s+', ' '
        }
        $cellTexts -join " | "
    }
    "--- TABLE END ---"
}
$tableOutput | Out-File -FilePath 'scratch/db_design_tables.txt' -Encoding utf8
