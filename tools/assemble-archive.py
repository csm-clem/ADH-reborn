from pathlib import Path
import hashlib
import json
import struct
import zipfile

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / "archive-manifest.json").read_text())
out = root / "delivery"
out.mkdir(exist_ok=True)
archive = out / manifest["filename"]
whole = hashlib.sha256()
with archive.open("wb") as target:
    for part in manifest["parts"]:
        data = (root / "archive-parts" / part["path"]).read_bytes()
        assert len(data) == part["size"], part["path"]
        assert hashlib.sha256(data).hexdigest() == part["sha256"], part["path"]
        whole.update(data)
        target.write(data)
assert archive.stat().st_size == manifest["size"]
assert whole.hexdigest() == manifest["sha256"]
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None, "ZIP CRC verification failed"
    pngs = [n for n in z.namelist() if n.lower().endswith(".png")]
    assert len(pngs) == 59, f"Expected 59 PNG files, got {len(pngs)}"
    for name in pngs:
        with z.open(name) as image:
            header = image.read(24)
        assert header[:8] == b"\x89PNG\r\n\x1a\n", name
        assert struct.unpack(">II", header[16:24]) == (1536, 1024), name
(out / (manifest["filename"] + ".sha256")).write_text(manifest["sha256"] + "  " + manifest["filename"] + "\n")
print(f"Verified exact original archive: {archive.name}, {manifest['size']} bytes, 59 PNGs")
