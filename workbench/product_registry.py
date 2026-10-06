"""
Research Product Registry
=========================

Define every selectable and downloadable scientific product once.  The engine,
capability endpoint, browser and exporters consume this registry so labels,
units, normalization and scientific availability remain consistent.

__Contents__

- **Categories:** Order the research product library for the desktop UI.
- **Products:** Describe computed raster products and their download formats.
- **Workflow Modules:** Declare important PyAutoLens paths that need extra data
  or a completed fit instead of presenting them as fabricated live products.
- **Validation:** Reject unknown or duplicated product identifiers.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Iterable


"""__Categories__"""

PRODUCT_CATEGORIES = (
    {
        "id": "observation",
        "labels": {"zh-CN": "观测与预处理", "en": "Observation & preprocessing"},
    },
    {
        "id": "components",
        "labels": {"zh-CN": "模型与分量", "en": "Model & components"},
    },
    {
        "id": "diagnostics",
        "labels": {"zh-CN": "残差与似然诊断", "en": "Residual & likelihood diagnostics"},
    },
    {
        "id": "transforms",
        "labels": {"zh-CN": "显示变换", "en": "Display transforms"},
    },
    {
        "id": "lens_physics",
        "labels": {"zh-CN": "透镜物理量", "en": "Lens physics"},
    },
)


"""__Products__"""


@dataclass(frozen=True)
class ProductSpec:
    id: str
    category: str
    unit: str
    norm: str
    labels: dict[str, dict[str, str]]
    stage: str = "forward"
    kind: str = "raster"
    coordinate_frame: str = "image_plane"
    floor_zero: bool = False
    pre_transformed: bool = False
    allow_mask_overlay: bool = True
    download_formats: tuple[str, ...] = ("png", "fits", "csv")


def _labels(zh_title: str, zh_description: str, en_title: str, en_description: str) -> dict[str, dict[str, str]]:
    return {
        "zh-CN": {"title": zh_title, "description": zh_description},
        "en": {"title": en_title, "description": en_description},
    }


PRODUCT_SPECS = (
    ProductSpec("observed", "observation", "e⁻ s⁻¹", "linear", _labels(
        "合成观测图", "前景透镜光、被透镜源、PSF 与所选噪声共同构成的数据。",
        "Simulated Observation", "Lens light, lensed source light, PSF and the selected noise realization.",
    )),
    ProductSpec("noise", "observation", "e⁻ s⁻¹", "linear", _labels(
        "噪声图", "每个像素的一倍标准差不确定度。",
        "Noise Map", "The one-sigma uncertainty assigned to each image pixel.",
    ), floor_zero=True),
    ProductSpec("signal_to_noise", "observation", "S/N", "linear", _labels(
        "信噪比图", "观测值除以逐像素噪声。",
        "Signal-to-noise Map", "Observed intensity divided by the pixel noise.",
    )),
    ProductSpec("psf", "observation", "normalized", "linear", _labels(
        "点扩散函数 PSF", "当前高斯 PSF 的归一化二维核。",
        "Point-spread Function", "The normalized two-dimensional kernel of the active Gaussian PSF.",
    ), floor_zero=True, allow_mask_overlay=False),
    ProductSpec("mask", "observation", "0 / 1", "categorical", _labels(
        "拟合掩膜", "1 表示纳入当前拟合孔径，0 表示排除。",
        "Fit Mask", "One marks pixels inside the fitting aperture and zero marks excluded pixels.",
    ), allow_mask_overlay=False),
    ProductSpec("masked_observed", "observation", "e⁻ s⁻¹", "linear", _labels(
        "掩膜后的观测图", "仅保留当前圆形拟合区域内的数据。",
        "Masked Observation", "Observed data retained inside the current circular fitting region.",
    )),
    ProductSpec("model", "components", "e⁻ s⁻¹", "linear", _labels(
        "PSF 卷积模型", "与数据比较的完整无噪声模型。",
        "PSF-convolved Model", "The complete noise-free model compared with the data.",
    ), floor_zero=True),
    ProductSpec("ideal_model", "components", "e⁻ s⁻¹", "linear", _labels(
        "未卷积理想模型", "望远镜 PSF 作用前的透镜光与被透镜源之和。",
        "Unconvolved Ideal Model", "Lens and lensed-source light before telescope PSF convolution.",
    ), floor_zero=True),
    ProductSpec("lens_light", "components", "e⁻ s⁻¹", "linear", _labels(
        "卷积后透镜星光", "经过 PSF 卷积的前景透镜星系星光。",
        "Convolved Lens Light", "Foreground lens-galaxy starlight after PSF convolution.",
    ), floor_zero=True),
    ProductSpec("unblurred_lens_light", "components", "e⁻ s⁻¹", "linear", _labels(
        "未卷积透镜星光", "PSF 作用前的前景透镜星系星光。",
        "Unconvolved Lens Light", "Foreground lens-galaxy starlight before PSF convolution.",
    ), floor_zero=True),
    ProductSpec("lensed_source", "components", "e⁻ s⁻¹", "linear", _labels(
        "卷积后被透镜源", "经质量分布射线追踪并由 PSF 卷积的背景源像。",
        "Convolved Lensed Source", "Ray-traced background-source image after PSF convolution.",
    ), floor_zero=True),
    ProductSpec("unblurred_lensed_source", "components", "e⁻ s⁻¹", "linear", _labels(
        "未卷积被透镜源", "PSF 作用前的背景源环、弧或多像。",
        "Unconvolved Lensed Source", "Background-source rings, arcs or multiple images before PSF convolution.",
    ), floor_zero=True),
    ProductSpec("source_plane", "components", "e⁻ s⁻¹", "linear", _labels(
        "源平面亮度", "未经透镜前的背景源本征亮度分布。",
        "Source-plane Brightness", "Intrinsic source brightness before lensing.",
    ), coordinate_frame="source_plane", floor_zero=True, allow_mask_overlay=False),
    ProductSpec("lens_light_subtracted", "components", "e⁻ s⁻¹", "linear", _labels(
        "透镜光扣除图", "观测数据减去前景透镜星光模型。",
        "Lens-light Subtracted", "Observed data minus the foreground lens-light model.",
    )),
    ProductSpec("residual", "diagnostics", "e⁻ s⁻¹", "symmetric", _labels(
        "残差图", "观测数据减去当前无噪声模型。",
        "Residual Map", "Observed data minus the current noise-free model.",
    )),
    ProductSpec("normalized_residual", "diagnostics", "σ", "symmetric", _labels(
        "归一化残差", "残差除以逐像素噪声，以标准差为单位。",
        "Normalized Residual", "Residual divided by the pixel noise, in standard deviations.",
    )),
    ProductSpec("chi_squared", "diagnostics", "χ² / pixel", "linear", _labels(
        "逐像素 χ²", "归一化残差平方后对总 χ² 的逐像素贡献。",
        "Per-pixel Chi-squared", "The squared normalized residual contributed by every fitted pixel.",
    ), floor_zero=True),
    ProductSpec("residual_flux_fraction", "diagnostics", "fraction", "symmetric", _labels(
        "残差通量分数", "(数据－模型)/数据；仅应在高信噪比区域解释。",
        "Residual Flux Fraction", "(data - model) / data; interpret only in high signal-to-noise regions.",
    )),
    ProductSpec("log10_model", "transforms", "log₁₀(e⁻ s⁻¹)", "linear", _labels(
        "模型 log₁₀ 图", "对模型取十进对数以显示微弱外侧结构。",
        "Log10 Model", "Base-10 logarithm of the model for faint outer structure.",
    ), pre_transformed=True, allow_mask_overlay=False),
    ProductSpec("convergence", "lens_physics", "κ", "linear", _labels(
        "汇聚度 κ", "投影面密度相对临界面密度的无量纲映射。",
        "Convergence κ", "Dimensionless projected surface density relative to the critical density.",
    ), floor_zero=True, allow_mask_overlay=False),
    ProductSpec("potential", "lens_physics", "arcsec²", "linear", _labels(
        "透镜势 ψ", "产生当前偏折场的二维透镜势。",
        "Lensing Potential ψ", "The two-dimensional lensing potential generating the deflection field.",
    ), allow_mask_overlay=False),
    ProductSpec("deflection_y", "lens_physics", "arcsec", "symmetric", _labels(
        "偏折角 αy", "偏折场沿 PyAutoLens y 轴的分量。",
        "Deflection αy", "The y component of the deflection-angle field.",
    ), allow_mask_overlay=False),
    ProductSpec("deflection_x", "lens_physics", "arcsec", "symmetric", _labels(
        "偏折角 αx", "偏折场沿 PyAutoLens x 轴的分量。",
        "Deflection αx", "The x component of the deflection-angle field.",
    ), allow_mask_overlay=False),
    ProductSpec("deflection_magnitude", "lens_physics", "arcsec", "linear", _labels(
        "偏折角模长 |α|", "二维偏折向量的欧氏模长。",
        "Deflection Magnitude |α|", "Euclidean magnitude of the two-dimensional deflection vector.",
    ), floor_zero=True, allow_mask_overlay=False),
    ProductSpec("shear_gamma_1", "lens_physics", "γ₁", "symmetric", _labels(
        "剪切分量 γ₁", "由偏折场 Hessian 计算的第一剪切分量。",
        "Shear Component γ₁", "First shear component computed from the deflection-field Hessian.",
    ), allow_mask_overlay=False),
    ProductSpec("shear_gamma_2", "lens_physics", "γ₂", "symmetric", _labels(
        "剪切分量 γ₂", "由偏折场 Hessian 计算的第二剪切分量。",
        "Shear Component γ₂", "Second shear component computed from the deflection-field Hessian.",
    ), allow_mask_overlay=False),
    ProductSpec("shear_magnitude", "lens_physics", "|γ|", "linear", _labels(
        "剪切模长 |γ|", "两个剪切分量的欧氏模长。",
        "Shear Magnitude |γ|", "Euclidean magnitude of the two shear components.",
    ), floor_zero=True, allow_mask_overlay=False),
    ProductSpec("magnification", "lens_physics", "μ", "symmetric", _labels(
        "有符号放大率 μ", "雅可比行列式的倒数；负值表示奇偶性翻转。",
        "Signed Magnification μ", "Inverse Jacobian determinant; negative values indicate reversed parity.",
    ), allow_mask_overlay=False),
    ProductSpec("jacobian_determinant", "lens_physics", "det A", "symmetric", _labels(
        "雅可比行列式 det A", "像平面到源平面映射的局部面积缩放；零等值线为临界曲线。",
        "Jacobian Determinant det A", "Local area scaling of the image-to-source mapping; its zero contour is critical.",
    ), allow_mask_overlay=False),
    ProductSpec("tangential_eigenvalue", "lens_physics", "λₜ", "symmetric", _labels(
        "切向本征值 λₜ", "切向临界曲线在该本征值为零处形成。",
        "Tangential Eigenvalue λₜ", "Tangential critical curves form where this eigenvalue is zero.",
    ), allow_mask_overlay=False),
    ProductSpec("radial_eigenvalue", "lens_physics", "λᵣ", "symmetric", _labels(
        "径向本征值 λᵣ", "径向临界曲线在该本征值为零处形成。",
        "Radial Eigenvalue λᵣ", "Radial critical curves form where this eigenvalue is zero.",
    ), allow_mask_overlay=False),
)

PRODUCT_BY_ID = {spec.id: spec for spec in PRODUCT_SPECS}


"""__Workflow Modules__"""

WORKFLOW_MODULES: tuple[dict[str, Any], ...] = (
    {
        "id": "real_imaging",
        "state": "requires_dataset",
        "requirements": ["data.fits", "noise_map.fits", "psf.fits", "contaminant review", "confirmed mask"],
        "labels": {"zh-CN": "真实成像导入与质检", "en": "Real imaging import & quality control"},
    },
    {
        "id": "fit_imaging",
        "state": "requires_fit",
        "requirements": ["Imaging", "Mask2D", "Tracer or model instance"],
        "labels": {"zh-CN": "FitImaging 研究诊断", "en": "FitImaging research diagnostics"},
    },
    {
        "id": "posterior_search",
        "state": "not_adapted",
        "requirements": ["PyAutoFit model", "priors", "search", "resumable output"],
        "labels": {"zh-CN": "后验搜索与证据", "en": "Posterior search & evidence"},
    },
    {
        "id": "pixelized_source",
        "state": "not_adapted",
        "requirements": ["mesh", "regularization", "inversion", "adapt images"],
        "labels": {"zh-CN": "像素化源与反演", "en": "Pixelized source & inversion"},
    },
    {
        "id": "interferometer",
        "state": "requires_dataset",
        "requirements": ["visibilities", "noise map", "uv wavelengths", "transformer"],
        "labels": {"zh-CN": "干涉仪可见度", "en": "Interferometer visibilities"},
    },
    {
        "id": "point_source",
        "state": "requires_dataset",
        "requirements": ["PointDataset", "position/flux/time-delay uncertainties"],
        "labels": {"zh-CN": "点源、通量与时延", "en": "Point sources, fluxes & time delays"},
    },
    {
        "id": "multi_dataset",
        "state": "not_adapted",
        "requirements": ["multiple exposures or bands", "shared model", "factor graph"],
        "labels": {"zh-CN": "多波段与联合数据", "en": "Multi-band & joint datasets"},
    },
    {
        "id": "sensitivity",
        "state": "requires_fit",
        "requirements": ["baseline result", "perturbation model", "grid search"],
        "labels": {"zh-CN": "子结构与灵敏度映射", "en": "Substructure & sensitivity mapping"},
    },
)


"""__Validation__"""


def validate_product_ids(product_ids: Iterable[str] | None) -> list[str]:
    requested = list(PRODUCT_BY_ID) if product_ids is None else list(dict.fromkeys(product_ids))
    unknown = sorted(set(requested) - set(PRODUCT_BY_ID))
    if unknown:
        raise ValueError(f"Unknown product identifiers: {', '.join(unknown)}")
    return requested


def catalog_document() -> dict[str, Any]:
    return {
        "schema_version": 1,
        "categories": list(PRODUCT_CATEGORIES),
        "products": [
            {
                **asdict(spec),
                "download_formats": list(spec.download_formats),
                "state": "available",
                "requirements": [],
            }
            for spec in PRODUCT_SPECS
        ],
        "workflow_modules": [dict(module) for module in WORKFLOW_MODULES],
    }
