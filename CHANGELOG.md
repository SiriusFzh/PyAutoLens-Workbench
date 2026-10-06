# Changelog

## Unreleased

- Remove duplicate start instructions, portable metadata, publication draft and legacy audit reports; bilingual READMEs remain the source of usage and scope documentation.
- Build ZIPs from an explicit file list so development-only files cannot be included accidentally.

## v1.0.0 — 2026-10-06

First public release of the independent PyAutoLens Visual Workbench.

- One local browser application for macOS and Windows, powered by PyAutoLens.
- A shared Python launcher creates an isolated environment and retries interrupted dependency installation.
- English on first visit, with Chinese switching and saved language preferences, including the 3D scene.
- Four lensing presets, 32 parameter controls, and synchronized interactive 3D geometry.
- 31 scientific products across five categories, plus teaching-oriented bounded least-squares fits.
- PNG, native-array FITS / CSV, and ZIP exports with configuration and provenance metadata.
- Detailed English and Chinese README pages, upstream attribution and citation links.
- MIT license for original code; Three.js license preserved. The public archive uses system fonts and excludes optional local font binaries, Python environments and caches.

Validated on Apple Silicon macOS with Python 3.12: launch, 3D scene, language switching / persistence, all 31 products, noisy simulation, and PNG / FITS / CSV / ZIP export. Windows launch files are provided; the original bundle reports earlier Windows + Edge checks, and this release preparation did not repeat them.

Scope: forward simulation and teaching fits. Full real-data ingestion, posterior inference, pixelized inversion, interferometric analysis and other complete research workflows remain outside the current interface.
