# Community visual workbench powered by PyAutoLens — 3D teaching, 31 products, bilingual UI

Hi PyAutoLens / PyAutoLabs team,

Thank you for developing PyAutoLens. I have built an independent community visual workbench using PyAutoLens as its lensing engine and would like to share it here for feedback.

**Repository:** https://github.com/SiriusFzh/PyAutoLens-Workbench
**Release:** https://github.com/SiriusFzh/PyAutoLens-Workbench/releases/tag/v1.0.0
**Documentation:** [English](https://github.com/SiriusFzh/PyAutoLens-Workbench#readme) / [简体中文](https://github.com/SiriusFzh/PyAutoLens-Workbench/blob/main/README.zh-CN.md)

It is one local browser application for macOS and Windows, with English on first visit and a Chinese language switch. Python performs the calculations locally. The original workbench code is MIT licensed.

The current interface provides:

- A draggable 3D thin-lens teaching scene, with synchronized parameter controls and a comparison between a browser approximation and a PyAutoLens numerical image.
- Four starting presets and 32 controls for lens mass, lens / source light, observing conditions and masks.
- 31 computed products, including data / model components, residual diagnostics, deflections, convergence, shear and magnification.
- PNG previews and native-array FITS / CSV exports, plus ZIP bundles with configuration and provenance metadata.
- A teaching-oriented bounded least-squares fit to frozen simulated data.

![Workbench home and 3D geometry](https://raw.githubusercontent.com/SiriusFzh/PyAutoLens-Workbench/main/docs/screenshots/01-geometry.jpg)

The README explicitly credits and links to PyAutoLens, its documentation and citation guidance. This is an independent community project, and I do not claim official affiliation or endorsement.

Its present scope is forward simulation and teaching fits. It is not a full no-code PyAutoLens / PyAutoFit frontend: real-data ingestion, full FitImaging workflows, posterior inference, pixelized inversions and interferometry are not yet integrated. The 3D rays are illustrative, and Einstein radius is an explicit angular parameter rather than inferred from physical mass and redshift.

I checked installation and launch on an Apple Silicon Mac with Python 3.12, inspected the 3D view and language switching, verified all 31 products and noisy simulation, tested PNG / FITS / CSV / ZIP exports, and ran a synthetic-data quick fit. The original portable bundle records previous Windows + Edge checks; I have not repeated Windows verification for this release. Functional checks do not establish research-grade accuracy for every configuration.

Would this be useful as a community teaching / visualization resource? I would welcome feedback on scientific assumptions, API usage and presentation. If you would like to include a link in your community resources or documentation, I would be happy to prepare a small, focused documentation PR in the repository you recommend.

The publication documentation, packaging and English-default adjustments were prepared with AI coding assistance; I remain responsible for this contribution and its claims.

Thank you for your time!

— SiriusFzh
