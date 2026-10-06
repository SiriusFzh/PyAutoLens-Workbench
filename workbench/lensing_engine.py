"""
Portable PyAutoLens Simulation Engine
=====================================

Expose one stable simulation interface for the portable visual workbench.  The
browser supplies physical and observing parameters; this module validates them,
constructs a PyAutoLens tracer, and returns every derived image product together.

__Contents__

- **Imports:** Load the numerical and PyAutoLens dependencies.
- **Configuration:** Validate and normalize the user-editable parameters.
- **Profiles:** Construct the lens mass, lens light and source light profiles.
- **Simulation:** Ray trace the scene and add PSF and detector effects.
- **Products:** Return portable arrays and metadata for the browser interface.
"""

from autonerves import jax_wrapper  # noqa: F401  (selects the numerical backend)

from dataclasses import asdict, dataclass
from time import perf_counter
from typing import Any, Mapping

import autolens as al
import numpy as np
from scipy.ndimage import gaussian_filter
from scipy.optimize import least_squares

from product_registry import PRODUCT_BY_ID, validate_product_ids


"""
__Configuration__

Angular quantities use arcseconds.  PyAutoLens stores profile centres as
``(y, x)``; the public workbench interface deliberately exposes ``x`` and ``y``
separately so the screen convention remains obvious.  Bounds protect the local
server from accidental allocations or singular profile parameters.
"""


@dataclass(frozen=True)
class SimulationConfig:
    mass_model: str = "isothermal_shear"
    image_pixels: int = 101
    pixel_scale: float = 0.05
    lens_redshift: float = 0.5
    source_redshift: float = 1.0
    lens_x: float = 0.0
    lens_y: float = 0.0
    einstein_radius: float = 1.0
    mass_axis_ratio: float = 0.88
    mass_angle: float = 15.0
    shear_gamma_1: float = 0.0
    shear_gamma_2: float = 0.0
    lens_light_enabled: bool = True
    lens_intensity: float = 0.28
    lens_effective_radius: float = 0.58
    lens_sersic_index: float = 2.4
    lens_axis_ratio: float = 0.76
    lens_angle: float = 18.0
    source_x: float = 0.12
    source_y: float = 0.05
    source_model: str = "sersic"
    source_intensity: float = 1.0
    source_effective_radius: float = 0.10
    source_sersic_index: float = 1.0
    source_axis_ratio: float = 0.82
    source_angle: float = 35.0
    psf_sigma: float = 0.06
    exposure_time: float = 300.0
    background_sky: float = 0.05
    add_poisson_noise: bool = False
    noise_seed: int = 1
    mask_radius: float = 2.3

    @classmethod
    def from_mapping(cls, values: Mapping[str, Any] | None) -> "SimulationConfig":
        supplied = dict(values or {})
        known = {field_name for field_name in cls.__dataclass_fields__}
        unknown = sorted(set(supplied) - known)
        if unknown:
            raise ValueError(f"Unknown configuration fields: {', '.join(unknown)}")
        config = cls(**supplied)
        config._validate()
        return config

    def _validate(self) -> None:
        if self.mass_model not in {"isothermal_sph", "isothermal", "isothermal_shear"}:
            raise ValueError("mass_model must be isothermal_sph, isothermal, or isothermal_shear")
        if self.source_model not in {"sersic", "point"}:
            raise ValueError("source_model must be sersic or point")
        if self.image_pixels < 51 or self.image_pixels > 181 or self.image_pixels % 2 == 0:
            raise ValueError("image_pixels must be an odd number between 51 and 181")
        if not 0.01 <= self.pixel_scale <= 0.12:
            raise ValueError("pixel_scale must be between 0.01 and 0.12 arcsec/pixel")
        if not 0.0 < self.lens_redshift < self.source_redshift <= 6.0:
            raise ValueError("redshifts must satisfy 0 < lens_redshift < source_redshift <= 6")
        if not 0.05 <= self.einstein_radius <= 3.0:
            raise ValueError("einstein_radius must be between 0.05 and 3.0 arcsec")
        for name in ("mass_axis_ratio", "lens_axis_ratio", "source_axis_ratio"):
            if not 0.2 <= getattr(self, name) <= 1.0:
                raise ValueError(f"{name} must be between 0.2 and 1.0")
        for name in ("lens_effective_radius", "source_effective_radius"):
            if not 0.005 <= getattr(self, name) <= 3.0:
                raise ValueError(f"{name} is outside the supported range")
        for name in ("lens_sersic_index", "source_sersic_index"):
            if not 0.3 <= getattr(self, name) <= 8.0:
                raise ValueError(f"{name} must be between 0.3 and 8.0")
        if not 0.0 <= self.psf_sigma <= 0.5:
            raise ValueError("psf_sigma must be between 0 and 0.5 arcsec")
        if not 1.0 <= self.exposure_time <= 100000.0:
            raise ValueError("exposure_time is outside the supported range")
        if not 0.0 <= self.background_sky <= 1000.0:
            raise ValueError("background_sky must be non-negative")
        if not 0.1 <= self.mask_radius <= 10.0:
            raise ValueError("mask_radius must be between 0.1 and 10 arcsec")


