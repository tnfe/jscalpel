// rollup.config.js
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  input: './index.js',
  output: {
    file: 'dist/jscalpel.dev.js',
    format: 'umd',
    exports: 'default',
    name: 'jscalpel',
    sourceMap: true
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    // uglify({}, minify)
  ]
};