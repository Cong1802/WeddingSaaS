from pathlib import Path
p=Path('src/components/AdminCMS.jsx');s=p.read_text(encoding='utf-8');start=s.index('  const handleToggleTemplate = async');end=s.index('  const handleDeleteTemplate',start);s=s[:start]+s[end:]
s=s.replace('Bật mẫu để hiển thị ở trang chủ và kho mẫu.','Mẫu đã lưu sẽ hiển thị ở trang chủ và kho mẫu.')
s=s.replace('<button onClick={() => handleToggleTemplate(t.id)} style={{ flex: 1, padding: \'8px\', borderRadius: \'10px\', backgroundColor: \'#1e293b\', border: \'none\', color: \'#fff\', fontSize: \'12px\', cursor: \'pointer\' }}>{t.is_active ? \'Ẩn mẫu\' : \'Bật mẫu\'}</button>', '''<a href={t.file_url || '/template.html'} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: '8px', borderRadius: '10px', backgroundColor: '#1e293b', color: '#fff', fontSize: '12px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Eye size={14} /> Xem mẫu</a>''')
p.write_text(s,encoding='utf-8')