DEFAULT_CONFIG = asdict(SimulationConfig())


"""
__Profiles__

The mass choices share one construction seam.  ``IsothermalSph`` supplies the
axisymmetric ring/double-image baseline; ``Isothermal`` adds ellipticity; and an
optional ``ExternalShear`` represents a tidal field from nearby structure.  Light
profiles remain independent of mass so their effects can be inspected separately.
"""


def _ell_comps(axis_ratio: float, angle: float) -> tuple[float, float]:
    return al.convert.ell_comps_from(axis_ratio=axis_ratio, angle=angle)


def _build_galaxies(config: SimulationConfig) -> tuple[al.Galaxy, al.Galaxy, al.Galaxy]:
    centre = (config.lens_y, config.lens_x)
    if config.mass_model == "isothermal_sph":
        mass = al.mp.IsothermalSph(
            centre=centre,
            einstein_radius=config.einstein_radius,
        )
    else:
        mass = al.mp.Isothermal(
            centre=centre,
            ell_comps=_ell_comps(config.mass_axis_ratio, config.mass_angle),
            einstein_radius=config.einstein_radius,
        )

    mass_components: dict[str, Any] = {
        "redshift": config.lens_redshift,
        "mass": mass,
    }
    if config.mass_model == "isothermal_shear":
        mass_components["shear"] = al.mp.ExternalShear(
            gamma_1=config.shear_gamma_1,
            gamma_2=config.shear_gamma_2,
        )
    mass_only_lens = al.Galaxy(**mass_components)

    luminous_components = dict(mass_components)
    if config.lens_light_enabled:
        luminous_components["bulge"] = al.lp.Sersic(
            centre=centre,
            ell_comps=_ell_comps(config.lens_axis_ratio, config.lens_angle),
            intensity=config.lens_intensity,
            effective_radius=config.lens_effective_radius,
            sersic_index=config.lens_sersic_index,
        )
    luminous_lens = al.Galaxy(**luminous_components)

    source_components: dict[str, Any] = {"redshift": config.source_redshift}
    if config.source_model == "sersic":
        source_components["bulge"] = al.lp.Sersic(
            centre=(config.source_y, config.source_x),
            ell_comps=_ell_comps(config.source_axis_ratio, config.source_angle),
            intensity=config.source_intensity,
            effective_radius=config.source_effective_radius,
            sersic_index=config.source_sersic_index,
        )
    source = al.Galaxy(**source_components)
    return luminous_lens, mass_only_lens, source


"""
__Simulation__

``Tracer.image_2d_from`` is the authoritative lensing calculation.  PSF blurring
and the Poisson realization are deterministic for a fixed seed, which makes the
interactive display reproducible while every parameter combination is still
computed on demand.  No preset image assets enter this path.
"""


def _native(array: Any) -> np.ndarray:
    native = getattr(array, "native", array)
    return np.asarray(native, dtype=float)


