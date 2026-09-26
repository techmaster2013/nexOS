#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
V86="$ROOT/.v86-build"

rm -rf "$V86"
git clone --depth 1 https://github.com/copy/v86.git "$V86"

cd "$V86"
./tools/docker/alpine/build.sh

rm -rf "$ROOT/alpine"
mkdir -p "$ROOT/alpine"
cp -r images/alpine-rootfs-flat "$ROOT/alpine/"
cp images/alpine-fs.json "$ROOT/alpine/"

echo "Real Alpine Linux filesystem prepared for v86/WebAssembly."
