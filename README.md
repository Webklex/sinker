# Sinker

[![NPM Version][ico-npm-version]][link-npm]
[![NPM Downloads][ico-npm-downloads]][link-npm]
[![Hits][ico-hits]][link-hits]
[![License: MIT][ico-license]][link-license]
[![Snyk][ico-snyk]][link-snyk]

Sinker is a minimalistic security tool designed to scan your codebase for potentially dangerous "sinks" (e.g.,
`document.URL`, `innerHTML`, `localStorage`) that could lead to vulnerabilities like DOM XSS or data leakage.

Designed for modern web development, Sinker integrates seamlessly into CI/CD pipelines to alert developers of
unprotected sinks before they reach production.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
    - [Installation](#installation)
    - [Usage](#usage)
    - [ESLint Plugin](#eslint-plugin)
    - [CLI Options](#cli-options)
- [Configuration](#configuration)
- [Suppressing Findings](#suppressing-findings)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [Security](#security)
- [Inspiration](#inspiration)
- [License](#license)

## Features

- **Recursive Scanning**: Automatically scans `.ts`, `.js`, `.html`, and other relevant files.
- **ESLint Plugin**: Use it as a real-time linter for better IDE integration.
- **Highly Customizable**: Load project-specific sinks and sources via a configuration file.
- **Safe Bypassing**: Explicitly flag intentional usage of sinks as safe with inline comments.
- **CI Ready**: Returns non-zero exit codes on violations, making it perfect for automated security gates.
- **Contextual Reports**: See the exact line and surrounding code for every finding.

## Quick Start

### Installation

#### CLI Tool

```bash
# Using npm
npm install @webklex/sinker --save-dev
```

#### ESLint Plugin

Please take a look at the [ESLint Plugin README](https://github.com/Webklex/sinker/blob/main/eslint-plugin/README.md) for detailed information.

### Usage

#### CLI

Run a scan on your project:

```bash
npx sinker .
```

#### ESLint

Add the plugin to your `eslint.config.js` (Flat Config):

```javascript
const sinkerPlugin = require('@webklex/sinker/eslint-plugin');

module.exports = [
    {
        files: ['**/*.js', '**/*.ts'],
        plugins: {
            sinker: sinkerPlugin,
        },
        rules: {
            'sinker/no-sink': ['warn', { contextDepth: 10 }],
        },
    },
];
```

Or use the recommended configuration:

```javascript
const sinkerPlugin = require('@webklex/sinker/eslint-plugin');

module.exports = [sinkerPlugin.configs.recommended];
```

#### CLI Options

| Option              | Description                                        |
| :------------------ | :------------------------------------------------- |
| `target`            | Path to a file or directory to scan (default: `.`) |
| `-nc`, `--no-color` | Disable colored output                             |
| `-m`, `--minimal`   | Minimal output format                              |
| `--context-depth=N` | Number of context lines to show (overrides config) |
| `-h`, `--help`      | Show help message                                  |

**Example:**

```bash
npx sinker src --context-depth=5 --no-color
```

## Configuration

Sinker looks for a `sinker.config.js` file in your project root.

### Example `sinker.config.js`

```javascript
module.exports = {
    // Define custom sinks to watch for
    sinks: [
        {
            name: 'CUSTOM_STORAGE',
            description: 'Potential sensitive data leakage to custom storage',
            link: 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
            displayContextBefore: true,
            displayContextAfter: true,
            sinks: ['myApp.storage.set'],
        },
    ],
    // Ignore specific built-in sinks
    ignoredSinks: ['document.URL'],
    // Paths to exclude from scanning
    ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.test.ts',
        '**/*.spec.ts',
    ],
    colors: true,
    minimal: false,
    contextDepth: 3,
};
```

### Configuration Options

- `sinks` (Array): Custom sink definitions.
- `ignoredSinks` (String[]): List of sink names/patterns to ignore globally.
- `ignored` (String[]): Glob patterns for files or directories to skip.
- `colors` (Boolean): Toggle colored output.
- `minimal` (Boolean): Minimal output format.
- `contextDepth` (Number): Number of lines of context to display around violations.

---

## Suppressing Findings

If a sink usage is intentional and properly protected (e.g., sanitized with DOMPurify), you can suppress the alert by
adding a `@safe-sink` comment on the line immediately preceding the sink.

### JavaScript / TypeScript

```javascript
// @safe-sink: Content is sanitized via DOMPurify
element.innerHTML = sanitizedContent;
```

### HTML

```html
<!-- @safe-sink: URL is validated against an allowlist -->
<script>
    const url = document.URL;
</script>
```

---

## Contributing

### Adding Default Sinks

To contribute to the built-in sink definitions:

1. Create a new definition file in `src/sinks/` (e.g., `src/sinks/framework_sinks.ts`):
    ```typescript
    import { Sink } from './types';
    export const frameworkSinks: Sink = {
        name: 'Framework Sinks',
        description: 'Dangerous sinks specific to X framework.',
        link: 'https://example.com/security-docs',
        displayContextBefore: true,
        displayContextAfter: true,
        sinks: ['X.unsafeMethod'],
    };
    ```
2. Register it in `src/sinks/index.ts`:
    ```typescript
    import { frameworkSinks } from './framework_sinks';
    export const allSinkGroups: Sink[] = [
        // ... existing groups
        frameworkSinks,
    ];
    ```

### Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Generate coverage report
npm run test:coverage
```

## Changelog

Please see [CHANGELOG][link-changelog] for more information what has changed recently.

## Security

If you discover any security related issues, please email github@webklex.com instead of using the issue tracker.

## Inspiration

- [Sources and Sinks Cheatsheet](https://github.com/Sivnerof/Sources-And-Sinks-Cheatsheet)
- [eslint-plugin-no-unsanitized](https://github.com/mozilla/eslint-plugin-no-unsanitized)

## License

The MIT License (MIT). Please see [License File][link-license] for more information.

[ico-license]: https://img.shields.io/badge/License-MIT-green.svg
[ico-npm-version]: https://img.shields.io/npm/v/@webklex/sinker.svg?style=flat-square
[ico-npm-downloads]: https://img.shields.io/npm/dm/@webklex/sinker.svg?style=flat-square
[ico-hits]: https://hits.webklex.com/svg/webklex/sinker
[ico-snyk]: https://snyk.io/test/github/webklex/sinker/badge.svg
[link-license]: https://github.com/Webklex/sinker/blob/main/LICENSE
[link-npm]: https://www.npmjs.com/package/@webklex/sinker
[link-changelog]: https://github.com/Webklex/sinker/blob/main/CHANGELOG.md
[link-hits]: https://hits.webklex.com
[link-snyk]: https://snyk.io/test/github/webklex/sinker
