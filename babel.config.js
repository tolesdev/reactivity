module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                // Polyfill for the following environments
                targets: {
                    ie: '11',
                    browsers: [
                        'last 2 Safari versions',
                        'last 2 iOS versions',
                        'last 2 Chrome versions',
                        'last 2 Edge versions',
                    ],
                },
                // Transpile to CommonJS for browser support
                modules: 'cjs',
            },
        ],
        [
            '@babel/preset-typescript',
            {
                isTSX: true,
                allExtensions: true,
            },
        ],
        '@babel/preset-react',
    ],
    plugins: ['lodash'],
};
