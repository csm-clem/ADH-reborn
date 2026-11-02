import json,hashlib,zipfile
from pathlib import Path
r=Path('.');m=json.loads((r/'manifest.json').read_text());data=b''.join((r/p['path']).read_bytes() for p in m['parts']);assert len(data)==m['size'] and hashlib.sha256(data).hexdigest()==m['sha256'];(r/m['filename']).write_bytes(data)
with zipfile.ZipFile(r/m['filename']) as z:assert z.testzip() is None
