"""
Portable PyAutoLens Workbench Server
====================================

Serve the dependency-free browser interface and expose the local PyAutoLens
simulation engine over a small JSON interface.  The server binds to localhost
only: it is a desktop workbench, not a public internet service.

__Contents__

- **Environment:** Prepare reproducible local PyAutoLens imports.
- **Paths:** Resolve the portable project and static directories.
- **HTTP Interface:** Serve files, defaults, health and simulations.
- **Launch:** Pick a free local port and open the user's browser.
"""

from __future__ import annotations

import argparse
import json
import os
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import socket
from threading import BoundedSemaphore, Timer
from typing import Any
import webbrowser


"""
__Environment__

This folder is not the versioned ``autolens_workspace`` repository, so its local
launcher opts out of the unrelated workspace-version warning.  Public symbols are
still checked during development by the assistant's API audit gate.
"""
os.environ.setdefault("PYTHONUTF8", "1")
os.environ.setdefault("PYAUTO_SKIP_WORKSPACE_VERSION_CHECK", "1")

from lensing_engine import DEFAULT_CONFIG, quick_fit, simulate  # noqa: E402
from capability_registry import build_capabilities  # noqa: E402
from product_export import ExportArtifact, export_bundle, export_product  # noqa: E402
from product_registry import catalog_document  # noqa: E402
from autoarray.plot.segmentdata import segmentdata as autoarray_segmentdata  # noqa: E402


"""
__Paths__

All paths are relative to this file.  Moving or zipping the whole teacher project
therefore does not invalidate the application.  The existing 3D lesson is served
through one explicit route and remains independently usable.
"""
WORKBENCH_DIR = Path(__file__).resolve().parent
STATIC_DIR = WORKBENCH_DIR / "static"
PROJECT_DIR = WORKBENCH_DIR.parent
LESSON_PATH = PROJECT_DIR / "lessons" / "0002-lensing-planes-3d.html"

