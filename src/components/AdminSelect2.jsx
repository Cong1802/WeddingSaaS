import { useEffect, useRef } from 'react';
import $ from 'jquery';
import installSelect2 from 'select2/dist/js/select2.full.js';
import 'select2/dist/css/select2.css';

if (typeof window !== 'undefined' && !$.fn.select2) installSelect2(window, $);

export default function AdminSelect2({ value, options, onChange, label, required = false }) {
  const element = useRef(null);
  const callback = useRef(onChange);
  const currentValue = useRef(value);
  callback.current = onChange;
  currentValue.current = value;
  const optionsKey = JSON.stringify(options);
  useEffect(() => {
    const select = $(element.current);
    const values = JSON.parse(optionsKey);
    select.empty();
    values.forEach(option => select.append(new Option(option.label, option.value)));
    select.val(currentValue.current);
    select.select2({
      width: '100%', dropdownParent: select.parent(), minimumResultsForSearch: 0,
      language: { noResults: () => 'Không tìm thấy kết quả' },
    });
    select.on('change.adminSelect2', () => callback.current(select.val()));
    select.on('select2:open.adminSelect2', () => {
      const search = select.parent().find('.select2-search__field');
      search.attr('placeholder', 'Tìm kiếm…').attr('aria-label', `Tìm ${label.toLowerCase()}`);
      search.get(0)?.focus();
    });
    const selection = select.next('.select2-container').find('.select2-selection');
    selection.attr('aria-label', label);
    return () => { select.off('.adminSelect2'); select.select2('destroy'); };
  }, [optionsKey, label]);
  useEffect(() => { $(element.current).val(value).trigger('change.select2'); }, [value, optionsKey]);
  return <select ref={element} defaultValue={value} required={required} aria-label={label} />;
}
