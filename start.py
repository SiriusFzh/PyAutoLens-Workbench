"""Launch the same local browser workbench on macOS and Windows."""

from __future__ import annotations

import hashlib
from pathlib import Path
import subprocess
import sys
import venv


ROOT = Path(__file__).resolve().parent
WORKBENCH = ROOT / "workbench"
ENVIRONMENT = WORKBENCH / ".venv"


def main() -> int:
    if sys.version_info < (3, 12):
        print("Python 3.12 or newer is required: https://www.python.org/downloads/")
        return 1

    python = ENVIRONMENT / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")
    requirements = WORKBENCH / "requirements.txt"
    stamp = ENVIRONMENT / ".workbench-requirements.sha256"
    digest = hashlib.sha256(requirements.read_bytes()).hexdigest()

    if not python.exists():
        print("First launch: creating the local Python environment.", flush=True)
        venv.EnvBuilder(with_pip=True).create(ENVIRONMENT)

    installed_digest = stamp.read_text().strip() if stamp.exists() else ""
    if installed_digest != digest:
        print("Installing dependencies; this may take several minutes.", flush=True)
        subprocess.run([str(python), "-m", "pip", "install", "--upgrade", "pip"], check=True)
        subprocess.run([str(python), "-m", "pip", "install", "-r", str(requirements)], check=True)
        stamp.write_text(digest + "\n")

    return subprocess.call([str(python), "-u", str(WORKBENCH / "server.py"), *sys.argv[1:]], cwd=WORKBENCH)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except KeyboardInterrupt:
        raise SystemExit(130)
    except subprocess.CalledProcessError as error:
        print("Dependency installation did not finish. Run the launcher again to retry.")
        raise SystemExit(error.returncode)
