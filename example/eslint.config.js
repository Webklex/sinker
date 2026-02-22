const sinkerPlugin = require('@webklex/sinker/eslint-plugin');
module.exports = [
    {
        files: ['**/*.js', '**/*.ts'],
        plugins: { sinker: sinkerPlugin },
        rules: {
            'commonjs-variable-in-esm': 'off',
            'sinker/no-sink': [
                'error', { contextDepth: 10, colors: true, minimal: true },
            ],
        },
    },
];
