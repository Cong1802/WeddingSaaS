from pathlib import Path
p=Path('laravel-backend/app/Http/Controllers/AdminController.php');s=p.read_text(encoding='utf-8')
s=s.replace("                $designs[] = ['url' => '/templates/'.$relative, 'name' => $relative];", "                if (preg_match('~(?:^|/)[^/]+_files/|(?:^|/)assets/|(?:^|/)maps\\.html$~i', $relative)) continue;\n                $designs[] = ['url' => '/templates/'.$relative, 'name' => $relative];")
s=s.replace("        return $designs;\n    }\n\n    public function getPublicPlans", """        $preferred = ['/template.html', '/https___www.lovecard.click_thiepso48/www.lovecard.click/thiepso48.html', '/templates/minimalism_red/minimalism_red.html', '/templates/passport/index.html', '/templates/pearl/pearl.html'];
        usort($designs, function ($a, $b) use ($preferred) {
            $aIndex = array_search($a['url'], $preferred, true);
            $bIndex = array_search($b['url'], $preferred, true);
            return (($aIndex === false ? 999 : $aIndex) <=> ($bIndex === false ? 999 : $bIndex)) ?: strcmp($a['url'], $b['url']);
        });
        foreach ($designs as $index => &$design) {
            $design['name'] = 'Mẫu thiệp cưới '.($index + 1);
        }
        unset($design);
        return $designs;
    }

    public function getPublicPlans""")
p.write_text(s,encoding='utf-8')
p=Path('src/components/AdminCMS.jsx');s=p.read_text(encoding='utf-8').replace('name: `Mẫu thiệp cưới ${templates.length + 1}`', "name: templateDesigns.find(design => design.url === '/template.html')?.name || ''");p.write_text(s,encoding='utf-8')
p=Path('src/components/TemplateAdminModal.jsx');s=p.read_text(encoding='utf-8')
s=s.replace("  const update = (field, value) =>", """  const autoName = useRef(!form.name || /^Mẫu thiệp cưới \\d+$/.test(form.name));
  useEffect(() => {
    if (!form.name) {
      const design = designs.find(item => item.url === (form.file_url || '/template.html'));
      if (design) setForm(previous => ({ ...previous, name: design.name }));
    }
  }, [designs, form.file_url, form.name, setForm]);
  const chooseDesign = value => {
    const design = designs.find(item => item.url === value);
    setForm(previous => ({ ...previous, file_url: value, name: autoName.current && design ? design.name : previous.name }));
  };
  const changeName = value => {
    autoName.current = !value || value === designs.find(item => item.url === form.file_url)?.name;
    setForm(previous => ({ ...previous, name: value }));
  };
  const update = (field, value) =>""")
s=s.replace("onChange={value => update('file_url', value)}", 'onChange={chooseDesign}').replace("onChange={event => update('name', event.target.value)}",'onChange={event => changeName(event.target.value)}')
p.write_text(s,encoding='utf-8')
