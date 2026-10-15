from pathlib import Path
p=Path('src/App.jsx');s=p.read_text(encoding='utf-8');s=s.replace("  const setCurrentPage = (page) => {", "  const setCurrentPage = (page) => {\n    if (page === 'editor' && publicSettings.templates_demo_only !== '0' && user?.role !== 'admin') page = 'templates';")
s=s.replace("  const [publicSettings, setPublicSettings] = useState({});", """  const [publicSettings, setPublicSettings] = useState({});
  React.useEffect(() => {
    if (currentPage === 'editor' && publicSettings.templates_demo_only !== '0' && user?.role !== 'admin') {
      setCurrentPage('templates');
    }
  }, [currentPage, publicSettings.templates_demo_only, user?.role]);""")
s=s.replace("    requestedEditorTemplate.current = !!template;", """    if (publicSettings.templates_demo_only !== '0' && user?.role !== 'admin') {
      if (template?.fileUrl) window.open(template.fileUrl, '_blank', 'noopener,noreferrer');
      else setCurrentPage('templates');
      return;
    }
    requestedEditorTemplate.current = !!template;""")
p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateGallery.jsx');s=p.read_text(encoding='utf-8').replace('    onGoToEditor(cardId);', "    const template = templates.find(item => item.id === cardId);\n    if (template) window.open(template.fileUrl, '_blank', 'noopener,noreferrer');").replace('aria-label={`Dùng mẫu ${card.name}`}','aria-label={`Xem mẫu ${card.name}`}');p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateCatalogPage.jsx');s=p.read_text(encoding='utf-8');s=s.replace('accountMenu, error })','accountMenu, error, demoOnly = true })');s=s.replace("category === 'Tất cả' && !search &&", "!demoOnly && category === 'Tất cả' && !search &&");s=s.replace('<button disabled={busy} onClick={() => onSelect(template)}>Sử dụng</button>', '{!demoOnly && <button disabled={busy} onClick={() => onSelect(template)}>Sử dụng</button>}');s=s.replace('      {error &&', '      {demoOnly && <p style={{ textAlign: \'center\', color: \'#735b67\', marginBottom: 20 }}>Hiện chỉ mở xem mẫu. Tính năng tạo và chỉnh sửa thiệp sẽ sớm ra mắt.</p>}\n      {error &&');p.write_text(s,encoding='utf-8')
p=Path('src/components/MyCardsDashboard.jsx');s=p.read_text(encoding='utf-8');s=s.replace('    <TemplateCatalogPage templates=', "    <TemplateCatalogPage demoOnly={settings.templates_demo_only !== '0'} templates=");s=s.replace('  const activateTemplate = async template => {', "  const activateTemplate = async template => {\n    if (settings.templates_demo_only !== '0') { window.open(template.fileUrl, '_blank', 'noopener,noreferrer'); return; }");p.write_text(s,encoding='utf-8')
p=Path('src/components/AdminCMS.jsx');s=p.read_text(encoding='utf-8');s=s.replace('  const [templateDesigns,', '  const [catalogDemoOnly, setCatalogDemoOnly] = useState(true);\n  const [catalogModeBusy, setCatalogModeBusy] = useState(false);\n  const [templateDesigns,',1);s=s.replace('setTemplateDesigns(data.designs || []);', 'setTemplateDesigns(data.designs || []); setCatalogDemoOnly(data.demo_only !== false);',1)
needle="              {activeModule === 'templates' && (\n                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>"
s=s.replace(needle,needle+'''
                  <div style={{ padding: 16, background: '#1e293b', borderRadius: 12, color: '#e2e8f0' }}>
                    <label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}>
                      <input type="checkbox" checked={catalogDemoOnly} disabled={catalogModeBusy} onChange={async event => {
                        const demo_only = event.target.checked;
                        setCatalogModeBusy(true);
                        try {
                          const response = await adminFetch('/api/admin/templates/catalog-mode', { method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ demo_only }) });
                          if (!response.ok) throw new Error('Không lưu được chế độ kho mẫu.');
                          window.location.reload();
                        } catch (error) { alert(error.message); setCatalogModeBusy(false); }
                      }} />
                      <strong>Chỉ xem demo — tạm khóa tạo và chỉnh sửa cho khách</strong>
                    </label>
                    <p style={{ margin: '10px 0 0', fontSize: 13 }}>Bật mẫu để hiển thị ở trang chủ và kho mẫu. Khách bấm ảnh hoặc “Xem mẫu” để mở demo. Khi hoàn thành tính năng, bỏ chọn chế độ này để mở sử dụng.</p>
                  </div>''')
p.write_text(s,encoding='utf-8')
