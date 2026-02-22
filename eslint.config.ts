import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
// @ts-ignore
import { sinkerPlugin } from '@webklex/sinker/eslint-plugin';
// @ts-ignore
import pluginSecurity from 'eslint-plugin-security';

import eslintIgnores from './eslint.ignore';

export default defineConfig([
    eslintIgnores,
    tseslint.configs.recommended,
    pluginSecurity.configs.recommended,
    eslintPluginPrettierRecommended,
    importX.flatConfigs.recommended,
    {
        files: ['eslint-plugin/src/**/*.{js,ts,tsx,d.ts,d.tsx}'],
        settings: {
            'import-x/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
    },
    {
        files: ['scripts/**/*.{js,mjs,cjs}'],
        rules: {
            'security/detect-non-literal-fs-filename': 'off',
        },
    },
    {
        files: ['src/**/*.{js,ts,tsx,d.ts,d.tsx}'],
        rules: {
            'prettier/prettier': 'error',
            classPrivateMethods: 'off',
            'block-spacing': 'error',
            'no-debugger': 'off',
            'no-console': 'off',
            'commonjs-variable-in-esm': 'off',
            'no-empty-function': 'error',
            '@typescript-eslint/ban-ts-comment': 'off',
            'import-x/no-nodejs-modules': 'off',
            'security/detect-non-literal-regexp': 'off',
            'security/detect-non-literal-fs-filename': 'off',
            complexity: [
                'error',
                {
                    max: 7,
                },
            ],

            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                    maxEOF: 1,
                },
            ],
            'security/detect-object-injection': 'off',
            'import-x/no-dynamic-require': 'warn',
            'import-x/no-unresolved': 'error',
            'import-x/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    'newlines-between': 'always',
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    varsIgnorePattern: '^h$',
                },
            ],
            'sinker/no-sink': [
                'warn',
                {
                    contextDepth: 3,
                    colors: true,
                    minimal: true,
                },
            ],
        },
        plugins: { sinker: sinkerPlugin },
        settings: {
            'import-x/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: './tsconfig.json',
                },
            },
        },
    },
]);
