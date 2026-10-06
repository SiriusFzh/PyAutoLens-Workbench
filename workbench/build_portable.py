"""Build one cross-platform source ZIP, including bilingual docs and screenshots."""

from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

WORKBENCH_DIR = Path(__file__).resolve().parent
PROJECT_DIR = WORKBENCH_DIR.parent
DELIVERY_DIR = PROJECT_DIR / "deliverables"
VERSION = "1.0.0"
ARCHIVE_PATH = DELIVERY_DIR / f"PyAutoLens-Workbench-v{VERSION}.zip"
ARCHIVE_ROOT = "PyAutoLens-Workbench"

# Explicit selection excludes local environments, fonts, caches and draft files.
SOURCE_FILES = (
    "README.md", "README.zh-CN.md", "LICENSE", "THIRD_PARTY_NOTICES.md",
    "CHANGELOG.md", "start.py", "lessons/0002-lensing-planes-3d.html",
    "workbench/START_MAC.command", "workbench/START_WINDOWS.cmd",
    "workbench/requirements.txt", "workbench/server.py",
    "workbench/lensing_engine.py", "workbench/product_registry.py",
    "workbench/product_export.py", "workbench/capability_registry.py",
    "workbench/build_portable.py", "workbench/static/index.html",
    "workbench/static/app.js", "workbench/static/styles.css",
    "workbench/static/vendor/three.module.js",
    "workbench/static/vendor/OrbitControls.js",
    "workbench/static/vendor/LICENSE-three.js",
)


def portable_files() -> list[tuple[Path, str]]:
    paths = [PROJECT_DIR / name for name in SOURCE_FILES]
    missing = [str(path.relative_to(PROJECT_DIR)) for path in paths if not path.is_file()]
    if missing:
        raise FileNotFoundError("Missing distribution files: " + ", ".join(missing))
    paths.extend((PROJECT_DIR / "docs" / "screenshots").glob("*.jpg"))
    return sorted(
        ((path, f"{ARCHIVE_ROOT}/{path.relative_to(PROJECT_DIR).as_posix()}") for path in paths),
        key=lambda item: item[1],
    )


def build() -> Path:
    files = portable_files()
    ARCHIVE_PATH.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(ARCHIVE_PATH, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for source, archive_name in files:
            data = source.read_bytes()
            if source.name == "START_WINDOWS.cmd":
                data = source.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\n", "\r\n").encode("utf-8")
            info = ZipInfo(archive_name)
            info.create_system = 3
            info.compress_type = ZIP_DEFLATED
            info.external_attr = (0o755 if source.name == "START_MAC.command" else 0o644) << 16
            archive.writestr(info, data)
    return ARCHIVE_PATH


if __name__ == "__main__":
    output = build()
    print(f"Portable bundle saved to: {output}")
    print(f"Bundle size: {output.stat().st_size / (1024 * 1024):.2f} MB")
