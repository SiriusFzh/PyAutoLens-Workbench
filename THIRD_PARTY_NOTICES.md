# Third-party notices / 第三方说明

## PyAutoLens and its scientific stack

This independent workbench depends on [PyAutoLens](https://github.com/PyAutoLabs/PyAutoLens), maintained by PyAutoLabs and its contributors. PyAutoLens provides the core lensing engine and is distributed under its [upstream MIT license](https://github.com/PyAutoLabs/PyAutoLens/blob/main/LICENSE). It is installed as a dependency; its source is not vendored in this repository. Its parent libraries and other Python dependencies retain their respective licenses.

本工作台依赖 PyAutoLens。原团队保留其软件与科学方法的署名；本仓库的 MIT 许可证只适用于本工作台原创代码，不能代替第三方依赖的许可证。研究引用请参照 [PyAutoLens 官方说明](https://pyautolens.readthedocs.io/en/latest/general/citations.html)。

## Three.js r161

`workbench/static/vendor/three.module.js` and `OrbitControls.js` are bundled Three.js r161 assets. Three.js is MIT licensed, copyright © 2010–2024 three.js authors. The complete license is preserved in [workbench/static/vendor/LICENSE-three.js](workbench/static/vendor/LICENSE-three.js). `OrbitControls.js` uses a relative import for the bundled module.

## Optional fonts in the supplied local bundle

The original user-supplied portable archive includes Satoshi (Indian Type Foundry / Fontshare FFL) and MiSans (Xiaomi), with their own license documents. They are **not** covered by this project's MIT license and are **not distributed in this GitHub source or rebuilt portable archives**. Local copies remain on the original machine. The published CSS uses system-font fallbacks.

原便携包中的 Satoshi 和 MiSans 字体文件不纳入 GitHub 发布。随包 Fontshare FFL 明确限制将字体放入公开仓库分发，因此发布版使用系统字体，保留原始本机文件供用户自行按许可使用。

## Attribution and affiliation

Original workbench code and documentation: © 2026 SiriusFzh. Third-party names identify dependencies and attribution. This is a community project and does not imply endorsement by PyAutoLabs, Fontshare, Xiaomi, or the Three.js maintainers.
