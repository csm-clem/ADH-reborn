"""Keep the historical migration fixture while testing the current release."""
from pathlib import Path
import re
version=re.search(r"RELEASE='([^']+)'",Path('release.js').read_text())[1]
Path('work/ci').mkdir(parents=True,exist_ok=True)
source=Path('tools/qa/update-v029.py').read_text().replace('0.29.0',version).replace('docs/v0.29/verification-mise-a-jour.json','work/ci/migration.json')
exec(compile(source,'update-current-fixture','exec'))
