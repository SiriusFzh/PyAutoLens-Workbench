"""
PyAutoLens Workbench Capability Registry
========================================

Describe what the installed PyAutoLens stack can provide separately from what
the desktop workbench currently adapts.  The browser can therefore present an
honest capability boundary instead of treating every importable class as a
ready-to-use no-code control.

__Contents__

- **Runtime:** Read installed package versions and public class catalogues.
- **Adapters:** Declare the profiles, datasets and fit paths wired into the UI.
- **Registry:** Return one versioned, JSON-serializable capability document.
"""

from __future__ import annotations

from functools import lru_cache
from importlib.metadata import version
import inspect
from typing import Any

import autofit as af
import autolens as al

from lensing_engine import FIT_BOUNDS, SimulationConfig
from product_registry import PRODUCT_CATEGORIES, PRODUCT_SPECS, catalog_document


"""__Runtime__"""


def _public_classes(namespace: Any, *, exclude: set[str] | None = None) -> list[str]:
    """Return public runtime classes without claiming that each has a UI adapter."""

    return sorted(
        name
        for name, value in vars(namespace).items()
        if not name.startswith("_")
        and inspect.isclass(value)
        and name not in (exclude or set())
    )


def _available_names(namespace: Any, candidates: list[str]) -> list[str]:
    return [name for name in candidates if hasattr(namespace, name)]


"""__Adapters__

These declarations describe implemented workbench paths, not the full library.
Adding a name here requires a matching compiler / validation adapter.
"""


WORKBENCH_ADAPTERS = {
    "datasets": ["simulated_imaging"],
    "mass_profiles": ["IsothermalSph", "Isothermal", "ExternalShear"],
    "light_profiles": ["Sersic"],
    "source_representations": ["Sersic", "PointSolver teaching renderer"],
    "scene_topology": {
        "lens_planes": 1,
        "source_planes": 1,
        "galaxies": "one lens + one source",
    },
    "observation": [
        "uniform Grid2D",
        "Gaussian PSF sigma via scipy.ndimage.gaussian_filter",
        "optional Poisson realization",
        "circular mask",
    ],
    "fit": {
        "engine": "scipy.optimize.least_squares",
        "free_parameters": sorted(FIT_BOUNDS),
        "maximum_simultaneous_free_parameters": 5,
        "maximum_evaluations": 60,
    },
}


"""__Registry__"""


@lru_cache(maxsize=1)
def build_capabilities() -> dict[str, Any]:
    mass_profiles = _public_classes(
        al.mp,
        exclude={"MassProfile", "MGEDecomposer", "LinearNDInterpolatorExt"},
    )
    light_profiles = _public_classes(al.lp)
    linear_light_profiles = _public_classes(
        al.lp_linear,
        exclude={"LightProfile", "LightProfileLinear", "LightProfileLinearObjFuncList"},
    )
    meshes = _public_classes(al.mesh, exclude={"Mesh"})
    regularizations = _public_classes(al.reg, exclude={"Regularization"})
    searches = _available_names(
        af,
        [
            "Nautilus",
            "DynestyStatic",
            "DynestyDynamic",
            "Emcee",
            "Zeus",
            "LBFGS",
            "BFGS",
            "GridSearch",
            "Sensitivity",
        ],
    )
    dataset_types = _available_names(
        al,
        ["Imaging", "Interferometer", "PointDataset", "WeakDataset"],
    )
    analysis_types = _available_names(
        al,
        ["AnalysisImaging", "AnalysisInterferometer", "AnalysisPoint", "AnalysisWeak"],
    )
    fit_types = _available_names(
        al,
        ["FitImaging", "FitInterferometer", "FitPointDataset", "FitWeak"],
    )
    products = [spec.id for spec in PRODUCT_SPECS]
    return {
        "schema_version": 2,
        "runtime": {
            "autolens": version("autolens"),
            "autofit": version("autofit"),
            "autoarray": version("autoarray"),
            "autogalaxy": version("autogalaxy"),
        },
        "workbench": {
            "status": "forward_simulation_teaching_workbench",
            "configuration_fields": sorted(SimulationConfig.__dataclass_fields__),
            "configuration_field_count": len(SimulationConfig.__dataclass_fields__),
            "products": products,
            "product_count": len(products),
            "product_categories": [category["id"] for category in PRODUCT_CATEGORIES],
            "product_catalog": catalog_document(),
            "adapters": WORKBENCH_ADAPTERS,
            "is_full_pyautolens_frontend": False,
        },
        "installed_catalog": {
            "mass_profiles": mass_profiles,
            "light_profiles": light_profiles,
            "linear_light_profiles": linear_light_profiles,
            "meshes": meshes,
            "regularizations": regularizations,
            "dataset_types": dataset_types,
            "analysis_types": analysis_types,
            "fit_types": fit_types,
            "searches": searches,
            "counts": {
                "mass_profiles": len(mass_profiles),
                "light_profiles": len(light_profiles),
                "linear_light_profiles": len(linear_light_profiles),
                "meshes": len(meshes),
                "regularizations": len(regularizations),
            },
        },
        "not_yet_adapted": [
            "FITS imaging import with real PSF and noise map",
            "arbitrary masks, oversampling and contaminant handling",
            "multi-galaxy and multi-plane model construction",
            "fixed / prior / linked / linear parameter modes",
            "PyAutoFit posterior searches and resumable jobs",
            "pixelized sources, meshes and regularization",
            "interferometer, point-dataset and weak-lensing workflows",
            "SLaM chaining, subhalo searches and potential corrections",
        ],
    }
