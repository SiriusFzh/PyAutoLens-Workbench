# PyAutoLens Workbench — Start Here

This bundle contains a local visual workbench; it does not upload your parameters or images.

- macOS: open `workbench/START_MAC.command`. If macOS blocks it, open Terminal in the `workbench` folder and run `bash START_MAC.command`.
- Windows: double-click `workbench/START_WINDOWS.cmd`.

The first launch creates a local Python environment and installs PyAutoLens. Python 3.12 or newer is required. Later launches open directly in your browser.

The workbench opens in the 3D geometry view with English as the default language. Four centralized lens presets feed the same model as the four collapsed parameter groups, and the `EN` / `中文` button switches the interface language. Its research-product library computes 31 forward-model rasters on demand. Each product can be downloaded as a high-resolution PNG preview or as native-array FITS/CSV data; the current group or the complete library can be downloaded as a ZIP containing high-resolution PNG previews, native FITS arrays, configuration and provenance metadata.

This is a forward-simulation and teaching-fit workbench, not a complete no-code PyAutoLens or PyAutoFit / Nautilus frontend. Workflows that require real data, a standard fit or posterior samples remain explicitly unavailable until those inputs exist. PyTorch Lightning is not a core dependency because it is a neural-network training framework, not the current lens-physics engine. After launch, append `/api/capabilities` or `/api/catalog` to the local address printed by the launcher (usually `http://127.0.0.1:8765`); see [the coverage report](workbench/PYAUTOLENS_COVERAGE.md) and [the research-product catalog](workbench/RESEARCH_PRODUCT_CATALOG.md) for the human-readable audits.