WORKBENCH_BRIDGE_SCRIPT = r"""
<script>
(() => {
  const frame = document.getElementById("codex-visualization");
  let pending = null;
  let attempts = 0;
  let stageSourceBefore = null;
  let lastProducts = null;
  let lastPalette = null;
  let lastExactScale = null;
  let lastLocale = "en";

  function localized(zh, en) {
    return lastLocale === "en" ? en : zh;
  }

  function markExactPending() {
    const doc = frame.contentDocument;
    const canvas = doc?.getElementById("lp3d-exact-canvas");
    const title = doc?.getElementById("lp3d-exact-title");
    const caption = doc?.getElementById("lp3d-exact-caption");
    if (canvas) {
      canvas.classList.remove("is-stale");
      canvas.classList.add("is-pending");
      canvas.dataset.state = "pending";
    }
    if (title) title.textContent = localized("PyAutoLens 精确图 · 正在计算", "Exact PyAutoLens image · calculating");
    if (caption) caption.textContent = localized(
      "上方预览继续实时变化；下方保留上一帧，计算完成后自动刷新。",
      "The preview remains interactive; the last exact frame is retained until the new calculation completes."
    );
  }

  function markExactFailed(message = "") {
    const doc = frame.contentDocument;
    const canvas = doc?.getElementById("lp3d-exact-canvas");
    const title = doc?.getElementById("lp3d-exact-title");
    const caption = doc?.getElementById("lp3d-exact-caption");
    if (canvas) {
      canvas.classList.remove("is-pending");
      canvas.classList.add("is-stale");
      canvas.dataset.state = "stale";
    }
    if (title) title.textContent = localized("PyAutoLens 精确图 · 计算失败", "Exact PyAutoLens image · calculation failed");
    if (caption) caption.textContent = localized(
      `保留上一帧精确图与色标。${message ? ` ${message}` : ""}`,
      `The last exact image and colourbar are retained.${message ? ` ${message}` : ""}`
    );
  }

  function drawExactObservation(products, suppliedPalette = null, suppliedScale = null) {
    const doc = frame.contentDocument;
    const canvas = doc?.getElementById("lp3d-exact-canvas");
    const observed = products?.observed;
    if (!canvas) return;
    if (!observed?.length) {
      markExactPending();
      return;
    }
    const rows = observed.length;
    const columns = observed[0].length;
    const finite = observed.flat().filter(Number.isFinite);
    if (!finite.length) {
      markExactPending();
      return;
    }
    const suppliedRange = Array.isArray(suppliedScale?.range)
      ? suppliedScale.range.slice(0, 2).map(Number)
      : [];
    const hasSuppliedRange = suppliedRange.length === 2 && suppliedRange.every(Number.isFinite);
    const dataLow = Math.min(...finite);
    const dataHigh = Math.max(...finite);
    let low = hasSuppliedRange ? Math.min(...suppliedRange) : dataLow;
    let high = hasSuppliedRange ? Math.max(...suppliedRange) : dataHigh;
    if (!(high > low)) {
      const padding = Math.max(Math.abs(low) * 0.05, 1e-8);
      low -= padding;
      high += padding;
    }
    const fallbackPalette = [
      [4, 0, 108], [11, 24, 193], [29, 80, 235], [48, 155, 80], [138, 194, 4],
      [234, 223, 2], [252, 169, 20], [254, 88, 15], [215, 5, 13],
    ];
    const palette = Array.isArray(suppliedPalette) && suppliedPalette.length >= 9
      ? suppliedPalette
      : fallbackPalette;
    const paletteColour = (value) => {
      const scaled = Math.max(0, Math.min(1, value)) * (palette.length - 1);
      const left = Math.floor(scaled);
      const right = Math.min(palette.length - 1, left + 1);
      const mix = scaled - left;
      return palette[left].map((channel, index) => Math.round(
        channel * (1 - mix) + palette[right][index] * mix
      ));
    };
    const offscreen = doc.createElement("canvas");
    offscreen.width = columns;
    offscreen.height = rows;
    const offContext = offscreen.getContext("2d", { alpha: false });
    const pixels = offContext.createImageData(columns, rows);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const value = Number.isFinite(observed[row][column]) ? observed[row][column] : low;
        const colour = paletteColour((value - low) / (high - low));
        const offset = 4 * (row * columns + column);
        pixels.data[offset] = colour[0];
        pixels.data[offset + 1] = colour[1];
        pixels.data[offset + 2] = colour[2];
        pixels.data[offset + 3] = 255;
      }
    }
    offContext.putImageData(pixels, 0, 0);
    const context = canvas.getContext("2d", { alpha: false });
    context.imageSmoothingEnabled = false;
    context.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    const image = doc.getElementById("lp3d-pyautolens-image");
    const panel = doc.getElementById("lp3d-observation-panel");
    const visualRow = doc.getElementById("lp3d-visual-row");
    const title = doc.getElementById("lp3d-exact-title");
    const caption = doc.getElementById("lp3d-exact-caption");
    const colourbar = doc.getElementById("lp3d-exact-colourbar");
    const colourbarBar = doc.getElementById("lp3d-exact-colourbar-bar");
    const maximumLabel = doc.getElementById("lp3d-exact-colourbar-max");
    const minimumLabel = doc.getElementById("lp3d-exact-colourbar-min");
    const unitLabel = doc.getElementById("lp3d-exact-colourbar-unit");
    const formatScaleValue = (value) => {
      if (!Number.isFinite(value)) return "—";
      if (value === 0) return "0";
      const magnitude = Math.abs(value);
      if (magnitude < 0.01 || magnitude >= 1000) return value.toExponential(2).replace("e+", "e");
      if (magnitude >= 100) return value.toFixed(0);
      if (magnitude >= 10) return value.toFixed(1);
      return value.toFixed(2);
    };
    if (colourbarBar) {
      const stops = palette.map((colour, index) => {
        const position = palette.length === 1 ? 0 : (index / (palette.length - 1)) * 100;
        return `rgb(${colour.join(" ")}) ${position.toFixed(2)}%`;
      });
      colourbarBar.style.backgroundImage = `linear-gradient(to top, ${stops.join(", ")})`;
    }
    if (maximumLabel) maximumLabel.textContent = formatScaleValue(high);
    if (minimumLabel) minimumLabel.textContent = formatScaleValue(low);
    const unit = typeof suppliedScale?.unit === "string" && suppliedScale.unit
      ? suppliedScale.unit
      : "e⁻ s⁻¹";
    if (unitLabel) unitLabel.textContent = unit;
    if (colourbar) {
      colourbar.dataset.minimum = String(low);
      colourbar.dataset.maximum = String(high);
      colourbar.dataset.unit = unit;
      colourbar.dataset.norm = suppliedScale?.norm || "linear";
    }
    if (image) image.hidden = true;
    canvas.hidden = false;
    canvas.classList.remove("is-pending");
    canvas.classList.remove("is-stale");
    canvas.dataset.state = "exact";
    if (panel) panel.hidden = false;
    visualRow?.classList.add("has-observation");
    if (title) title.textContent = localized("PyAutoLens 精确观测图", "Exact PyAutoLens observation");
    if (caption) caption.textContent = localized(
      "当前参数的精确射线追踪结果；不是预制关键帧。",
      "Exact ray tracing for the current parameters; this is not a preset keyframe."
    );
  }

  function readModel() {
    const doc = frame.contentDocument;
    const number = (id, fallback) => Number(doc?.getElementById(id)?.value ?? fallback);
    const root = doc?.getElementById("lens-planes-3d");
    const numberFromRoot = (key, fallback) => Number(root?.dataset?.[key] ?? fallback);
    return {
      sourceX: number("lp3d-source-x", 0),
      sourceY: number("lp3d-source-y", 0),
      lensRedshift: numberFromRoot("lensRedshift", 0.5),
      sourceRedshift: numberFromRoot("sourceRedshift", 1.0),
      rayDensity: number("lp3d-density", 48),
      lensModel: doc?.getElementById("lp3d-lens-model")?.value || "point",
      externalShear: number("lp3d-shear", 0),
      movableRedshift: number("lp3d-redshift-plane", 0.5),
    };
  }

  function emitChange(changed) {
    lastProducts = null;
    parent.postMessage({ type: "pyautolens-3d-change", changed, model: readModel() }, "*");
  }

  function attachControls() {
    const doc = frame.contentDocument;
    if (!doc || doc.documentElement.dataset.workbenchBridge === "ready") return;
    doc.documentElement.dataset.workbenchBridge = "ready";
    frame.contentWindow.addEventListener("openai:set_globals", () => {
      if (lastProducts) setTimeout(() => drawExactObservation(lastProducts, lastPalette, lastExactScale), 0);
    });
    const groups = {
      "lp3d-source-x": "source",
      "lp3d-source-y": "source",
      "lp3d-density": "density",
      "lp3d-lens-model": "lens-model",
      "lp3d-shear": "shear",
      "lp3d-redshift-plane": "redshift",
    };
    Object.entries(groups).forEach(([id, changed]) => {
      const input = doc.getElementById(id);
      input?.addEventListener("input", () => emitChange(changed));
      input?.addEventListener("change", () => emitChange(changed));
    });
    doc.addEventListener("pointerdown", (event) => {
      if (event.target?.closest?.("#lp3d-stage")) {
        const model = readModel();
        stageSourceBefore = `${model.sourceX}:${model.sourceY}`;
      }
    }, true);
    doc.addEventListener("pointerup", () => {
      if (stageSourceBefore == null) return;
      const model = readModel();
      const after = `${model.sourceX}:${model.sourceY}`;
      const changed = after !== stageSourceBefore;
      stageSourceBefore = null;
      if (changed) setTimeout(() => emitChange("source"), 0);
    }, true);
  }

  function apply(data) {
    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    if (!win || !doc?.getElementById("lp3d-source-x")) {
      pending = data;
      return false;
    }
    attachControls();
    lastLocale = data.locale === "zh-CN" || data.model?.language === "zh-CN" ? "zh-CN" : "en";
    document.documentElement.lang = lastLocale;
    document.title = localized("强引力透镜的三维几何", "3D gravitational-lensing geometry");
    frame.title = localized("强引力透镜的三维几何", "3D gravitational-lensing geometry");
    lastProducts = data.products || null;
    lastPalette = data.palette || null;
    lastExactScale = data.exactScale || null;
    win.dispatchEvent(new win.CustomEvent("openai:set_globals", {
      detail: { globals: { widgetState: { modelContent: data.model || {} } } },
    }));
    drawExactObservation(lastProducts, lastPalette, lastExactScale);
    if (data.exactStatus === "simulation-error") markExactFailed(data.exactError || "");
    pending = null;
    return true;
  }

  function announceReady() {
    if (!frame.contentDocument?.getElementById("lp3d-source-x")) {
      if (attempts++ < 40) setTimeout(announceReady, 100);
      return;
    }
    attachControls();
    if (pending) apply(pending);
    parent.postMessage({ type: "pyautolens-3d-ready" }, "*");
  }

  window.addEventListener("message", (event) => {
    if (event.source !== parent || event.data?.type !== "pyautolens-workbench-sync") return;
    apply(event.data);
  });
  frame.addEventListener("load", announceReady);
  setTimeout(announceReady, 0);
})();
</script>
"""

CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
}

CALCULATION_SLOTS = BoundedSemaphore(value=2)
AUTOARRAY_PALETTE = [
    [
        round(255 * float(autoarray_segmentdata[channel][index][1]))
        for channel in ("red", "green", "blue")
    ]
    for index in range(len(autoarray_segmentdata["red"]))
]


"""
__HTTP Interface__

``POST /api/simulate`` is the main calculation seam used by the browser.  It
accepts either a legacy configuration object or a ``config`` plus
``requested_products`` envelope, so the browser can request only the arrays its
current view needs.  ``POST /api/fit`` reuses that same forward model for a
bounded teaching fit, while the export endpoints regenerate native arrays for
PNG, FITS, CSV and ZIP attachments.
"""


class WorkbenchHandler(BaseHTTPRequestHandler):
    server_version = "PyAutoLensWorkbench/0.1"

    def log_message(self, format_string: str, *args: Any) -> None:
        print(f"[workbench] {self.address_string()} - {format_string % args}")

    def _send_bytes(
        self,
        body: bytes,
        content_type: str,
        status: HTTPStatus = HTTPStatus.OK,
        headers: dict[str, str] | None = None,
    ) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        for name, value in (headers or {}).items():
            self.send_header(name, value)
        self.end_headers()
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionAbortedError, ConnectionResetError):
            # A newer slider request superseded this response; the browser closed
            # the old connection, which is expected during rapid interaction.
            return

    def _send_json(
        self,
        payload: Any,
        status: HTTPStatus = HTTPStatus.OK,
    ) -> None:
        body = json.dumps(payload, ensure_ascii=False, allow_nan=False).encode("utf-8")
        self._send_bytes(body, "application/json; charset=utf-8", status)

    def _send_attachment(self, artifact: ExportArtifact) -> None:
        self._send_bytes(
            artifact.body,
            artifact.content_type,
            headers={"Content-Disposition": f'attachment; filename="{artifact.filename}"'},
        )

    def _send_file(self, path: Path) -> None:
        try:
            body = path.read_bytes()
        except FileNotFoundError:
            self._send_json({"error": "File not found"}, HTTPStatus.NOT_FOUND)
            return
        self._send_bytes(body, CONTENT_TYPES.get(path.suffix.lower(), "application/octet-stream"))

    def _send_lesson(self) -> None:
        try:
            lesson = LESSON_PATH.read_text(encoding="utf-8")
        except FileNotFoundError:
            self._send_json({"error": "3D lesson not found"}, HTTPStatus.NOT_FOUND)
            return
        lesson = lesson.replace(
            "https://esm.sh/three@0.161.0/examples/jsm/controls/OrbitControls.js",
            "/static/vendor/OrbitControls.js",
        ).replace(
            "https://esm.sh/three@0.161.0",
            "/static/vendor/three.module.js",
        ).replace(
            "https://unpkg.com/@floating-ui/core@1.7.3/dist/floating-ui.core.umd.min.js",
            "data:text/javascript,",
        ).replace(
            "https://unpkg.com/@floating-ui/dom@1.7.4/dist/floating-ui.dom.umd.min.js",
            "data:text/javascript,",
        ).replace(
            "https://unpkg.com/lucide@1.17.0/dist/umd/lucide.js",
            "data:text/javascript,",
        ).replace(
            "script-src 'unsafe-inline'",
            "script-src 'self' 'unsafe-inline'",
        ).replace(
            "script-src &#x27;unsafe-inline&#x27;",
            "script-src &#x27;self&#x27; &#x27;unsafe-inline&#x27;",
        )
        lesson = lesson.replace("</body>", WORKBENCH_BRIDGE_SCRIPT + "\n</body>", 1)
        self._send_bytes(lesson.encode("utf-8"), "text/html; charset=utf-8")

    def do_GET(self) -> None:  # noqa: N802  (BaseHTTPRequestHandler interface)
        clean_path = self.path.split("?", 1)[0]
        if clean_path in {"/", "/index.html"}:
            self._send_file(STATIC_DIR / "index.html")
            return
        if clean_path == "/api/health":
            self._send_json(
                {
                    "ok": True,
                    "engine": "PyAutoLens",
                    "lesson_available": LESSON_PATH.exists(),
                }
            )
            return
        if clean_path == "/api/defaults":
            self._send_json(DEFAULT_CONFIG)
            return
        if clean_path == "/api/capabilities":
            self._send_json(build_capabilities())
            return
        if clean_path == "/api/catalog":
            self._send_json(catalog_document())
            return
        if clean_path == "/api/colormap":
            self._send_json(
                {
                    "name": "autoarray",
                    "source": "PyAutoArray bundled segmentdata",
                    "colours": AUTOARRAY_PALETTE,
                }
            )
            return
        if clean_path == "/lesson/3d":
            self._send_lesson()
            return
        if clean_path.startswith("/static/"):
            relative = clean_path.removeprefix("/static/")
            candidate = (STATIC_DIR / relative).resolve()
            if STATIC_DIR.resolve() not in candidate.parents:
                self._send_json({"error": "Invalid path"}, HTTPStatus.BAD_REQUEST)
                return
            self._send_file(candidate)
            return
        self._send_json({"error": "Route not found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:  # noqa: N802  (BaseHTTPRequestHandler interface)
        clean_path = self.path.split("?", 1)[0]
        if clean_path not in {"/api/simulate", "/api/fit", "/api/export/product", "/api/export/bundle"}:
            self._send_json({"error": "Route not found"}, HTTPStatus.NOT_FOUND)
            return
        port = self.server.server_address[1]
        allowed_hosts = {f"127.0.0.1:{port}", f"localhost:{port}"}
        host = self.headers.get("Host", "")
        origin = self.headers.get("Origin")
        allowed_origins = {f"http://127.0.0.1:{port}", f"http://localhost:{port}"}
        if host not in allowed_hosts or (origin and origin not in allowed_origins):
            self._send_json({"error": "Local origin required"}, HTTPStatus.FORBIDDEN)
            return
        content_type = self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if content_type != "application/json":
            self._send_json({"error": "Content-Type must be application/json"}, HTTPStatus.UNSUPPORTED_MEDIA_TYPE)
            return
        if not CALCULATION_SLOTS.acquire(blocking=False):
            self._send_json({"error": "Calculation engine is busy"}, HTTPStatus.TOO_MANY_REQUESTS)
            return
        artifact: ExportArtifact | None = None
        result: Any = None
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 5_000_000:
                raise ValueError("Request body must be between 1 byte and 5 MB")
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            if not isinstance(payload, dict):
                raise ValueError("JSON body must be an object")
            if clean_path == "/api/simulate":
                if "config" in payload or "requested_products" in payload:
                    result = simulate(
                        payload.get("config") or {},
                        requested_products=payload.get("requested_products"),
                    )
                else:
                    result = simulate(payload)
            elif clean_path == "/api/fit":
                result = quick_fit(
                    data=payload.get("data"),
                    noise=payload.get("noise"),
                    values=payload.get("config") or {},
                    free_parameters=payload.get("free_parameters") or [],
                    max_nfev=payload.get("max_nfev", 28),
                )
            elif clean_path == "/api/export/product":
                artifact = export_product(
                    values=payload.get("config") or {},
                    product_id=str(payload.get("product_id") or ""),
                    export_format=str(payload.get("format") or "png"),
                )
            else:
                artifact = export_bundle(
                    values=payload.get("config") or {},
                    product_ids=payload.get("product_ids"),
                )
        except (ValueError, TypeError, json.JSONDecodeError) as error:
            self._send_json({"error": str(error)}, HTTPStatus.BAD_REQUEST)
            return
        except Exception as error:  # keep the desktop server alive and expose a concise message
            print(f"[workbench] simulation failed: {error!r}")
            self._send_json(
                {"error": "Simulation failed", "detail": str(error)},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )
            return
        finally:
            CALCULATION_SLOTS.release()
        if artifact is not None:
            self._send_attachment(artifact)
        else:
            self._send_json(result)


"""
__Launch__

The launcher scans a short localhost port range, starts a threaded server, and
opens the workbench once.  ``--no-browser`` is available for automated checks.
"""


def _free_port(start: int = 8765, stop: int = 8795) -> int:
    for port in range(start, stop + 1):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            try:
                probe.bind(("127.0.0.1", port))
            except OSError:
                continue
            return port
    raise RuntimeError("No free localhost port found between 8765 and 8795")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the portable PyAutoLens workbench")
    parser.add_argument("--port", type=int, default=0, help="localhost port (default: auto)")
    parser.add_argument("--no-browser", action="store_true", help="do not open a browser")
    args = parser.parse_args()
    port = args.port or _free_port()
    server = ThreadingHTTPServer(("127.0.0.1", port), WorkbenchHandler)
    url = f"http://127.0.0.1:{port}/"
    print(f"PyAutoLens workbench: {url}")
    print("Press Ctrl+C in this window to stop the local server.")
    if not args.no_browser:
        Timer(0.7, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nWorkbench stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
