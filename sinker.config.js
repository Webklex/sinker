module.exports = {
    ignoredSinks: [],
    ignored: [
        '**/dist/**',
        '**/node_modules/**',
        '**/coverage/**',
        '*.test.js',
        '*.spec.js',
        '*.min.js',
        '*.map',
        '**/src/sinks/*.ts',
    ],
    sinks: [],
    colors: true,
    minimal: false,
    contextDepth: 2,
};
