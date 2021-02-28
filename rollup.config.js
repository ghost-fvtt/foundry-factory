import shebang from 'rollup-plugin-preserve-shebang';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist/',
    entryFileNames: '[name].mjs',
    format: 'es',
    sourcemap: true,
  },
  plugins: [typescript({}), shebang()],
  external: [
    'chalk',
    'child_process',
    'commander',
    'fs-extra',
    'fs/promises',
    'inquirer',
    'nunjucks',
    'ora',
    'path',
    'url',
    'util',
  ],
};
