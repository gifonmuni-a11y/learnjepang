#!/usr/bin/env bash
# ============================================================
# setup-esbuild.sh
# Mengatasi crash SIGBUS binary esbuild linux-arm64 di
# lingkungan Android/PRoot. Solusi: pakai binary platform
# @esbuild/android-arm64 versi 0.21.5 (cocok dengan esbuild
# yang dipakai Vite 5).
#
# Menyimpan binary ke: ./.bin/esbuild-android
# Lalu Vite memakainya lewat env ESBUILD_BINARY_PATH.
# ============================================================
set -e

BIN_DIR="$(cd "$(dirname "$0")" && pwd)/.bin"
BIN="$BIN_DIR/esbuild-android"
VERSION="0.21.5"

if [ -x "$BIN" ] && "$BIN" --version 2>/dev/null | grep -q "$VERSION"; then
  echo "[setup-esbuild] esbuild android-arm64 v$VERSION sudah ada, lanjut."
  exit 0
fi

echo "[setup-esbuild] Mengunduh @esbuild/android-arm64 v$VERSION ..."
mkdir -p "$BIN_DIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

curl -sL "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-$VERSION.tgz" -o "$TMP/esbuild.tgz"
tar -xzf "$TMP/esbuild.tgz" -C "$TMP"
cp "$TMP/package/bin/esbuild" "$BIN"
chmod +x "$BIN"

if "$BIN" --version | grep -q "$VERSION"; then
  echo "[setup-esbuild] Berhasil: $BIN"
else
  echo "[setup-esbuild] GAGAL: binary tidak berjalan dengan benar." >&2
  exit 1
fi