def _source_plane_image(config: SimulationConfig, grid: al.Grid2D) -> np.ndarray:
    if config.source_model == "point":
        image = np.zeros(grid.shape_native, dtype=float)
        row = (grid.shape_native[0] - 1) / 2 - config.source_y / config.pixel_scale
        column = (grid.shape_native[1] - 1) / 2 + config.source_x / config.pixel_scale
        rows, columns = np.indices(grid.shape_native)
        image += config.source_intensity * np.exp(
            -0.5 * ((rows - row) ** 2 + (columns - column) ** 2) / 0.65**2
        )
        return image
    profile = al.lp.Sersic(
        centre=(config.source_y, config.source_x),
        ell_comps=_ell_comps(config.source_axis_ratio, config.source_angle),
        intensity=config.source_intensity,
        effective_radius=config.source_effective_radius,
        sersic_index=config.source_sersic_index,
    )
    return _native(profile.image_2d_from(grid=grid))


def _point_magnifications(
    tracer: al.Tracer,
    positions: np.ndarray,
    epsilon: float,
) -> np.ndarray:
    magnifications = []
    for y_coordinate, x_coordinate in positions:
        sample_grid = al.Grid2DIrregular(
            values=[
                (y_coordinate + epsilon, x_coordinate),
                (y_coordinate - epsilon, x_coordinate),
                (y_coordinate, x_coordinate + epsilon),
                (y_coordinate, x_coordinate - epsilon),
            ]
        )
        deflections = np.asarray(
            tracer.deflections_yx_2d_from(grid=sample_grid),
            dtype=float,
        )
        derivative_y_y = (deflections[0, 0] - deflections[1, 0]) / (2 * epsilon)
        derivative_x_y = (deflections[0, 1] - deflections[1, 1]) / (2 * epsilon)
        derivative_y_x = (deflections[2, 0] - deflections[3, 0]) / (2 * epsilon)
        derivative_x_x = (deflections[2, 1] - deflections[3, 1]) / (2 * epsilon)
        determinant = (
            (1.0 - derivative_y_y) * (1.0 - derivative_x_x)
            - derivative_y_x * derivative_x_y
        )
        magnifications.append(1.0 / max(abs(determinant), 1.0e-4))
    return np.asarray(magnifications, dtype=float)


def _point_source_image(
    tracer: al.Tracer,
    grid: al.Grid2D,
    config: SimulationConfig,
) -> tuple[np.ndarray, list[dict[str, float]]]:
    solver = al.PointSolver.for_grid(
        grid=grid,
        pixel_scale_precision=min(0.001, config.pixel_scale / 10.0),
        magnification_threshold=0.01,
    )
    positions = np.asarray(
        solver.solve(
            tracer=tracer,
            source_plane_coordinate=(config.source_y, config.source_x),
        ),
        dtype=float,
    )
    image = np.zeros(grid.shape_native, dtype=float)
    if positions.size == 0:
        return image, []
    positions = positions.reshape((-1, 2))
    magnifications = _point_magnifications(
        tracer=tracer,
        positions=positions,
        epsilon=max(config.pixel_scale / 80.0, 1.0e-4),
    )
    rows, columns = np.indices(grid.shape_native)
    image_metadata = []
    for (y_coordinate, x_coordinate), magnification in zip(positions, magnifications):
        row = (grid.shape_native[0] - 1) / 2 - y_coordinate / config.pixel_scale
        column = (grid.shape_native[1] - 1) / 2 + x_coordinate / config.pixel_scale
        flux = config.source_intensity * min(float(magnification), 100.0)
        image += flux * np.exp(
            -0.5 * ((rows - row) ** 2 + (columns - column) ** 2) / 0.38**2
        )
        image_metadata.append(
            {
                "y": float(y_coordinate),
                "x": float(x_coordinate),
                "absolute_magnification": float(magnification),
            }
        )
    return image, image_metadata


