from pathlib import Path
p=Path('src/components/AdminCMS.jsx');s=p.read_text(encoding='utf-8');s="import TemplateAdminModal from './TemplateAdminModal';\n"+s
start=s.index('      {editingTemplate && (',s.index('MODAL EDIT TEMPLATE'))
end=s.index('      {/*',start+20)
s=s[:start]+'''      {editingTemplate && <TemplateAdminModal form={templateForm} setForm={setTemplateForm} designs={templateDesigns} token={token} onClose={() => setEditingTemplate(null)} onSave={handleSaveTemplate} notify={showNotification} />}

'''+s[end:];p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateAdminModal.jsx');s=p.read_text(encoding='utf-8-sig').replace("element.type !== 'hidden'","element.type !== 'hidden' && element.tabIndex !== -1");p.write_text(s,encoding='utf-8')
