"""
Build the Portable PyAutoLens Workbench Bundle
==============================================

Package the local web workbench and the upgraded 3D lesson into one small ZIP
that preserves the macOS launcher executable bit and Windows CRLF line endings.
Python environments and generated caches are intentionally excluded.

__Contents__

- **Paths:** Resolve the project, workbench and delivery locations.
- **Selection:** Choose portable source files, capability documentation and the standalone 3D lesson.
- **Archive:** Write a deterministic cross-platform ZIP and launch instructions.
"""

from __future__ import annotations

from datetime import date
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


"""__Paths__"""
WORKBENCH_DIR = Path(__file__).resolve().parent
PROJECT_DIR = WORKBENCH_DIR.parent
DELIVERY_DIR = PROJECT_DIR / "deliverables"
VERSION = "1.0.0"
ARCHIVE_PATH = DELIVERY_DIR / f"PyAutoLens-Workbench-v{VERSION}.zip"
ARCHIVE_ROOT = "PyAutoLens-Workbench"


"""
__Selection__

The archive contains source and launch files only.  On first launch each computer
creates its own `.venv`, avoiding non-portable compiled packages from Windows.
"""
EXCLUDED_PARTS = {".venv", "__pycache__", "portable-build", "tests"}
EXCLUDED_SUFFIXES = {".pyc", ".pyo", ".log"}
REQUIRED_WORKBENCH_FILES = {
    Path("capability_registry.py"),
    Path("product_registry.py"),
    Path("product_export.py"),
}


def portable_files() -> list[tuple[Path, str]]:
    selected: list[tuple[Path, str]] = []
    for path in WORKBENCH_DIR.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(WORKBENCH_DIR)
        if any(part in EXCLUDED_PARTS for part in relative.parts):
            continue
        if relative.parts[:2] == ("static", "fonts"):
            continue  # Separately licensed local fonts are not redistributable source assets.
        if path.suffix.lower() in EXCLUDED_SUFFIXES:
            continue
        selected.append((path, f"{ARCHIVE_ROOT}/workbench/{relative.as_posix()}"))
    selected_relative = {source.relative_to(WORKBENCH_DIR) for source, _ in selected}
    missing_required = sorted(REQUIRED_WORKBENCH_FILES - selected_relative, key=str)
    if missing_required:
        missing_names = ", ".join(path.as_posix() for path in missing_required)
        raise FileNotFoundError(f"Portable bundle is missing required workbench files: {missing_names}")
    lesson = PROJECT_DIR / "lessons" / "0002-lensing-planes-3d.html"
    selected.append((lesson, f"{ARCHIVE_ROOT}/lessons/{lesson.name}"))
    for name in ("README.md", "README.zh-CN.md", "LICENSE", "THIRD_PARTY_NOTICES.md", "CHANGELOG.md", "start.py"):
        path = PROJECT_DIR / name
        if path.is_file():
            selected.append((path, f"{ARCHIVE_ROOT}/{name}"))
    for path in (PROJECT_DIR / "docs" / "screenshots").glob("*.jpg"):
        selected.append((path, f"{ARCHIVE_ROOT}/docs/screenshots/{path.name}"))
    return sorted(selected, key=lambda item: item[1])


"""
__Archive__

The root README keeps the first action obvious after extraction.  `external_attr`
marks `START_MAC.command` executable on Unix-aware unzip tools; the documented
`bash START_MAC.command` command remains a fallback if Gatekeeper removes that bit.
"""


def write_text(archive: ZipFile, name: str, text: str, executable: bool = False) -> None:
    info = ZipInfo(name)
    info.create_system = 3
    info.compress_type = ZIP_DEFLATED
    info.external_attr = ((0o755 if executable else 0o644) & 0xFFFF) << 16
    archive.writestr(info, text.encode("utf-8"))


def build() -> Path:
    DELIVERY_DIR.mkdir(parents=True, exist_ok=True)
    quick_start = """# PyAutoLens Workbench — Start Here

This bundle contains a local visual workbench; it does not upload your parameters or images.

- macOS: open `workbench/START_MAC.command`. If macOS blocks it, open Terminal in the `workbench` folder and run `bash START_MAC.command`.
- Windows: double-click `workbench/START_WINDOWS.cmd`.

Both platform shortcuts call the shared start.py launcher. The first launch creates a local Python environment and installs PyAutoLens; interrupted installs retry on the next launch. Python 3.12 or newer is required. Later launches open directly in your browser.

The workbench opens in the 3D geometry view with English as the default language. Four centralized lens presets feed the same model as the four collapsed parameter groups, and the `EN` / `中文` button switches the interface language. Its research-product library computes 31 forward-model rasters on demand. Each product can be downloaded as a high-resolution PNG preview or as native-array FITS/CSV data; the current group or the complete library can be downloaded as a ZIP containing high-resolution PNG previews, native FITS arrays, configuration and provenance metadata.

This is a forward-simulation and teaching-fit workbench, not a complete no-code PyAutoLens or PyAutoFit / Nautilus frontend. Workflows that require real data, a standard fit or posterior samples remain explicitly unavailable until those inputs exist. PyTorch Lightning is not a core dependency because it is a neural-network training framework, not the current lens-physics engine. After launch, append `/api/capabilities` or `/api/catalog` to the local address printed by the launcher (usually `http://127.0.0.1:8765`); see [the coverage report](workbench/PYAUTOLENS_COVERAGE.md) and [the research-product catalog](workbench/RESEARCH_PRODUCT_CATALOG.md) for the human-readable audits.
"""
    manifest = {
        "name": "PyAutoLens Visual Workbench",
        "version": VERSION,
        "default_language": "en",
        "distribution": "one local web application for macOS and Windows",
        "bundle_date": date.today().isoformat(),
        "autolens_version": "2026.9.15.1",
        "python_requires": ">=3.12",
        "entrypoints": {
            "macos": "workbench/START_MAC.command",
            "windows": "workbench/START_WINDOWS.cmd",
        },
        "capabilities": {
            "endpoint": "/api/capabilities",
            "product_catalog_endpoint": "/api/catalog",
            "registry": "workbench/capability_registry.py",
            "product_registry": "workbench/product_registry.py",
            "product_exporter": "workbench/product_export.py",
            "coverage_report": "workbench/PYAUTOLENS_COVERAGE.md",
            "research_product_catalog": "workbench/RESEARCH_PRODUCT_CATALOG.md",
            "live_forward_products": 31,
            "individual_export_formats": ["png", "fits", "csv"],
            "bundle_export_formats": ["png", "fits"],
            "is_full_pyautolens_frontend": False,
        },
    }
    with ZipFile(ARCHIVE_PATH, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        write_text(archive, f"{ARCHIVE_ROOT}/START_HERE.md", quick_start)
        write_text(
            archive,
            f"{ARCHIVE_ROOT}/PORTABLE_MANIFEST.json",
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        )
        for source, archive_name in portable_files():
            data = source.read_bytes()
            executable = source.name == "START_MAC.command"
            if source.name == "START_WINDOWS.cmd":
                data = source.read_text(encoding="utf-8").replace("\r\n", "\n").replace("\n", "\r\n").encode("utf-8")
            info = ZipInfo(archive_name)
            info.create_system = 3
            info.compress_type = ZIP_DEFLATED
            info.external_attr = ((0o755 if executable else 0o644) & 0xFFFF) << 16
            archive.writestr(info, data)
    return ARCHIVE_PATH


if __name__ == "__main__":
    output = build()
    print(f"Portable bundle saved to: {output}")
    print(f"Bundle size: {output.stat().st_size / (1024 * 1024):.2f} MB")
