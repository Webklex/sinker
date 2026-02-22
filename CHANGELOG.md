# Changelog

All notable changes to `webklex/sinker` will be documented in this file.

Updates should follow the [Keep a CHANGELOG](http://keepachangelog.com/) principles.

## [UNRELEASED]

### Fixed

- Consts update process simplified.

### Added

- None

### Breaking changes

- None

## 1.1.0 - 2026-02-22

### Fixed

- Improved configuration loading with `loadConfigSync` support and better error handling.
- Fixed path imports by removing `node:` prefix for better compatibility.
- Cleaned up reporter logic by extracting formatter into a separate module.
- Renamed sink groups from plural to singular for consistency (e.g., "Cookie Sinks" -> "Cookie Sink").

### Added

- Added ESLint plugin support.
- Added minimal output format via `-m` or `--minimal` flag.
- Added `--version` or `-v` flag to display the current version.
- Added explicit type annotations across the codebase for better maintainability.
- Added `HtmlScriptBlock` type for better HTML scanning support.
- Expanded test suite with additional unit tests for scanners and CLI components.

## 1.0.1 - 2026-02-15

### Fixed

- Scope added

## 1.0.0 - 2026-02-15

### Added

- initial release
