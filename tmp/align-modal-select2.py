from pathlib import Path
p=Path('src/components/TemplateAdminModal.css');s=p.read_text(encoding='utf-8');s+='''
/* Keep Select2's anchor full width; spacing belongs to its rendered text. */
.template-admin-select{padding-left:0;gap:0}
.template-admin-select>.select2-container{width:100%!important}
.template-admin-dialog .select2-container--default .select2-selection--single .select2-selection__rendered{padding-left:14px}
.template-admin-select>.select2-container--open{left:0!important;width:100%!important}
''';p.write_text(s,encoding='utf-8')
