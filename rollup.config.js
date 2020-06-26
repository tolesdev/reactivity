import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import clear from 'rollup-plugin-clear';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import visualizer from 'rollup-plugin-visualizer';

const outputDir = 'dist';
const name = 'Reactivity';
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
    // can be an array (for multiple inputs)
    // core input options
    input: 'src/index.ts', // required
    external: ['react', 'react-dom', '@babel/runtime'],
    plugins: [
        clear({
            // required, point out which directories should be clear.
            targets: [outputDir],
        }),
        resolve({
            extensions,
        }),
        commonjs({
            include: /node_modules/,
            extensions,
        }),
        json(),
        typescript(),
        babel({
            extensions,
            exclude: 'node_modules/**',
            babelHelpers: 'runtime',
        }),
        visualizer(),
    ],
    output: [
        {
            format: 'cjs', // required
            file: `${outputDir}/index.js`,
            name,
        },
        {
            format: 'cjs', // required
            file: `${outputDir}/index.min.js`,
            name,
            sourcemap: true,
            plugins: [terser()],
        },
    ],
};