def _apply_observing_effects(
    ideal: np.ndarray,
    config: SimulationConfig,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    sigma_pixels = config.psf_sigma / config.pixel_scale
    blurred = gaussian_filter(ideal, sigma=max(sigma_pixels, 0.0), mode="nearest")
    expected_counts = np.clip(
        (blurred + config.background_sky) * config.exposure_time,
        0.0,
        None,
    )
    noise = np.sqrt(np.maximum(expected_counts, 1.0)) / config.exposure_time
    if config.add_poisson_noise:
        rng = np.random.default_rng(config.noise_seed)
        observed = rng.poisson(expected_counts) / config.exposure_time - config.background_sky
    else:
        observed = blurred.copy()
    return blurred, observed, noise


"""
__Products__

One forward evaluation can expose any registered subset requested by the
interface.  Arrays remain scalar science products; colour maps and overlays are
display choices made by the browser.  The mask is one inside the fitted aperture
and zero outside it.
"""


def _json_array(array: np.ndarray) -> list[list[float | None]]:
    rounded = np.asarray(array, dtype=np.float32).round(7)
    return [
        [float(value) if np.isfinite(value) else None for value in row]
        for row in rounded
    ]


def _ideal_images(
    config: SimulationConfig,
) -> tuple[Any, np.ndarray, np.ndarray, np.ndarray, list[dict[str, float]], al.Tracer]:
    """Evaluate the shared PyAutoLens tracer path before observing effects."""

    grid = al.Grid2D.uniform(
        shape_native=(config.image_pixels, config.image_pixels),
        pixel_scales=config.pixel_scale,
    )
    luminous_lens, mass_only_lens, source = _build_galaxies(config)

    full_tracer = al.Tracer(galaxies=[luminous_lens, source])
    source_tracer = al.Tracer(galaxies=[mass_only_lens, source])
    point_images: list[dict[str, float]] = []
    if config.source_model == "point":
        lens_light = _native(full_tracer.image_2d_from(grid=grid))
        lensed_source, point_images = _point_source_image(
            tracer=source_tracer,
            grid=grid,
            config=config,
        )
        ideal = lens_light + lensed_source
    else:
        ideal = _native(full_tracer.image_2d_from(grid=grid))
        lensed_source = _native(source_tracer.image_2d_from(grid=grid))
        lens_light = np.clip(ideal - lensed_source, 0.0, None)
    return grid, lens_light, lensed_source, ideal, point_images, source_tracer


def _psf_kernel(config: SimulationConfig) -> np.ndarray:
    """Return a normalized, image-centred Gaussian PSF on the science grid."""

    rows, columns = np.indices((config.image_pixels, config.image_pixels), dtype=float)
    centre = (config.image_pixels - 1) / 2
    sigma_pixels = config.psf_sigma / config.pixel_scale
    if sigma_pixels <= 0:
        kernel = np.zeros((config.image_pixels, config.image_pixels), dtype=float)
        kernel[int(centre), int(centre)] = 1.0
        return kernel
    kernel = np.exp(-0.5 * (((rows - centre) / sigma_pixels) ** 2 + ((columns - centre) / sigma_pixels) ** 2))
    return kernel / kernel.sum()


def _vector_components(vector: Any, shape: tuple[int, int]) -> tuple[np.ndarray, np.ndarray]:
    """Return native y/x components for PyAutoLens vector structures."""

    values = np.asarray(getattr(vector, "native", vector), dtype=float)
    if values.shape != (*shape, 2):
        values = values.reshape((*shape, 2))
    return values[..., 0], values[..., 1]


def _curve_lists(curves: list[Any]) -> list[list[list[float]]]:
    return [np.asarray(curve, dtype=float).round(8).tolist() for curve in curves]


def _simulation_arrays(
    config: SimulationConfig,
    requested_products: list[str] | None = None,
) -> tuple[
    dict[str, np.ndarray],
    list[dict[str, float]],
    dict[str, list[list[list[float]]]],
    dict[str, float | int],
]:
    """Run one forward model and keep native arrays unrounded in memory."""

    requested = validate_product_ids(requested_products)
    requested_set = set(requested)
    grid, lens_light, lensed_source, ideal, point_images, source_tracer = _ideal_images(config)

    blurred_model, observed, noise = _apply_observing_effects(ideal, config)
    sigma_pixels = config.psf_sigma / config.pixel_scale
    blurred_lens = gaussian_filter(lens_light, sigma=max(sigma_pixels, 0.0), mode="nearest")
    blurred_source = gaussian_filter(lensed_source, sigma=max(sigma_pixels, 0.0), mode="nearest")
    signal_to_noise = np.divide(
        observed,
        noise,
        out=np.zeros_like(observed),
        where=noise > 0,
    )
    coordinates = (np.arange(config.image_pixels) - (config.image_pixels - 1) / 2) * config.pixel_scale
    yy, xx = np.meshgrid(coordinates[::-1], coordinates, indexing="ij")
    mask = ((xx * xx + yy * yy) <= config.mask_radius**2).astype(float)
    lens_light_subtracted = observed - blurred_lens
    raw_residual = observed - blurred_model
    residual = np.where(mask > 0, raw_residual, np.nan)
    normalized_residual = np.divide(
        raw_residual,
        noise,
        out=np.zeros_like(raw_residual),
        where=(noise > 0) & (mask > 0),
    )
    normalized_residual = np.where(mask > 0, normalized_residual, np.nan)
    chi_squared = normalized_residual**2
    residual_flux_fraction = np.divide(
        raw_residual,
        observed,
        out=np.zeros_like(raw_residual),
        where=(observed != 0) & (mask > 0),
    )
    residual_flux_fraction = np.where(mask > 0, residual_flux_fraction, np.nan)
    positive_floor = max(float(np.percentile(blurred_model[blurred_model > 0], 1)) if np.any(blurred_model > 0) else 1.0e-8, 1.0e-8)
    log10_model = np.log10(np.clip(blurred_model, positive_floor, None))

    masked_observed = np.where(mask > 0, observed, np.nan)
    source_plane = _source_plane_image(config, grid)

    products_all = {
        "observed": observed,
        "model": blurred_model,
        "ideal_model": ideal,
        "lens_light": blurred_lens,
        "lensed_source": blurred_source,
        "unblurred_lens_light": lens_light,
        "unblurred_lensed_source": lensed_source,
        "lens_light_subtracted": lens_light_subtracted,
        "residual": residual,
        "normalized_residual": normalized_residual,
        "chi_squared": chi_squared,
        "residual_flux_fraction": residual_flux_fraction,
        "noise": noise,
        "signal_to_noise": signal_to_noise,
        "log10_model": log10_model,
        "mask": mask,
        "masked_observed": masked_observed,
        "source_plane": source_plane,
        "psf": _psf_kernel(config),
    }

    lens_physics_keys = {
        "convergence",
        "potential",
        "deflection_y",
        "deflection_x",
        "deflection_magnitude",
        "shear_gamma_1",
        "shear_gamma_2",
        "shear_magnitude",
        "magnification",
        "jacobian_determinant",
        "tangential_eigenvalue",
        "radial_eigenvalue",
    }
    overlays: dict[str, list[list[list[float]]]] = {
        "tangential_critical_curves": [],
        "radial_critical_curves": [],
        "tangential_caustics": [],
        "radial_caustics": [],
    }
    if requested_set & lens_physics_keys:
        convergence = _native(source_tracer.convergence_2d_from(grid=grid))
        potential = _native(source_tracer.potential_2d_from(grid=grid))
        deflection_y, deflection_x = _vector_components(
            source_tracer.deflections_yx_2d_from(grid=grid),
            grid.shape_native,
        )
        lens_calc = al.LensCalc.from_tracer(source_tracer)
        shear_gamma_2, shear_gamma_1 = _vector_components(
            lens_calc.shear_yx_2d_via_hessian_from(grid=grid),
            grid.shape_native,
        )
        magnification = _native(lens_calc.magnification_2d_from(grid=grid))
        jacobian_determinant = np.divide(
            1.0,
            magnification,
            out=np.full_like(magnification, np.nan),
            where=np.isfinite(magnification) & (magnification != 0),
        )
        products_all.update(
            {
                "convergence": convergence,
                "potential": potential,
                "deflection_y": deflection_y,
                "deflection_x": deflection_x,
                "deflection_magnitude": np.hypot(deflection_y, deflection_x),
                "shear_gamma_1": shear_gamma_1,
                "shear_gamma_2": shear_gamma_2,
                "shear_magnitude": np.hypot(shear_gamma_1, shear_gamma_2),
                "magnification": magnification,
                "jacobian_determinant": jacobian_determinant,
                "tangential_eigenvalue": _native(lens_calc.tangential_eigen_value_from(grid=grid)),
                "radial_eigenvalue": _native(lens_calc.radial_eigen_value_from(grid=grid)),
            }
        )
        overlays = {
            "tangential_critical_curves": _curve_lists(lens_calc.tangential_critical_curve_list_from(grid=grid)),
            "radial_critical_curves": _curve_lists(lens_calc.radial_critical_curve_list_from(grid=grid)),
            "tangential_caustics": _curve_lists(lens_calc.tangential_caustic_list_from(grid=grid)),
            "radial_caustics": _curve_lists(lens_calc.radial_caustic_list_from(grid=grid)),
        }

    products = {product_id: products_all[product_id] for product_id in requested if product_id in products_all}
    missing = sorted(requested_set - set(products))
    if missing:
        raise RuntimeError(f"Product computers are missing: {', '.join(missing)}")
    valid = (mask > 0) & np.isfinite(normalized_residual) & np.isfinite(noise) & (noise > 0)
    total_chi_squared = float(np.nansum(chi_squared[valid]))
    noise_normalization = float(np.sum(np.log(2.0 * np.pi * noise[valid] ** 2)))
    summary: dict[str, float | int] = {
        "included_pixels": int(valid.sum()),
        "chi_squared": total_chi_squared,
        "mean_chi_squared_per_pixel": total_chi_squared / max(int(valid.sum()), 1),
        "noise_normalization": noise_normalization,
        "log_likelihood": -0.5 * (total_chi_squared + noise_normalization),
    }
    return products, point_images, overlays, summary


def simulate(
    values: Mapping[str, Any] | None = None,
    requested_products: list[str] | None = None,
) -> dict[str, Any]:
    started = perf_counter()
    config = SimulationConfig.from_mapping(values)
    products, point_images, overlays, summary = _simulation_arrays(
        config,
        requested_products=requested_products,
    )
    elapsed_ms = (perf_counter() - started) * 1000.0
    return {
        "engine": "PyAutoLens",
        "generated": True,
        "shape": [config.image_pixels, config.image_pixels],
        "pixel_scale": config.pixel_scale,
        "field_of_view": config.image_pixels * config.pixel_scale,
        "elapsed_ms": round(elapsed_ms, 1),
        "point_images": point_images,
        "overlays": overlays,
        "summary": summary,
        "config": asdict(config),
        "products": {name: _json_array(array) for name, array in products.items()},
        "ranges": {
            name: (
                [float(np.min(array[np.isfinite(array)])), float(np.max(array[np.isfinite(array)]))]
                if np.any(np.isfinite(array))
                else [0.0, 0.0]
            )
            for name, array in products.items()
        },
    }


"""
__Quick Fit__

The workbench offers a deliberately bounded least-squares fit for interactive
teaching.  Every likelihood evaluation still uses the same PyAutoLens forward
simulation as the main interface, but this is not a replacement for a full
PyAutoFit/Nautilus posterior search.  Only explicitly supported scalar parameters
may vary; all other quantities remain fixed at the supplied configuration.
"""

FIT_BOUNDS: dict[str, tuple[float, float]] = {
    "source_x": (-1.5, 1.5),
    "source_y": (-1.5, 1.5),
    "einstein_radius": (0.1, 2.2),
    "mass_axis_ratio": (0.35, 1.0),
    "mass_angle": (0.0, 180.0),
    "shear_gamma_1": (-0.25, 0.25),
    "shear_gamma_2": (-0.25, 0.25),
}


def quick_fit(
    data: Any,
    noise: Any,
    values: Mapping[str, Any],
    free_parameters: list[str],
    max_nfev: int = 28,
) -> dict[str, Any]:
    started = perf_counter()
    config = SimulationConfig.from_mapping(values)
    if not free_parameters or len(free_parameters) > 5:
        raise ValueError("Choose between one and five free parameters")
    if len(set(free_parameters)) != len(free_parameters):
        raise ValueError("Free parameters must be unique")
    unsupported = [name for name in free_parameters if name not in FIT_BOUNDS]
    if unsupported:
        raise ValueError(f"Unsupported fit parameters: {', '.join(unsupported)}")

    data_array = np.asarray(data, dtype=float)
    noise_array = np.asarray(noise, dtype=float)
    expected_shape = (config.image_pixels, config.image_pixels)
    if data_array.shape != expected_shape or noise_array.shape != expected_shape:
        raise ValueError(f"data and noise must both have shape {expected_shape}")

    coordinates = (np.arange(config.image_pixels) - (config.image_pixels - 1) / 2) * config.pixel_scale
    yy, xx = np.meshgrid(coordinates[::-1], coordinates, indexing="ij")
    valid = (
        np.isfinite(data_array)
        & np.isfinite(noise_array)
        & (noise_array > 0)
        & ((xx * xx + yy * yy) <= config.mask_radius**2)
    )
    if valid.sum() < 100:
        raise ValueError("The selected mask leaves too few valid pixels for fitting")

    base = asdict(config)
    base["add_poisson_noise"] = False
    initial = np.asarray([float(base[name]) for name in free_parameters], dtype=float)
    lower = np.asarray([FIT_BOUNDS[name][0] for name in free_parameters], dtype=float)
    upper = np.asarray([FIT_BOUNDS[name][1] for name in free_parameters], dtype=float)

    evaluation_count = 0

    def residuals(vector: np.ndarray) -> np.ndarray:
        nonlocal evaluation_count
        evaluation_count += 1
        candidate = dict(base)
        for name, value in zip(free_parameters, vector):
            candidate[name] = float(value)
        candidate_config = SimulationConfig.from_mapping(candidate)
        _, _, _, ideal, _, _ = _ideal_images(candidate_config)
        model, _, _ = _apply_observing_effects(ideal, candidate_config)
        return ((model - data_array) / noise_array)[valid]

    initial_residuals = residuals(initial)
    fit = least_squares(
        residuals,
        x0=initial,
        bounds=(lower, upper),
        max_nfev=max(8, min(int(max_nfev), 60)),
        loss="soft_l1",
        x_scale="jac",
    )
    fitted_config = dict(base)
    for name, value in zip(free_parameters, fit.x):
        fitted_config[name] = float(value)
    final_residuals = residuals(fit.x)
    fitted_simulation = simulate(fitted_config)
    return {
        "method": "bounded least squares with PyAutoLens forward model",
        "free_parameters": free_parameters,
        "initial": {name: float(value) for name, value in zip(free_parameters, initial)},
        "fitted": {name: float(value) for name, value in zip(free_parameters, fit.x)},
        "initial_chi_squared": float(np.sum(initial_residuals**2)),
        "final_chi_squared": float(np.sum(final_residuals**2)),
        "evaluations": evaluation_count,
        "success": bool(fit.success),
        "improved": bool(np.sum(final_residuals**2) < np.sum(initial_residuals**2)),
        "message": str(fit.message),
        "elapsed_ms": round((perf_counter() - started) * 1000.0, 1),
        "simulation": fitted_simulation,
    }


if __name__ == "__main__":
    result = simulate()
    print(
        f"PyAutoLens generated {len(result['products'])} products "
        f"at {result['shape']} in {result['elapsed_ms']:.1f} ms"
    )
