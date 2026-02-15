# Sinker


[![License: MIT][ico-license]][link-license]
[![Hits][ico-hits]][link-hits]
[![Snyk][ico-snyk]][link-snyk]


Sinker is a minimalistic security tool designed to scan your codebase for potentially dangerous "sinks" (e.g.,
`document.URL`, `innerHTML`, `localStorage`) that could lead to vulnerabilities like DOM XSS or data leakage.

Designed for modern web development, Sinker integrates seamlessly into CI/CD pipelines to alert developers of
unprotected sinks before they reach production.

## Features

- **Recursive Scanning**: Automatically scans `.ts`, `.js`, `.html`, and other relevant files.
- **Highly Customizable**: Load project-specific sinks and sources via a configuration file.
- **Safe Bypassing**: Explicitly flag intentional usage of sinks as safe with inline comments.
- **CI Ready**: Returns non-zero exit codes on violations, making it perfect for automated security gates.
- **Contextual Reports**: See the exact line and surrounding code for every finding.

## Quick Start

### Installation

```bash
# Using npm
npm install webklex/sinker --save-dev
```

### Usage

Run a scan on your project:

```bash
npx sinker .
```

#### CLI Options

| Option              | Description                                        |
|:--------------------|:---------------------------------------------------|
| `target`            | Path to a file or directory to scan (default: `.`) |
| `-nc`, `--no-color` | Disable colored output                             |
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
    contextDepth: 3,
};
```

### Configuration Options

- `sinks` (Array): Custom sink definitions.
- `ignoredSinks` (String[]): List of sink names/patterns to ignore globally.
- `ignored` (String[]): Glob patterns for files or directories to skip.
- `colors` (Boolean): Toggle colored output.
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

## Inspiration

- [Sources and Sinks Cheatsheet](https://github.com/Sivnerof/Sources-And-Sinks-Cheatsheet)
- [eslint-plugin-no-unsanitized](https://github.com/mozilla/eslint-plugin-no-unsanitized)

## License
The MIT License (MIT). Please see [License File][link-license] for more information.


[ico-license]: https://img.shields.io/badge/License-MIT-green.svg
[ico-hits]: https://hits.webklex.com/svg/webklex/sinker
[ico-snyk]: https://snyk-widget.herokuapp.com/badge/npm/webklex/sinker/badge.svg

[link-license]: LICENSE
[link-hits]: https://hits.webklex.com
[link-snyk]: https://snyk.io/vuln/npm:webklex%2Fsinker
