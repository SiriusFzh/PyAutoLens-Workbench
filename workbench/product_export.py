"""
Research Product Export
=======================

Export workbench products from native float64 engine arrays, before browser JSON
rounding.  Individual figures support PNG, FITS and CSV; a research bundle keeps
configuration, provenance, overlays and all requested rasters together.

__Contents__

- **Artifacts:** Describe an HTTP-ready attachment.
- **Rendering:** Convert scalar arrays to the bundled AutoArray colour table.
- **Scientific Formats:** Serialize native arrays as FITS and CSV.
- **Bundles:** Package products, parameters and provenance into one ZIP file.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from importlib.metadata import version
from io import BytesIO, StringIO
import json
from typing import Any, Mapping
from zipfile import ZIP_DEFLATED, ZipFile

from astropy.io import fits
import numpy as np
from PIL import Image, PngImagePlugin
from autoarray.plot.segmentdata import segmentdata as autoarray_segmentdata

from lensing_engine import SimulationConfig, _simulation_arrays
from product_registry import PRODUCT_BY_ID, validate_product_ids


"""__Artifacts__"""


@dataclass(frozen=True)
class ExportArtifact:
    body: bytes
    content_type: str
    filename: str


"""__Rendering__"""

AUTOARRAY_PALETTE = np.asarray(
    [
        [
            round(255 * float(autoarray_segmentdata[channel][index][1]))
            for channel in ("red", "green", "blue")
        ]
        for index in range(len(autoarray_segmentdata["red"]))
    ],
    dtype=np.uint8,
)

PNG_MINIMUM_DIMENSION = 1200


def _display_limits(array: np.ndarray, product_id: str) -> tuple[float, float]:
    spec = PRODUCT_BY_ID[product_id]
    finite = np.asarray(array, dtype=float)[np.isfinite(array)]
    if finite.size == 0:
        return 0.0, 1.0
    if spec.norm == "categorical":
        return 0.0, 1.0
    if spec.norm == "symmetric":
        scale = max(float(np.percentile(np.abs(finite), 99.0)), 1.0e-12)
        return -scale, scale
    lower = 0.0 if spec.floor_zero else float(np.percentile(finite, 0.5))
    upper = float(np.percentile(finite, 99.5))
    if not upper > lower:
        padding = max(abs(lower) * 0.05, 1.0e-12)
        return lower - padding, upper + padding
    return lower, upper


def _png_export_size(native_width: int, native_height: int) -> tuple[int, int]:
    if min(native_width, native_height) >= PNG_MINIMUM_DIMENSION:
        return native_width, native_height
    if native_width <= native_height:
        export_height = (
            native_height * PNG_MINIMUM_DIMENSION + native_width - 1
        ) // native_width
        return PNG_MINIMUM_DIMENSION, export_height
    export_width = (
        native_width * PNG_MINIMUM_DIMENSION + native_height - 1
    ) // native_height
    return export_width, PNG_MINIMUM_DIMENSION


def _png_bytes(array: np.ndarray, product_id: str) -> bytes:
    values = np.asarray(array, dtype=float)
    lower, upper = _display_limits(values, product_id)
    scaled = np.clip((values - lower) / (upper - lower), 0.0, 1.0)
    finite = np.isfinite(values)
    native_height, native_width = values.shape
    export_size = _png_export_size(native_width, native_height)
    if export_size != (native_width, native_height):
        finite_weights = finite.astype(np.float32)
        display_values = np.where(finite, scaled, 0.0).astype(np.float32)
        if PRODUCT_BY_ID[product_id].norm == "categorical":
            scaled = np.asarray(
                Image.fromarray(display_values).resize(
                    export_size,
                    resample=Image.Resampling.NEAREST,
                ),
                dtype=float,
            )
        else:
            resized_values = np.asarray(
                Image.fromarray(display_values * finite_weights).resize(
                    export_size,
                    resample=Image.Resampling.LANCZOS,
                ),
                dtype=float,
            )
            resized_weights = np.asarray(
                Image.fromarray(finite_weights).resize(
                    export_size,
                    resample=Image.Resampling.LANCZOS,
                ),
                dtype=float,
            )
            scaled = np.divide(
                resized_values,
                resized_weights,
                out=np.zeros_like(resized_values),
                where=resized_weights > 1.0e-6,
            )
        finite = np.asarray(
            Image.fromarray(finite.astype(np.uint8)).resize(
                export_size,
                resample=Image.Resampling.NEAREST,
            ),
            dtype=bool,
        )
        scaled = np.clip(scaled, 0.0, 1.0)
    indexes = np.rint(np.nan_to_num(scaled, nan=0.0) * (len(AUTOARRAY_PALETTE) - 1)).astype(np.int32)
    rgb = AUTOARRAY_PALETTE[indexes]
    rgb[~finite] = np.asarray([248, 248, 246], dtype=np.uint8)
    image = Image.fromarray(rgb, mode="RGB")
    metadata = PngImagePlugin.PngInfo()
    metadata.add_text("Product", product_id)
    metadata.add_text("Unit", PRODUCT_BY_ID[product_id].unit)
    metadata.add_text("Display range", f"{lower:.10g}, {upper:.10g}")
    metadata.add_text("Native dimensions", f"{native_width} x {native_height}")
    metadata.add_text("Export dimensions", f"{image.width} x {image.height}")
    buffer = BytesIO()
    image.save(buffer, format="PNG", pnginfo=metadata, optimize=True)
    return buffer.getvalue()


"""__Scientific Formats__"""

FITS_UNITS = {
    "e⁻ s⁻¹": "electron/s",
    "log₁₀(e⁻ s⁻¹)": "log10(electron/s)",
    "arcsec²": "arcsec2",
    "κ": "dimensionless",
    "γ₁": "dimensionless",
    "γ₂": "dimensionless",
    "|γ|": "dimensionless",
    "μ": "dimensionless",
    "det A": "dimensionless",
    "λₜ": "dimensionless",
    "λᵣ": "dimensionless",
    "σ": "dimensionless",
    "S/N": "dimensionless",
    "χ² / pixel": "dimensionless",
    "normalized": "dimensionless",
    "fraction": "dimensionless",
    "0 / 1": "dimensionless",
}


def _fits_bytes(array: np.ndarray, product_id: str, config: SimulationConfig) -> bytes:
    spec = PRODUCT_BY_ID[product_id]
    hdu = fits.PrimaryHDU(np.asarray(array, dtype=np.float64))
    hdu.header["PRODUCT"] = (product_id, "Workbench product identifier")
    hdu.header["BUNIT"] = (FITS_UNITS.get(spec.unit, spec.unit.encode("ascii", "ignore").decode("ascii")), "Array unit")
    hdu.header["PIXSCALE"] = (config.pixel_scale, "arcsec per pixel")
    hdu.header["FRAME"] = (spec.coordinate_frame, "Coordinate frame")
    hdu.header["ENGINE"] = ("PyAutoLens", "Forward-model engine")
    buffer = BytesIO()
    hdu.writeto(buffer, checksum=True)
    return buffer.getvalue()


def _csv_bytes(array: np.ndarray, product_id: str, config: SimulationConfig) -> bytes:
    output = StringIO()
    spec = PRODUCT_BY_ID[product_id]
    output.write(f"# product={product_id}\n")
    output.write(f"# unit={spec.unit}\n")
    output.write(f"# pixel_scale_arcsec={config.pixel_scale:.12g}\n")
    output.write(f"# coordinate_frame={spec.coordinate_frame}\n")
    output.write("# array_order=row_y,column_x\n")
    np.savetxt(output, np.asarray(array, dtype=np.float64), delimiter=",", fmt="%.12g")
    return output.getvalue().encode("utf-8")


"""__Bundles__"""


def _native_products(
    values: Mapping[str, Any] | None,
    product_ids: list[str],
) -> tuple[SimulationConfig, dict[str, np.ndarray], list[dict[str, float]], dict[str, Any], dict[str, Any]]:
    config = SimulationConfig.from_mapping(values)
    products, point_images, overlays, summary = _simulation_arrays(
        config,
        requested_products=product_ids,
    )
    return config, products, point_images, overlays, summary


def export_product(
    values: Mapping[str, Any] | None,
    product_id: str,
    export_format: str,
) -> ExportArtifact:
    product_ids = validate_product_ids([product_id])
    export_format = export_format.lower()
    if export_format not in PRODUCT_BY_ID[product_id].download_formats:
        raise ValueError(f"Unsupported export format '{export_format}' for {product_id}")
    config, products, _, _, _ = _native_products(values, product_ids)
    array = products[product_id]
    if export_format == "png":
        return ExportArtifact(_png_bytes(array, product_id), "image/png", f"pyautolens-{product_id}.png")
    if export_format == "fits":
        return ExportArtifact(_fits_bytes(array, product_id, config), "image/fits", f"pyautolens-{product_id}.fits")
    if export_format == "csv":
        return ExportArtifact(_csv_bytes(array, product_id, config), "text/csv; charset=utf-8", f"pyautolens-{product_id}.csv")
    raise ValueError(f"Unsupported export format '{export_format}'")


def export_bundle(
    values: Mapping[str, Any] | None,
    product_ids: list[str] | None = None,
) -> ExportArtifact:
    selected = validate_product_ids(product_ids)
    config, products, point_images, overlays, summary = _native_products(values, selected)
    manifest = {
        "schema_version": 1,
        "engine": "PyAutoLens",
        "autolens_version": version("autolens"),
        "product_ids": selected,
        "array_precision": "float64 native engine arrays",
        "pixel_scale_arcsec": config.pixel_scale,
        "shape": [config.image_pixels, config.image_pixels],
        "formats": ["PNG preview", "FITS native array"],
        "products": [
            {
                "id": product_id,
                "category": PRODUCT_BY_ID[product_id].category,
                "unit": PRODUCT_BY_ID[product_id].unit,
                "coordinate_frame": PRODUCT_BY_ID[product_id].coordinate_frame,
                "normalization": PRODUCT_BY_ID[product_id].norm,
                "files": [f"products/{product_id}.png", f"products/{product_id}.fits"],
            }
            for product_id in selected
        ],
        "summary": summary,
        "point_images": point_images,
    }
    buffer = BytesIO()
    with ZipFile(buffer, "w", compression=ZIP_DEFLATED, compresslevel=6) as archive:
        archive.writestr("manifest.json", json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
        archive.writestr("config.json", json.dumps(asdict(config), ensure_ascii=False, indent=2) + "\n")
        archive.writestr(
            "overlays/critical_curves_and_caustics.json",
            json.dumps(overlays, ensure_ascii=False, indent=2) + "\n",
        )
        for product_id in selected:
            archive.writestr(f"products/{product_id}.png", _png_bytes(products[product_id], product_id))
            archive.writestr(f"products/{product_id}.fits", _fits_bytes(products[product_id], product_id, config))
    return ExportArtifact(
        body=buffer.getvalue(),
        content_type="application/zip",
        filename="pyautolens-research-products.zip",
    )
