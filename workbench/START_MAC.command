#!/bin/bash
set -e
WORKBENCH_DIR="$(cd "$(dirname "$0")" && pwd)"
if command -v python3.12 >/dev/null 2>&1; then
  PYTHON_BIN="python3.12"
elif command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
else
  echo "Python 3.12 or newer is required: https://www.python.org/downloads/macos/"
  exit 1
fi
"$PYTHON_BIN" "$WORKBENCH_DIR/../start.py"
