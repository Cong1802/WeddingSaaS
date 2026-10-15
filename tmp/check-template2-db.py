import sqlite3
from pathlib import Path
p=Path('laravel-backend/database/database.sqlite')
if p.exists():
 c=sqlite3.connect(p.resolve().as_uri()+'?mode=ro',uri=True)
 print(c.execute('select code,name,file_url,is_active from templates').fetchall())
