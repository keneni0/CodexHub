#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/import-assets.sh [SOURCE_DIR]
# Copies files from SOURCE_DIR into the project's public/ directory.
# Default SOURCE_DIR: /home/silver/Downloads/public

SRC=${1:-/home/silver/Downloads/public}
DST="$(dirname "$0")/../public"
DST=$(cd "$DST" && pwd)

if [ ! -d "$SRC" ]; then
  echo "Source directory does not exist: $SRC"
  echo "Please verify the path and try again."
  exit 1
fi

echo "Copying assets from $SRC to $DST"
# Use rsync to preserve structure and avoid copying node_modules or hidden files
rsync -av --progress --exclude='node_modules' --exclude='.git' "$SRC/" "$DST/"

echo "Assets copied. Run the dev server or redeploy to apply changes."
echo "You may need to run: npm run dev" 
