module.exports = {
    ignoredSinks: [],
    ignored: [
        '**/dist/**',
        '**/node_modules/**',
        '**/coverage/**',
        '*.test.js',
        '*.spec.js',
        '*.min.js',
        '*.map'
    ],
    sinks: [],
    colors: true,
    contextDepth: 3,
};
