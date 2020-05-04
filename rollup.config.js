import visualizer from 'rollup-plugin-visualizer';
import progress from 'rollup-plugin-progress';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-babel-minify';
import clear from 'rollup-plugin-clear';
import typescript from 'rollup-plugin-typescript';

const outputDir = 'dist';
const name = 'Reactivity';

export default {
    // can be an array (for multiple inputs)
    // core input options
    input: 'src/index.ts', // required
    external: ['react', 'react-dom'],
    globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    plugins: [
        progress(),
        clear({
            // required, point out which directories should be clear.
            targets: [outputDir],
        }),
        resolve({
            extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
        }),
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'node_modules/react/index.js': [
                    'Component',
                    'PureComponent',
                    'Fragment',
                    'Children',
                    'createElement',
                    'cloneElement',
                    'createContext',
                    'forwardRef',
                    'isValidElement',
                    'useState',
                    'useEffect',
                    'useRef',
                ],
            },
        }),
        typescript(),
        babel({
            exclude: 'node_modules/**',
        }),
        minify(),
        visualizer(),
    ],
    output: {
        // required (can be an array, for multiple outputs)
        // core output options
        format: 'cjs', // required
        file: `${outputDir}/index.js`,
        name,
    },
};
