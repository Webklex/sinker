# ESLint Plugin for Sinker

This plugin brings the functionality of the [Sinker](https://github.com/webklex/sinker) CLI tool as an ESLint rule. It
scans your code for potentially dangerous "sinks" (e.g., `document.URL`, `innerHTML`, `localStorage`) that could lead
to vulnerabilities like DOM XSS or data leakage.

## Installation

The plugin is part of the `@webklex/sinker` package:

```bash
npm install @webklex/sinker --save-dev
```

## Usage

Add the plugin to your configuration:

##### TS Config (eslint.config.ts)

```ts
import { defineConfig } from 'eslint/config';
import { sinkerPlugin } from '@webklex/sinker/eslint-plugin';

export default defineConfig([
    {
        files: ['**/*.js', '**/*.ts'],
        plugins: { sinker: sinkerPlugin },
        rules: {
            'sinker/no-sink': [
                'warn',
                { contextDepth: 2, colors: true, minimal: true },
            ],
        },
    },
]);
```

##### JS Config (eslint.config.js)

```javascript
const sinkerPlugin = require('@webklex/sinker/eslint-plugin');

module.exports = [
    {
        files: ['**/*.js', '**/*.ts'],
        plugins: {
            sinker: sinkerPlugin,
        },
        rules: {
            'sinker/no-sink': ['warn', { contextDepth: 10, colors: true }],
        },
    },
];
```

### Recommended Configuration

Alternatively, use the recommended configuration which includes the plugin and sets the `no-sink` rule to `error`:

```javascript
const sinkerPlugin = require('@webklex/sinker/eslint-plugin');

module.exports = [sinkerPlugin.configs.recommended];
```

## Rules

### `sinker/no-sink`

This rule detects the use of dangerous sinks.

#### Suppressing Findings

You can suppress a finding by adding a `// @safe-sink` comment on the line immediately preceding the sink.

```javascript
// @safe-sink: Content is sanitized via DOMPurify
element.innerHTML = sanitizedContent;
```
