from pathlib import Path
p=Path('tests/Feature/TemplateDemoModeTest.php');s=p.read_text(encoding='utf-8').replace("'card_data'=>[]","'card_data'=>['title'=>'Thiệp thử']");p.write_text(s,encoding='utf-8')
